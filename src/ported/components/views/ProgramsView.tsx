import { useNavigate, Link } from '@tanstack/react-router';
import React, { useState } from 'react';
import { 
  Accessibility, 
  HeartPulse, 
  GraduationCap, 
  Briefcase, 
  Scale, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { PROGRAMS, SUCCESS_STORIES } from '../../data/foundationData';

interface ProgramsViewProps {
  setCurrentPage: (page: string) => void;
}

export const ProgramsView: React.FC<ProgramsViewProps> = ({ setCurrentPage }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedStory, setSelectedStory] = useState(SUCCESS_STORIES[0]);

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

  const filteredPrograms = activeCategory === 'all' 
    ? PROGRAMS 
    : PROGRAMS.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-16 lg:space-y-24 py-10 animate-fade-in">
      
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider inline-block">
            Humanitarian Interventions
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Impact & Core Programs
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore how the Manyang Disability Foundation directly converts donor resources into durable mobility, inclusive classrooms, advanced healthcare, and sustainable self-reliance.
          </p>
        </div>
      </section>

      {/* Program Categories Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 justify-center border-b border-slate-200 pb-6">
          {[
            { id: 'all', label: 'All Core Pillars' },
            { id: 'mobility', label: 'Mobility & Aids' },
            { id: 'healthcare', label: 'Healthcare & Rehab' },
            { id: 'education', label: 'Inclusive Education' },
            { id: 'livelihood', label: 'Livelihoods & Skills' },
            { id: 'advocacy', label: 'Rights & Advocacy' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id 
                  ? 'bg-blue-900 text-white shadow-sm' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Detailed Program Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
          {filteredPrograms.map((program) => (
            <div 
              key={program.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="h-56 w-full relative">
                  <img 
                    src={program.image} 
                    alt={program.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">
                    {program.category}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-xs text-blue-900 text-xs font-bold px-3 py-1 rounded-md shadow-xs">
                    {program.impactStats}
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      {getProgramIcon(program.iconName)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {program.title}
                    </h3>
                  </div>

                  <p className="text-xs font-semibold text-blue-600">
                    {program.shortDescription}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                    {program.fullDescription}
                  </p>
                </div>
              </div>

              {/* Action footing */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate({ to: '/request' })}
                  className="flex-1 bg-white hover:bg-blue-50 text-blue-900 border border-slate-200 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>Request Support</span>
                </button>
                <button
                  onClick={() => navigate({ to: '/donate' })}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                  <span>Sponsor Pillar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Story Deep Spotlight */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
              Direct Beneficiary Spotlight
            </span>
            <h2 className="text-3xl font-bold tracking-tight mt-1">
              Real Stories of Dignity
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            
            {/* Selector list */}
            <div className="lg:col-span-1 space-y-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Select a Narrative:
              </span>
              {SUCCESS_STORIES.map((story) => {
                const isSelected = selectedStory.id === story.id;
                return (
                  <button
                    key={story.id}
                    onClick={() => setSelectedStory(story)}
                    className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-3 ${
                      isSelected 
                        ? 'bg-blue-600 text-white font-bold shadow-md' 
                        : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50'
                    }`}
                  >
                    <img 
                      src={story.image} 
                      alt={story.name} 
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="truncate">
                      <span className="block text-sm font-bold truncate">{story.name}</span>
                      <span className="block text-xs opacity-80 truncate">{story.aidType}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Display Box */}
            <div className="lg:col-span-2 bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 relative">
              <div className="absolute top-4 right-4 bg-amber-400/10 text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                {selectedStory.date}
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <img 
                  src={selectedStory.image} 
                  alt={selectedStory.name} 
                  className="w-full sm:w-48 h-48 rounded-xl object-cover shrink-0 shadow-inner"
                />

                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider block">
                      {selectedStory.location} • {selectedStory.aidType}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {selectedStory.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedStory.story}
                  </p>

                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-xs italic text-amber-300">
                      "{selectedStory.quote}"
                    </p>
                    <span className="block text-[11px] font-bold text-slate-400 mt-2">
                      – {selectedStory.name}, Beneficiary
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Cross-cutting initiatives */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-8 lg:p-12">
          <div className="max-w-3xl space-y-6">
            <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
              Emergency Mobility Response
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              The Critical Need for Mobile Wheelchair Repair Workshops
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              Procuring a brand new wheelchair is life-changing, but keeping it functional in rough environments requires constant maintenance. Many humanitarian agencies donate unadapted hospital chairs that break down within months. 
            </p>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              The Manyang Disability Foundation solves this by providing <strong>Direct Repair Grants</strong> and training local biomedical technicians. We host scheduled pop-up repair clinics where beneficiaries receive high-durability rubber tires, re-welded cross-braces, and custom cushions to prevent dangerous pressure sores.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Extends average chair lifecycle by 4+ years</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Prevents secondary pressure ulcer complications</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Stimulates local technician craft livelihoods</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Direct cash relief for broken hardware parts</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => navigate({ to: '/donate' })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg text-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Support Our Next Mobile Repair Camp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
