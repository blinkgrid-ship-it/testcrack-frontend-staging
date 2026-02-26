import React, { useState, useEffect, useCallback } from 'react';
import { 
  Zap, Settings, Play, Pause, ArrowLeft, 
  BrainCircuit, Briefcase, BookOpen, Activity, CheckCircle2,
  Clock, Hash
} from 'lucide-react';

// --- Imports from your architecture ---
import { StudentSidebar } from "./dashboard/StudentSidebar";
import { StudentTopbar } from "./dashboard/StudentTopbar";
import { PremiumModal } from "@/features/payment/components/PremiumModal";

// --- Types & Interfaces ---
type Category = 'tech' | 'business' | 'literature';

interface Report {
  title: string;
  source: string;
  text: string;
}

const REPORTS: Record<Category, Report> = {
  tech: {
    title: "AI Infrastructure Investment Trends 2026",
    source: "TECHCRUNCH MARKET REPORT",
    text: "With premium you get to focus on the music. Explore a vast catalog of millions of songs without hearing ads, or download your playlists to listen to them anywhere. You can also play your favorite songs in any order, with the freedom to skip forward and backward as much as you'd like. Your audio, your control. Tap the banner to learn more."
  },
  business: {
    title: "The Future of Remote Executive Leadership",
    source: "HARVARD BUSINESS REVIEW",
    text: "Only a true bestie says yes to all your impulsive decisions. For me, that's Spotify mixes. 4 AM gym? Boom. Hype workout mix is ready. Late night drive? Driving mix is up and about. Jo bhi karne ka mann ho, random ya totally unplanned, yeh hamesha ready hota hai. Meanwhile my college besties? Never mind. For every mood, there's a Spotify mix waiting. Just add 'mix' to your search to get a playlist made for you."
  },
  literature: {
    title: "The Art of Strategic Thinking",
    source: "CLASSIC BUSINESS LITERATURE",
    text: "Strategy is not merely about planning; it is about recognizing patterns in chaos. The most successful leaders do not just react to the world around them; they anticipate the shifts before they occur. By cultivating a deep understanding of human behavior and market dynamics, one can navigate even the most turbulent waters with grace and precision. True foresight is the ultimate competitive advantage."
  }
};

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: 'tech', label: 'Tech & VC', icon: <BrainCircuit size={16} className="mr-2" /> },
  { id: 'business', label: 'Business Strategy', icon: <Briefcase size={16} className="mr-2" /> },
  { id: 'literature', label: 'Literature', icon: <BookOpen size={16} className="mr-2" /> },
];

export default function SpeedReading() {
  const [activeTab, setActiveTab] = useState("speed-reading");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [view, setView] = useState<'dashboard' | 'reader'>('dashboard');
  const [activeCategory, setActiveCategory] = useState<Category>('tech');
  const [showSettings, setShowSettings] = useState(false);
  const [wpm, setWpm] = useState(400);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleStartReading = useCallback(() => {
    const rawText = REPORTS[activeCategory].text;
    const wordArray = rawText.trim().split(/\s+/);
    setWords(wordArray);
    setCurrentWordIndex(0);
    setIsFinished(false);
    setView('reader');
    setTimeout(() => setIsPlaying(true), 500);
  }, [activeCategory]);

  const handleBack = useCallback((e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    setIsPlaying(false);
    setIsFinished(false);
    setCurrentWordIndex(0);
    setView('dashboard');
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isFinished) {
      const msPerWord = 60000 / wpm;
      interval = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= words.length - 1) {
            setIsPlaying(false);
            setIsFinished(true);
            return prev;
          }
          return prev + 1;
        });
      }, msPerWord);
    }
    return () => clearInterval(interval);
  }, [isPlaying, wpm, words.length, isFinished]);

  const renderWord = (word: string) => {
    if (!word) return null;
    const pivot = Math.max(0, Math.ceil(word.length * 0.35) - 1);
    const start = word.substring(0, pivot);
    const mid = word.substring(pivot, pivot + 1);
    const end = word.substring(pivot + 1);
    return (
      <div className="flex items-center text-4xl md:text-6xl font-medium tracking-wide">
        <span className="text-slate-800 dark:text-gray-100 text-right w-[120px] md:w-[250px]">{start}</span>
        <span className="text-red-500 w-[20px] md:w-[30px] text-center">{mid}</span>
        <span className="text-slate-800 dark:text-gray-100 text-left w-[120px] md:w-[250px]">{end}</span>
      </div>
    );
  };

  const progressPercentage = words.length > 0 
    ? ((currentWordIndex + (isFinished ? 1 : 0)) / words.length) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
      <StudentSidebar 
        activeTab='speed'
        onTabChange={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={`min-h-screen flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        <StudentTopbar onUpgradeClick={() => setShowPremiumModal(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
          <div className="w-full max-w-5xl">
            {view === 'dashboard' ? (
              <div className="w-full mt-4 bg-white dark:bg-[#121118] text-slate-900 dark:text-white border border-slate-200 dark:border-gray-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                <Zap className="absolute -top-10 -right-10 text-purple-500/10 dark:text-purple-900/20" size={240} strokeWidth={1} />
                <div className="relative z-10">
                  <div className="inline-flex items-center space-x-2 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-semibold mb-6">
                    <Zap size={14} />
                    <span>RSVP • Contextual Priming</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Read a Full Report in<br /><span className="text-purple-600 dark:text-purple-400">15 Minutes</span> with 90% Retention</h1>
                  <p className="text-slate-600 dark:text-gray-400 max-w-2xl mb-8 text-sm md:text-base">Rapid Serial Visual Presentation flashes words at 200-800 WPM calibrated to your comprehension.</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {CATEGORIES.map((cat) => (
                      <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center px-4 py-2 rounded-md text-sm transition-all ${activeCategory === cat.id ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-gray-800'}`}>
                        {cat.icon}{cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-50 dark:bg-[#1C1A24] border border-slate-200 dark:border-gray-700/50 rounded-xl p-5 mb-8 w-full max-w-md">
                    <p className="text-xs text-purple-600 font-semibold mb-1 tracking-wider uppercase">{REPORTS[activeCategory].source}</p>
                    <h3 className="text-lg font-semibold mb-2">{REPORTS[activeCategory].title}</h3>
                    <p className="text-xs text-slate-500">{REPORTS[activeCategory].text.split(' ').length} words • ~{Math.ceil(REPORTS[activeCategory].text.split(' ').length / wpm)} min</p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={handleStartReading} className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md w-full sm:w-auto"><Play size={18} fill="currentColor" /><span>Start Speed Reading</span></button>
                    <button onClick={() => setShowSettings(!showSettings)} className="flex items-center justify-center space-x-2 bg-white dark:bg-[#1C1A24] border border-slate-200 dark:border-gray-700 px-6 py-3 rounded-lg font-medium w-full sm:w-auto"><Settings size={18} /><span>Settings</span></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col h-auto md:h-[75vh] min-h-[500px] justify-between text-slate-900 dark:text-white">
                
                {/* --- RESPONSIVE HEADER --- */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white dark:bg-[#121118] border border-slate-200 dark:border-gray-800 p-6 rounded-xl shadow-sm">
                  <div className="text-center md:text-left w-full md:w-auto">
                    <h2 className="text-lg font-bold truncate max-w-[280px] md:max-w-md mx-auto md:mx-0">{REPORTS[activeCategory].title}</h2>
                    <p className="text-xs text-slate-500">{REPORTS[activeCategory].source}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-center">
                      <span className="text-[10px] text-slate-500 font-bold tracking-widest">SPEED</span>
                      <input 
                        type="range" min="200" max="800" step="25" value={wpm}
                        onChange={(e) => setWpm(Number(e.target.value))}
                        className="w-full sm:w-32 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                      <span className="text-xs font-bold w-12">{wpm}</span>
                    </div>

                    <div className="flex space-x-2 w-full sm:w-auto justify-center">
                      <button onClick={handleBack} className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-2 rounded bg-slate-100 dark:bg-gray-800 text-sm font-medium"><ArrowLeft size={16} /><span>Back</span></button>
                      {!isFinished && (
                        <button onClick={() => setIsPlaying(!isPlaying)} className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-2 rounded text-sm font-medium ${isPlaying ? 'bg-slate-100 dark:bg-gray-800' : 'bg-purple-600 text-white'}`}>
                          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                          <span>{isPlaying ? 'Pause' : 'Resume'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* RSVP Display Area */}
                <div className="flex-1 my-6 bg-white dark:bg-[#0B0A0F] border border-slate-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center relative min-h-[300px] shadow-inner">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-12 bg-slate-300 dark:bg-gray-800/50 -mt-6"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-12 bg-slate-300 dark:bg-gray-800/50 mt-6"></div>
                  {isFinished ? (
                    <div className="text-center animate-in zoom-in-95">
                      <div className="text-6xl md:text-8xl font-bold mb-4">83%</div>
                      <div className="text-xl text-purple-600 font-medium">Estimated Retention</div>
                    </div>
                  ) : renderWord(words[currentWordIndex])}
                </div>

                {/* Footer Metrics */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-2 bg-slate-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600 transition-all duration-150" style={{ width: `${progressPercentage}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 whitespace-nowrap">{currentWordIndex + (isFinished ? 1 : 0)} / {words.length}</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-white dark:bg-[#121118] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex flex-col items-center">
                      <Activity size={18} className="text-purple-500 mb-2" /><span className="text-xl font-bold">{wpm}</span><span className="text-[10px] text-slate-500 uppercase">Current WPM</span>
                    </div>
                    <div className="bg-white dark:bg-[#121118] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex flex-col items-center">
                      <Hash size={18} className="text-green-500 mb-2" /><span className="text-xl font-bold">{currentWordIndex + (isFinished ? 1 : 0)}</span><span className="text-[10px] text-slate-500 uppercase">Words Read</span>
                    </div>
                    <div className="bg-white dark:bg-[#121118] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex flex-col items-center text-center">
                      <BrainCircuit size={18} className="text-orange-500 mb-2" /><span className="text-sm font-bold truncate w-full">{CATEGORIES.find(c => c.id === activeCategory)?.label}</span><span className="text-[10px] text-slate-500 uppercase">Interest</span>
                    </div>
                    <div className="bg-white dark:bg-[#121118] border border-slate-200 dark:border-gray-800 p-4 rounded-xl flex flex-col items-center">
                      {isFinished ? <CheckCircle2 size={18} className="text-blue-500 mb-2" /> : <Clock size={18} className="text-blue-500 mb-2" />}
                      <span className="text-sm font-bold">{isFinished ? '83%' : 'In progress'}</span><span className="text-[10px] text-slate-500 uppercase">Retention</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <PremiumModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
    </div>
  );
}