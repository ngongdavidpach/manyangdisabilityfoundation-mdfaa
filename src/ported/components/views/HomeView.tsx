import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Heart, ArrowRight, Download, PlayCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toEmbedUrl } from "../../lib/videoEmbed";

interface InsightContent {
  title?: string;
  body?: string;
  cover?: string;
  brochureUrl?: string;
  brochureName?: string;
  videoUrl?: string;
}

interface NewsRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
}

export const HomeView = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("news_articles")
      .select("id, slug, title, excerpt, cover_image, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => {
        setArticles((data as NewsRow[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Latest News & Updates */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            onClick={() => navigate({ to: "/news" })}
            className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1 group"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading latest news…</p>
        ) : articles.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
            <p className="text-sm text-slate-600">No news articles published yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <div
                key={article.id}
                onClick={() => navigate({ to: "/news/$slug", params: { slug: article.slug } })}
                className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between group"
              >
                <div>
                  {article.cover_image && (
                    <div className="h-40 w-full overflow-hidden relative">
                      <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <span className="text-[11px] text-slate-400 block mb-1">
                      {article.published_at
                        ? new Date(article.published_at).toLocaleDateString()
                        : ""}
                    </span>
                    <h2 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>
                    {article.excerpt && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{article.excerpt}</p>
                    )}
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end text-[11px]">
                  <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    Read ›
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Final Call to Action */}
      <section className="bg-blue-600 text-white text-center py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Heart className="w-12 h-12 mx-auto text-amber-300 fill-amber-300 animate-pulse" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Join Hands With Us Today
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto text-sm sm:text-base">
            Whether through a direct monthly donation, corporate partnership, or
            volunteering your local professional skills, you hold the power to
            completely transform the life of a person with a disability.
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

export default HomeView;
