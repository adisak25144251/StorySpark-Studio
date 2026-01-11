
import React, { useState, useEffect } from 'react';
import { Layout as LayoutIcon, PenTool, BookOpen, Lightbulb, Menu, History, Library as LibraryIcon, Flame, Zap, Shield, Heart, Users, Gamepad2, GraduationCap, Palette, ShieldCheck, ArrowRight, Sparkles, Lock, Book, Wand2, X } from 'lucide-react';
import { AppView, StoryProject, StoryMode, StoryBibleSeed, LanguageMode, TrendItem, FeatureRecommendation } from './types';
import { StoryWizard } from './components/StoryWizard';
import { StudioEditor } from './components/StudioEditor';
import { StoryBibleView } from './components/StoryBible';
import { PromptLab } from './components/PromptLab';
import { MagicEditorView } from './components/MagicEditorView';
import { Library } from './components/Library';
import { StorySparkGuide } from './components/StorySparkGuide';
import { IdeaGenerator } from './components/IdeaGenerator';
import { RECOMMENDATIONS } from './constants';
import * as GeminiService from './geminiService';
import { Badge, Button } from './components/UIComponents';

// --- Extract NavButton Component ---
interface NavButtonProps {
  item: {
      id: AppView;
      icon: any;
      label: string;
      color: string;
  };
  isActive: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ item, isActive, onClick, isMobile = false }) => {
    const isPink = item.color === 'pink';
    
    const activeClass = isPink 
        ? 'bg-gradient-to-r from-neon-pink/20 to-transparent border-l-4 border-neon-pink text-white shadow-[0_0_15px_rgba(255,0,255,0.2)]'
        : 'bg-gradient-to-r from-neon-blue/20 to-transparent border-l-4 border-neon-blue text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]';
    
    const iconColor = isActive 
        ? (isPink ? 'text-neon-pink' : 'text-neon-blue')
        : (isPink ? 'group-hover:text-neon-pink' : 'group-hover:text-neon-blue');

    return (
        <button 
            onClick={onClick} 
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group ${isActive ? activeClass : 'text-white/50 hover:text-white hover:bg-white/5'}`}
        >
            <item.icon className={`w-5 h-5 ${isMobile ? 'mr-3' : 'lg:mr-3'} ${iconColor}`} />
            <span className={`${isMobile ? 'inline' : 'hidden lg:inline'} font-cyber tracking-wide text-sm`}>{item.label}</span>
        </button>
    );
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [projects, setProjects] = useState<StoryProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [features, setFeatures] = useState<FeatureRecommendation[]>([]);
  const [wizardInitPrompt, setWizardInitPrompt] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initialize data
  useEffect(() => {
      const initData = async () => {
          try {
              const analysis = await GeminiService.generateTrendAnalysis();
              setTrends(analysis.trend_digest);
          } catch (e) { console.error(e); }
          await new Promise(r => setTimeout(r, 800));
          try {
              const strategy = await GeminiService.generateProductStrategy();
              setFeatures(strategy.top_features);
          } catch (e) { console.error(e); }
      };
      initData();
  }, []);

  // Handle Resize to close mobile menu on desktop
  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth >= 768) {
              setIsMobileMenuOpen(false);
          }
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const project = projects.find(p => p.id === currentProjectId) || null;

  const handleUpdateProject = (updatedProject: StoryProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleUseTrend = (trend: TrendItem) => {
      setWizardInitPrompt(trend.prompt_starter);
      setView(AppView.WIZARD);
  };

  const handleWizardComplete = async (partialData: Partial<StoryProject> & { seed: StoryBibleSeed }) => {
    setIsProcessing(true);
    setLoadingMessage("Initialising Neural Story Engine...");

    try {
        const settings = {
            mode: partialData.mode!,
            age: partialData.targetAge!,
            count: partialData.sceneCount || 5,
            safety: partialData.safetyLevel!
        };

        const preRefined = {
            prompt: partialData.refinedPrompt!,
            seed: partialData.seed,
            title: partialData.title || "Untitled"
        };

        const result = await GeminiService.orchestrateStoryCreation(
            partialData.originalPrompt!,
            settings,
            preRefined,
            (msg) => setLoadingMessage(msg)
        );

        const newProject: StoryProject = {
            id: crypto.randomUUID(),
            title: result.title,
            originalPrompt: partialData.originalPrompt || "",
            refinedPrompt: result.refinedPrompt,
            currentPromptVersionId: partialData.currentPromptVersionId!,
            promptHistory: partialData.promptHistory || [],
            mode: settings.mode,
            languageMode: partialData.languageMode || LanguageMode.THAI_ONLY,
            targetAge: settings.age,
            safetyLevel: settings.safety,
            sceneCount: settings.count,
            bible: result.bible,
            scenes: result.scenes,
            exportHints: result.exportHints,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        setProjects(prev => [newProject, ...prev]);
        setCurrentProjectId(newProject.id);
        setView(AppView.STUDIO);
        setWizardInitPrompt("");

    } catch (e: any) {
        console.error(e);
        let msg = "System Malfunction: Check API Key";
        if (e.message?.includes('429') || e.message?.includes('quota') || e.status === 429) {
            msg = "API Quota Exceeded (429). Please try again later.";
        }
        alert(msg);
    } finally {
        setIsProcessing(false);
    }
  };

  const getCategoryColor = (cat: string) => {
      switch(cat) {
          case 'Engagement': return 'bg-orange-500/20 text-orange-300 border-orange-500/50';
          case 'Social': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
          case 'Creator Tools': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
          case 'Safety/Parents': return 'bg-green-500/20 text-green-300 border-green-500/50';
          default: return 'bg-white/10 text-white border-white/20';
      }
  };

  const MAIN_NAV = [
    { id: AppView.HOME, icon: LayoutIcon, label: 'Dashboard', color: 'blue' },
    { id: AppView.LIBRARY, icon: LibraryIcon, label: 'Library', color: 'blue' },
    { id: AppView.IDEA, icon: Lightbulb, label: 'Idea Lab', color: 'blue' }
  ];

  const WORKSTATION_NAV = [
    { id: AppView.STUDIO, icon: PenTool, label: 'Holo-Studio', color: 'pink' },
    { id: AppView.BIBLE, icon: BookOpen, label: 'Story Bible', color: 'pink' },
    { id: AppView.MAGIC_EDITOR, icon: Wand2, label: 'Magic Editor', color: 'pink' },
    { id: AppView.PROMPT_LAB, icon: History, label: 'Prompt Lab', color: 'pink' }
  ];

  if (isProcessing) {
      return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#050014] fixed top-0 left-0 z-50">
             <div className="glass-panel p-10 rounded-3xl text-center max-w-md border-neon-purple/50 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink animate-[shimmer_2s_infinite]"></div>
                 <div className="w-20 h-20 bg-neon-purple/10 text-neon-purple rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-purple shadow-[0_0_30px_rgba(188,19,254,0.4)] animate-spin">
                    <PenTool className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-cyber font-bold text-white mb-2 tracking-widest uppercase">Processing</h2>
                 <p className="text-neon-blue font-mono">{loadingMessage}</p>
                 <div className="w-full bg-white/10 h-1 mt-8 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple animate-pulse w-2/3 rounded-full shadow-[0_0_10px_rgba(0,243,255,0.8)]"></div>
                 </div>
             </div>
          </div>
      );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden font-sans text-white">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-[#050014]/95 backdrop-blur-xl md:hidden flex flex-col p-6 animate-fade-in overflow-hidden">
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                 <h1 className="font-cyber font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple">
                     STORY<span className="text-neon-pink">SPARK</span>
                 </h1>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 active:scale-95 transition-all">
                     <X className="text-white w-6 h-6" />
                 </button>
              </div>
              
              <nav className="space-y-2 overflow-y-auto flex-1 pb-10">
                  {MAIN_NAV.map(item => (
                      <NavButton 
                          key={item.id} 
                          item={item} 
                          isActive={view === item.id}
                          onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }}
                          isMobile={true} 
                      />
                  ))}
                  
                  <div className="pt-6 pb-2">
                     <p className="px-3 text-xxs font-bold text-neon-purple/80 uppercase tracking-[0.2em] border-b border-white/10 pb-2">Workstation</p>
                  </div>
                  
                  {WORKSTATION_NAV.map(item => (
                      <NavButton 
                          key={item.id} 
                          item={item} 
                          isActive={view === item.id}
                          onClick={() => { setView(item.id); setIsMobileMenuOpen(false); }}
                          isMobile={true} 
                      />
                  ))}
                  
                  <div className="mt-6 pt-4 border-t border-white/10">
                      <button 
                         onClick={() => { setView(AppView.GUIDE); setIsMobileMenuOpen(false); }}
                         className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group ${view === AppView.GUIDE ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                      >
                          <Book className="w-5 h-5 mr-3" />
                          <span className="font-cyber tracking-wide text-sm">MANUAL / GUIDE</span>
                      </button>
                  </div>
              </nav>
          </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-20 lg:w-72 flex flex-col justify-between hidden md:flex flex-shrink-0 z-20 p-4 transition-all duration-300">
         <div className="glass-panel h-full rounded-2xl flex flex-col p-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
             <div className="px-2 py-4 mb-4">
                 <h1 
                    onClick={() => setView(AppView.HOME)}
                    className="font-cyber font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple cursor-pointer drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] hidden lg:block"
                 >
                     STORY<br/><span className="text-neon-pink">SPARK</span>
                 </h1>
                 <div className="lg:hidden flex justify-center">
                    <span className="font-cyber font-black text-2xl text-neon-blue">S<span className="text-neon-pink">S</span></span>
                 </div>
             </div>
             <nav className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
                 {MAIN_NAV.map(item => (
                      <NavButton 
                          key={item.id} 
                          item={item} 
                          isActive={view === item.id}
                          onClick={() => setView(item.id)}
                      />
                 ))}
                 
                 <div className="pt-6 pb-2">
                    <p className="px-3 text-xxs font-bold text-neon-purple/80 uppercase tracking-[0.2em] hidden lg:block border-b border-white/10 pb-2">Workstation</p>
                    <div className="lg:hidden h-px bg-white/10 my-2"></div>
                 </div>

                 {WORKSTATION_NAV.map(item => (
                      <NavButton 
                          key={item.id} 
                          item={item} 
                          isActive={view === item.id}
                          onClick={() => setView(item.id)}
                      />
                 ))}
             </nav>
             
             {/* Guide / Manual Link */}
             <div className="mt-4 pt-4 border-t border-white/10">
                 <button 
                    onClick={() => setView(AppView.GUIDE)}
                    className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group ${view === AppView.GUIDE ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                 >
                     <Book className="w-5 h-5 lg:mr-3" />
                     <span className="hidden lg:inline font-cyber tracking-wide text-sm">MANUAL / GUIDE</span>
                 </button>
             </div>
             
             <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-neon-purple/20 to-transparent border border-neon-purple/30 hidden lg:block relative overflow-hidden group">
                 <div className="absolute inset-0 bg-neon-purple/10 blur-xl group-hover:bg-neon-purple/20 transition-all"></div>
                 <div className="relative z-10">
                    <div className="flex items-center text-neon-purple font-bold mb-2 font-cyber text-xs">
                        <Lightbulb className="w-3 h-3 mr-2" /> PRO TIP
                    </div>
                    <p className="text-xs text-purple-200 leading-relaxed font-mono">Use the Idea Lab to break writer's block instantly.</p>
                 </div>
             </div>
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          
          <header className="md:hidden h-16 glass-panel border-b-0 border-white/10 flex items-center px-4 justify-between flex-shrink-0 m-4 rounded-2xl shadow-lg">
              <span className="font-cyber font-bold text-xl text-neon-blue">STORY<span className="text-neon-pink">SPARK</span></span>
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Menu className="text-white w-6 h-6" /></button>
          </header>

          <div className="flex-1 overflow-auto scroll-smooth">
            {view === AppView.HOME && (
                <div className="p-4 md:p-8 max-w-6xl mx-auto">
                    <div className="text-center mb-16 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] bg-neon-blue/20 blur-[100px] rounded-full pointer-events-none"></div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-cyber font-black text-white mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] leading-tight">
                            UNLEASH YOUR<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-pink">DIGITAL IMAGINATION</span>
                        </h2>
                        <p className="text-base md:text-lg text-blue-200/70 max-w-2xl mx-auto font-light mb-8">
                            Craft professional narratives, comics, and visual novels using our advanced AI neural engine.
                        </p>

                        <div className="flex justify-center gap-4">
                            <Button 
                                variant="magic" 
                                onClick={() => { setWizardInitPrompt(""); setView(AppView.WIZARD); }}
                                className="shadow-[0_0_30px_rgba(188,19,254,0.4)] hover:shadow-[0_0_50px_rgba(188,19,254,0.6)]"
                            >
                                <Sparkles className="w-5 h-5 mr-2 animate-pulse" /> INITIALIZE NEW STORY
                            </Button>
                        </div>
                    </div>

                    {/* Trending Section */}
                    {trends.length > 0 && (
                        <div className="mb-12">
                            <h3 className="text-2xl font-cyber font-bold text-white mb-8 flex items-center">
                                <Flame className="w-6 h-6 text-neon-yellow mr-3 drop-shadow-[0_0_10px_rgba(252,238,10,0.8)]" /> 
                                TRENDING SIGNALS
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {trends.map((trend) => (
                                    <div key={trend.rank} className="glass-panel p-6 rounded-2xl group hover:border-neon-yellow/50 transition-all hover:-translate-y-2 duration-500">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30 text-xs font-bold px-3 py-1 rounded font-cyber">
                                                RANK #{trend.rank}
                                            </div>
                                            <div className="flex gap-1">
                                                {trend.recommended_for_age.map(age => (
                                                    <span key={age} className="text-xxs bg-white/5 px-2 py-0.5 rounded text-white/50 border border-white/10">{age}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <h4 className="font-bold text-xl text-white mb-2 group-hover:text-neon-yellow transition-colors">{trend.title}</h4>
                                        <p className="text-sm text-white/60 mb-6 line-clamp-2">{trend.why_popular}</p>
                                        
                                        <button 
                                            onClick={() => handleUseTrend(trend)}
                                            className="w-full py-3 rounded-xl bg-neon-yellow/10 border border-neon-yellow/30 text-neon-yellow font-bold text-sm hover:bg-neon-yellow hover:text-black hover:shadow-[0_0_20px_rgba(252,238,10,0.6)] transition-all flex items-center justify-center font-cyber uppercase tracking-wider"
                                        >
                                            <Zap className="w-4 h-4 mr-2" /> Ignite Spark
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Strategy Section */}
                    {features.length > 0 && (
                        <div>
                            <h3 className="text-2xl font-cyber font-bold text-white mb-8 flex items-center">
                                <Zap className="w-6 h-6 text-neon-purple mr-3 drop-shadow-[0_0_10px_rgba(188,19,254,0.8)]" /> 
                                STRATEGIC UPGRADES
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                                {features.map((rec, i) => (
                                    <div key={i} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-white/30 transition-all">
                                        <div className="absolute top-0 right-0 p-4 opacity-50">
                                            <div className={`text-xs font-bold px-2 py-1 rounded border ${rec.effort === 'L' ? 'text-red-400 border-red-500' : rec.effort === 'M' ? 'text-yellow-400 border-yellow-500' : 'text-green-400 border-green-500'}`}>
                                                EFFORT: {rec.effort}
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg text-white mb-2 group-hover:text-neon-blue transition-colors">{rec.name}</h4>
                                                <span className={`text-xxs font-cyber font-bold uppercase tracking-wider px-2 py-1 rounded border ${getCategoryColor(rec.category)}`}>
                                                    {rec.category}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-sm text-blue-100/70 mb-4 font-light">{rec.why}</p>
                                        
                                        <div className="border-t border-white/10 pt-4 mt-auto">
                                            <div className="flex items-center text-xs text-white/50 mb-2">
                                                <span className="font-bold mr-2 text-neon-blue">IMPACT:</span> {rec.impact}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {view === AppView.LIBRARY && (
                <Library 
                    projects={projects} 
                    onSelect={(p) => { setCurrentProjectId(p.id); setView(AppView.STUDIO); }}
                    onCreateNew={() => { setWizardInitPrompt(""); setView(AppView.WIZARD); }}
                />
            )}

            {view === AppView.WIZARD && (
                <StoryWizard onComplete={handleWizardComplete} initialPrompt={wizardInitPrompt} />
            )}

            {view === AppView.IDEA && (
                <IdeaGenerator />
            )}

            {/* Direct access components with null safe checks */}
            {view === AppView.STUDIO && (
                <StudioEditor 
                    project={project} 
                    onUpdateProject={handleUpdateProject} 
                    onNavigate={setView} 
                    onCreateNew={() => { setWizardInitPrompt(""); setView(AppView.WIZARD); }}
                />
            )}

            {view === AppView.MAGIC_EDITOR && (
                <MagicEditorView 
                    project={project} 
                    onNavigate={setView}
                />
            )}

            {view === AppView.BIBLE && (
                <StoryBibleView 
                    bible={project?.bible} 
                    onNavigate={setView}
                />
            )}
            
            {view === AppView.PROMPT_LAB && (
                <PromptLab 
                    project={project} 
                    onNavigate={setView}
                />
            )}

            {view === AppView.GUIDE && (
                <StorySparkGuide />
            )}

          </div>
      </main>
    </div>
  );
};

export default App;
