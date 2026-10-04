import * as React from 'react'
import { render } from '@react-email/render'
import { TEMPLATES } from './registry'

// Server-only: reads LOVABLE_API_KEY and RESEND_API_KEY. Never import from client components.

const SITE_NAME = "Manyang Disability Foundation"
// Verified sending subdomain registered in Resend (DNS managed in Cloudflare).
const SENDER_DOMAIN = "send.manyangdisabilityfoundation.org"
const FROM_ADDRESS = `${SITE_NAME} <noreply@${SENDER_DOMAIN}>`

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend'

export type SendTemplateEmailResult =
  | { sent: true }
  | { sent: false; reason: 'recipient_suppressed' }

export interface SendTemplateEmailOptions {
  templateData?: Record<string, any>
  /** Dedupes retries of the same logical send; defaults to a random UUID (no dedupe). */
  idempotencyKey?: string
  replyTo?: string
}

/**
 * Renders a registered template and sends it through Resend via the Lovable
 * connector gateway. The site's own per-category email preferences are
 * enforced by the caller (managed-send.server.ts); Resend handles delivery,
 * bounces and its own suppression list.
 */
export async function sendTemplateEmail(
  templateName: string,
  to: string,
  options: SendTemplateEmailOptions = {}
): Promise<SendTemplateEmailResult> {
  const apiKey = process.env['LOVABLE_API_KEY']
  const resendKey = process.env['RESEND_API_KEY']
  if (!apiKey || !resendKey) {
    throw new Error('Email is not configured (missing LOVABLE_API_KEY or RESEND_API_KEY)')
  }

  const template = TEMPLATES[templateName]
  if (!template) {
    throw new Error(
      `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(', ')}`
    )
  }

  // Template-level `to` takes precedence — notification templates always
  // send to their fixed address.
  const recipient = template.to || to
  if (!recipient) {
    throw new Error('Recipient is required (the template defines no fixed recipient)')
  }

  const templateData = options.templateData ?? {}
  const element = React.createElement(template.component, templateData)
  const html = await render(element)
  const text = await render(element, { plainText: true })
  const subject =
    typeof template.subject === 'function'
      ? template.subject(templateData)
      : template.subject

  const response = await fetch(`${GATEWAY_URL}/emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'X-Connection-Api-Key': resendKey,
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [recipient],
      subject,
      html,
      text,
      reply_to: options.replyTo,
      headers: options.idempotencyKey
        ? { 'X-Idempotency-Key': options.idempotencyKey }
        : undefined,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text()
    console.error(`Resend send failed [${response.status}]: ${errorBody}`)
    // Resend returns 403 when the recipient is on its suppression list.
    if (response.status === 403 && /suppress/i.test(errorBody)) {
      return { sent: false, reason: 'recipient_suppressed' }
    }
    throw new Error(`Resend send failed [${response.status}]: ${errorBody}`)
  }

  return { sent: true }
}
