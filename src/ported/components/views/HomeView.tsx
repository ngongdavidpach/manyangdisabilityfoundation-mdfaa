import { useNavigate, Link } from '@tanstack/react-router';
import React from 'react';
import { 
  Heart, 
  ArrowRight, 
  Accessibility, 
  Users, 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  Scale, 
  HeartHandshake, 
  Sparkles,
  CheckCircle,
  HelpCircle,
  Download,
  PlayCircle
} from 'lucide-react';
import { 
  FOUNDATION_INFO, 
  IMPACT_METRICS, 
  PROGRAMS, 
  SUCCESS_STORIES, 
  NEWS_ARTICLES 
} from '../../data/foundationData';
import { usePageSettings } from '../../hooks/usePageSettings';
import { toEmbedUrl } from '../../lib/videoEmbed';

interface HomeInsight {
  insight?: {
    title?: string;
    body?: string;
    cover?: string;
    brochureUrl?: string;
    brochureName?: string;
    videoUrl?: string;
  };
  showInsight?: boolean;
}

export const HomeView: React.FC = () => {
  const navigate = useNavigate();

  const { content: homeContent } = usePageSettings<HomeInsight>('home', {});
  const insight = homeContent?.insight;
  const showInsight = homeContent?.showInsight !== false && !!(insight?.title || insight?.body || insight?.cover || insight?.brochureUrl || insight?.videoUrl);
  const embedUrl = toEmbedUrl(insight?.videoUrl);

  const getProgramIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheelchair': return <Accessibility className="w-6 h-6 text-blue-600" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-blue-600" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-blue-600" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-blue-600" />;
      case 'Scale': return <Scale className="w-6 h-6 text-blue-600" />;
      default: return <Sparkles className="w-6 h-6 text-blue-600" />;
    }
  };

  const getMetricIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wheelchair': return <Accessibility className="w-8 h-8 text-amber-400" />;
      case 'Users': return <Users className="w-8 h-8 text-amber-400" />;
      case 'HeartPulse': return <HeartPulse className="w-8 h-8 text-amber-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-8 h-8 text-amber-400" />;
      default: return <Sparkles className="w-8 h-8 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1590845947670-c009801ffa74?auto=format&fit=crop&w=2000&q=80" 
            alt="Wheelchair distribution outreach" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-950 via-slate-900/95 to-slate-900/40 z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-xs border border-blue-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Restoring Independence • Building Inclusion</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Empowering Abilities, <br />
              <span className="text-amber-400">Restoring Dignity</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
              {FOUNDATION_INFO.mission}
            </p>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate({ to: '/donate' })}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg transition-all text-base flex items-center justify-center gap-2 group"
              >
                <Heart className="w-5 h-5 fill-slate-950 text-slate-950" />
                <span>Make a Secure Donation</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate({ to: '/request' })}
                className="bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-4 rounded-xl backdrop-blur-xs border border-white/10 transition-all text-base flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-5 h-5 text-blue-300" />
                <span>Request Mobility Aid</span>
              </button>
            </div>

            {/* Micro proof bar */}
            <div className="pt-8 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Direct Beneficiary Access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Independently Audited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Global Mobility Partnerships</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Real-time Impact Metrics Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-8 lg:p-10 -mt-20 relative z-30">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Measurable Humanitarian Impact
            </h2>
            <p className="text-xl font-bold text-slate-900 mt-1">
              Transparency in Every Single Gift
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {IMPACT_METRICS.map((metric) => (
              <div key={metric.id} className="flex flex-col items-center text-center p-4 rounded-xl bg-slate-50">
                <div className="w-14 h-14 rounded-full bg-blue-900 flex items-center justify-center mb-3 shadow-xs">
                  {getMetricIcon(metric.icon)}
                </div>
                <span className="text-3xl font-extrabold text-slate-900 block">
                  {metric.value}
                </span>
                <span className="text-xs font-medium text-slate-600 mt-1 block">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Foundation Insight (admin-managed) */}
      {showInsight && insight && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative bg-slate-100 min-h-[260px] lg:min-h-[420px]">
                {embedUrl ? (
                  <div className="absolute inset-0">
                    <iframe
                      src={embedUrl}
                      title={insight.title || 'Foundation intro video'}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : insight.cover ? (
                  <img src={insight.cover} alt={insight.title || 'Foundation'} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Sparkles className="w-16 h-16" />
                  </div>
                )}
              </div>
              <div className="p-8 lg:p-12 space-y-5">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600">
                  About Our Foundation
                </span>
                {insight.title && (
                  <h2 className="text-3xl font-bold tracking-tight text-slate-900">{insight.title}</h2>
                )}
                {insight.body && (
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{insight.body}</p>
                )}
                <div className="flex flex-wrap gap-3 pt-2">
                  {insight.brochureUrl && (
                    <a
                      href={insight.brochureUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download brochure
                    </a>
                  )}
                  {insight.videoUrl && !embedUrl && (
                    <a
                      href={insight.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold px-5 py-2.5 rounded-lg text-sm inline-flex items-center gap-2 transition-colors"
                    >
                      <PlayCircle className="w-4 h-4" />
                      Watch intro video
                    </a>
                  )}
                  <button
                    onClick={() => navigate({ to: '/about' })}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-1 px-2 py-2.5 group"
                  >
                    Learn more about us
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Real Event / Action callout: Yii Wheelchair repair bulletin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl overflow-hidden shadow-sm text-white">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="p-8 lg:p-12 lg:col-span-2 flex flex-col justify-between space-y-6">
              <div>
                <span className="bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                  Live Field Outreach Report
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mt-3">
                  Restoring Yii's Mobility: Emergency Repair Stipends Distributed Today
                </h3>
                <p className="text-blue-100 text-sm mt-3 leading-relaxed">
                  In many resource-constrained areas, acquiring a replacement wheelchair takes months. When local entrepreneur Yii's main transport wheel buckled, his entire family's livelihood stood still. The MDF Direct Aid Fund stepped in immediately with raw parts and specialized local mechanics to fully restore his customized mobility aid!
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => navigate({ to: '/news' })}
                  className="bg-white text-blue-900 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
                >
                  Read Full Story
                </button>
                <button
                  onClick={() => navigate({ to: '/donate' })}
                  className="bg-transparent hover:bg-white/10 text-amber-300 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors border border-amber-300/40"
                >
                  Fund a $25 Repair Kit
                </button>
              </div>
            </div>

            <div className="relative min-h-[240px] lg:min-h-auto bg-slate-800">
              <img 
                src="https://images.unsplash.com/photo-1565706596465-b1a82f3c7e09?auto=format&fit=crop&w=800&q=80" 
                alt="Wheelchair technical repairs in action" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 lg:hidden">
                <p className="text-xs text-slate-200 italic">"They restored my ability to provide for my family with dignity." – Yii</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Programs Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              What We Do
            </h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Our Five Pillars of Humanitarian Intervention
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/programs' })}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1 group shrink-0"
          >
            <span>Explore All Core Programs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS.slice(0, 3).map((program) => (
            <div 
              key={program.id}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="h-48 w-full overflow-hidden relative">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-bold text-blue-800 shadow-xs">
                    {program.category.toUpperCase()}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      {getProgramIcon(program.iconName)}
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">
                      {program.title}
                    </h3>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {program.shortDescription}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  {program.impactStats}
                </span>
                <button
                  onClick={() => navigate({ to: '/programs' })}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Learn about {program.title}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary programs fast links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROGRAMS.slice(3).map((program) => (
            <div 
              key={program.id}
              onClick={() => navigate({ to: '/programs' })}
              className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                {getProgramIcon(program.iconName)}
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold text-blue-600 uppercase block">{program.category}</span>
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{program.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{program.shortDescription}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Success Stories */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Voices of Inclusion
            </h2>
            <p className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Real Lives Restored by Your Generosity
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story) => (
              <div key={story.id} className="bg-white rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{story.name}, {story.age}</h4>
                      <span className="text-xs text-slate-500">{story.location} • {story.aidType}</span>
                    </div>
                  </div>

                  <p className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-lg border-l-2 border-amber-500 mb-4">
                    "{story.quote}"
                  </p>

                  <h5 className="font-bold text-sm text-slate-900 mb-1">{story.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-4">
                    {story.story}
                  </p>
                </div>

                <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
                  <button 
                    onClick={() => navigate({ to: '/programs' })} 
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Read Full Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Get Assistance Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-block bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded text-xs uppercase tracking-wider">
                Direct Application Portal
              </div>
              
              <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                Do You or a Loved One Require Assistive Devices or Direct Grants?
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Our application procedure is fully open, free of charge, and designed for utmost dignity. We assist with custom manual wheelchairs, rugged tricycles, continuous physical therapy, educational kits, and livelihood seed grants. 
              </p>

              <div className="space-y-3">
                {[
                  "No cost to the beneficiary or family",
                  "Fast review process by our internal medical panel",
                  "Direct home or community delivery available"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div>
                <button
                  onClick={() => navigate({ to: '/request' })}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow-xs transition-colors text-sm inline-flex items-center gap-2"
                >
                  <span>Submit an Aid Request Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200 space-y-6">
              <h4 className="font-bold text-base text-slate-900 border-b border-slate-200 pb-3">
                Application & Distribution Flow
              </h4>

              <div className="space-y-4">
                {[
                  { step: "01", title: "Submit Form", desc: "Fill out basic personal and medical parameters via our secure request portal." },
                  { step: "02", title: "Review & Assessment", desc: "Our liaison staff verify the device specifications or financial program compatibility." },
                  { step: "03", title: "Procurement & Provision", desc: "The custom aid or sponsorship is officially dispatched directly to your community!" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">Questions about applying?</span>
                <button 
                  onClick={() => navigate({ to: '/about' })}
                  className="text-xs font-bold text-blue-600 hover:underline mt-0.5"
                >
                  View our comprehensive Eligibility Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Updates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Foundation Dispatches
            </h2>
            <p className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Recent News & Field Reports
            </p>
          </div>
          <button
            onClick={() => navigate({ to: '/news' })}
            className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 group"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ARTICLES.slice(0, 3).map((article) => (
            <div 
              key={article.id}
              onClick={() => navigate({ to: '/news/$slug', params: { slug: String(article.id) } })}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-40 w-full overflow-hidden relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    {article.category}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] text-slate-400 block mb-1">
                    {article.date} • {article.readTime}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">By {article.author}</span>
                <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">Read ›</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-blue-600 text-white text-center py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Heart className="w-12 h-12 mx-auto text-amber-300 fill-amber-300 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Join Hands With Us Today
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
            Whether through a direct monthly donation, corporate partnership, or volunteering your local professional skills, you hold the power to completely transform the life of a person with a disability.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button 
              onClick={() => navigate({ to: '/donate' })}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              Donate Now
            </button>
            <button 
              onClick={() => navigate({ to: '/get-involved' })}
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3.5 rounded-xl border border-blue-500 transition-all text-sm"
            >
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
