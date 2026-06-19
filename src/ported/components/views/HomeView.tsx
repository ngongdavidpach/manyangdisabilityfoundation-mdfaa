import { useNavigate, Link } from "@tanstack/react-router";
import React from "react";
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
  PlayCircle,
  Image as ImageIcon,
  Newspaper,
  Calendar,
  MapPin
} from 'lucide-react';
import { FOUNDATION_INFO, NEWS_ARTICLES, type Program, type SuccessStory, type ImpactMetric, type NewsArticle } from '../../data/foundationData';
import { usePageSettings } from '../../hooks/usePageSettings';
import { toEmbedUrl } from '../../lib/videoEmbed';
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
          {NEWS_ARTICLES.slice(0, 3).map((article: NewsArticle) => (
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
            <button
              onClick={() => navigate({ to: "/news" })}
              className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 group"
            >
              <span>All Articles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="bg-blue-600 text-white text-center py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Heart className="w-12 h-12 mx-auto text-amber-300 fill-amber-300 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Join Hands With Us Today
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
            Whether through a direct monthly donation, corporate partnership, or volunteering your
            local professional skills, you hold the power to completely transform the life of a
            person with a disability.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              onClick={() => navigate({ to: "/donate" })}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              Donate Now
            </button>
            <button
              onClick={() => navigate({ to: "/get-involved" })}
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
