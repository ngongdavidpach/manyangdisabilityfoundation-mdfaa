import { UsersRound } from "lucide-react";
import type { PublicStaffMember } from "@/lib/publicContent.functions";

type StaffViewProps = {
  staff: PublicStaffMember[];
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function StaffView({ staff }: StaffViewProps) {
  return (
    <div className="animate-fade-in bg-slate-50">
      <section className="border-b border-slate-200 bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-blue-700">Our staff</p>
          <h1 className="text-3xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
            Meet the people behind the success of Manyang Disability Foundation
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16" aria-label="Staff profiles">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {staff.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {staff.map((member) => (
                <article
                  key={member.id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={`${member.full_name}, ${member.role_title}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 bg-blue-950 text-white">
                        <span className="flex h-24 w-24 items-center justify-center rounded-full border border-blue-300 bg-blue-900 text-3xl font-bold">
                          {initials(member.full_name) || <UsersRound className="h-10 w-10" />}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-widest text-blue-200">
                          Manyang Disability Foundation
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 sm:p-7">
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-700">
                      {member.role_title}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-950">{member.full_name}</h2>
                    {member.bio ? (
                      <p className="mt-4 text-sm leading-7 text-slate-600">{member.bio}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white px-6 py-16 text-center">
              <UsersRound className="mx-auto h-9 w-9 text-slate-400" />
              <h2 className="mt-4 text-lg font-bold text-slate-900">Staff profiles coming soon</h2>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}