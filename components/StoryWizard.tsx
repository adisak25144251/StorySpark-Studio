
import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Wand2, ShieldCheck, Thermometer, Globe2 } from 'lucide-react';
import { Button, Card, Badge, Input } from './UIComponents';
import { StoryMode, StoryProject, SafetyLevel, PromptVersion, StoryBibleSeed, LanguageMode } from '../types';
import * as GeminiService from '../geminiService';

interface WizardProps {
  onComplete: (projectData: Partial<StoryProject> & { seed: StoryBibleSeed }) => void;
  initialPrompt?: string;
}

export const StoryWizard: React.FC<WizardProps> = ({ onComplete, initialPrompt }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [mode, setMode] = useState<StoryMode>(StoryMode.PICTURE_BOOK);
  const [languageMode, setLanguageMode] = useState<LanguageMode>(LanguageMode.THAI_ONLY);
  const [idea, setIdea] = useState(initialPrompt || "");
  const [age, setAge] = useState("6-8");
  const [sceneCount, setSceneCount] = useState(5);
  const [safety, setSafety] = useState<SafetyLevel>(SafetyLevel.STRICT);
  
  useEffect(() => {
      if (initialPrompt) {
          setIdea(initialPrompt);
          setStep(2);
      }
  }, [initialPrompt]);

  const [refinedData, setRefinedData] = useState<{
    refinedPrompt: string, 
    title: string, 
    score: number,
    summary: string,
    seed: StoryBibleSeed
  } | null>(null);

  const handleRefine = async () => {
    if (!idea) return;
    setLoading(true);
    try {
      const result = await GeminiService.refinePrompt(idea, age, mode, safety);
      setRefinedData(result);
      setStep(3);
    } catch (error) {
      alert("Neural Link Error: Check API Key");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    if (!refinedData) return;
    
    const initialVersion: PromptVersion = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      original: idea,
      refined: refinedData.refinedPrompt,
      changesSummary: refinedData.summary,
      qualityScore: refinedData.score,
      bibleSeed: refinedData.seed
    };

    onComplete({
      mode,
      languageMode,
      targetAge: age,
      safetyLevel: safety,
      sceneCount,
      originalPrompt: idea,
      refinedPrompt: refinedData.refinedPrompt,
      title: refinedData.title,
      promptHistory: [initialVersion],
      currentPromptVersionId: initialVersion.id,
      seed: refinedData.seed
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 animate-fade-in text-white h-full overflow-y-auto">
      {/* Progress */}
      <div className="flex justify-between mb-10 items-center">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-1 w-full mx-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_rgba(0,243,255,0.5)]' : 'bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-8 text-center">
          <div className="mb-8">
            <h2 className="text-4xl font-cyber font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">INITIALIZE PROTOCOL</h2>
            <p className="text-blue-200/60 font-mono">Select Narrative Format</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {[
              { id: StoryMode.PICTURE_BOOK, label: "Picture Book", icon: "🎨" },
              { id: StoryMode.NOVEL, label: "Short Novel", icon: "📖" },
              { id: StoryMode.COMIC, label: "Comic / Manga", icon: "💬" },
              { id: StoryMode.NON_FICTION, label: "Knowledge", icon: "🧠" },
            ].map((m) => (
              <Card 
                key={m.id} 
                className={`p-8 cursor-pointer transition-all hover:scale-105 border ${mode === m.id ? 'border-neon-blue bg-neon-blue/10 shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 'border-white/10 hover:border-white/30'}`}
              >
                <div onClick={() => setMode(m.id as StoryMode)} className="text-center">
                    <div className="text-5xl mb-4 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{m.icon}</div>
                    <div className={`font-bold font-cyber tracking-widest ${mode === m.id ? 'text-neon-blue' : 'text-white'}`}>{m.label}</div>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="magic" className="w-full mt-8" onClick={() => setStep(2)}>ENGAGE SYSTEM <ArrowRight className="ml-2 w-5 h-5" /></Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8 glass-panel p-8 rounded-3xl border border-white/10">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-cyber font-bold text-white mb-1">INPUT PARAMETERS</h2>
            <p className="text-white/40 font-mono text-sm">Define story core concepts</p>
          </div>
          
          <div className="space-y-3">
            <label className="text-xs font-bold text-neon-blue uppercase tracking-widest font-cyber">Core Concept (Spark)</label>
            <textarea
              className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-4 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue min-h-[140px] text-lg placeholder:text-white/20 outline-none"
              placeholder="e.g. A cybernetic cat exploring the neon ruins of Bangkok..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
               <label className="text-xs font-bold text-neon-pink uppercase tracking-widest font-cyber mb-2 block">Target Audience</label>
               <div className="relative">
                 <select className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-neon-pink appearance-none" value={age} onChange={e => setAge(e.target.value)}>
                   <option>3-5 (Early Gen)</option>
                   <option>6-8 (Middle Gen)</option>
                   <option>9-12 (Pre-Teen)</option>
                   <option>13+ (Young Adult)</option>
                 </select>
                 <div className="absolute right-3 top-3 text-neon-pink pointer-events-none">▼</div>
               </div>
            </div>
            <div>
               <label className="text-xs font-bold text-neon-green uppercase tracking-widest font-cyber mb-2 block">Sequence Length</label>
               <div className="relative">
                 <select className="w-full rounded-xl border border-white/20 bg-black/40 px-4 py-3 text-white outline-none focus:border-neon-green appearance-none" value={sceneCount} onChange={e => setSceneCount(Number(e.target.value))}>
                   <option value={3}>3 Units (Short)</option>
                   <option value={5}>5 Units (Standard)</option>
                   <option value={8}>8 Units (Extended)</option>
                   <option value={12}>12 Units (Saga)</option>
                 </select>
                 <div className="absolute right-3 top-3 text-neon-green pointer-events-none">▼</div>
               </div>
            </div>
          </div>

          <div>
               <label className="text-xs font-bold text-neon-yellow uppercase tracking-widest font-cyber mb-2 flex items-center gap-2">
                   <Globe2 className="w-4 h-4"/> Language Output
               </label>
               <div className="grid grid-cols-2 gap-4 mt-1">
                   <button 
                    onClick={() => setLanguageMode(LanguageMode.THAI_ONLY)}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${languageMode === LanguageMode.THAI_ONLY ? 'bg-neon-yellow/10 border-neon-yellow text-neon-yellow shadow-[0_0_15px_rgba(252,238,10,0.3)]' : 'border-white/20 text-white/50 bg-black/40'}`}
                   >
                       Thai Only
                   </button>
                   <button 
                    onClick={() => setLanguageMode(LanguageMode.BILINGUAL)}
                    className={`p-3 rounded-xl border text-sm font-bold transition-all ${languageMode === LanguageMode.BILINGUAL ? 'bg-neon-yellow/10 border-neon-yellow text-neon-yellow shadow-[0_0_15px_rgba(252,238,10,0.3)]' : 'border-white/20 text-white/50 bg-black/40'}`}
                   >
                       Bilingual (TH/EN)
                   </button>
               </div>
          </div>

          <div className="bg-blue-900/20 p-5 rounded-xl border border-blue-500/30">
             <div className="flex items-center gap-2 mb-3 text-blue-300 font-bold font-cyber text-sm tracking-wide">
                <ShieldCheck className="w-4 h-4" /> SAFETY PROTOCOLS
             </div>
             <div className="flex gap-4">
                {[
                  { id: SafetyLevel.STRICT, label: "STRICT", desc: "Max filtering (Kids)" },
                  { id: SafetyLevel.MODERATE, label: "MODERATE", desc: "Action allowed (Teens)" },
                ].map(s => (
                  <button 
                    key={s.id}
                    onClick={() => setSafety(s.id as SafetyLevel)}
                    className={`flex-1 p-3 rounded-lg text-sm text-left border transition-all ${safety === s.id ? 'bg-blue-500/20 border-blue-400 text-blue-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
                  >
                    <div className="font-bold font-cyber">{s.label}</div>
                    <div className="text-[10px] opacity-70">{s.desc}</div>
                  </button>
                ))}
             </div>
          </div>

          <Button 
            variant="magic" 
            className="w-full" 
            onClick={handleRefine}
            isLoading={loading}
            disabled={!idea}
          >
            <Sparkles className="mr-2 w-5 h-5 animate-pulse" /> REFINE WITH AI
          </Button>
        </div>
      )}

      {step === 3 && refinedData && (
        <div className="space-y-8 animate-fade-in">
           <div className="text-center">
              <h2 className="text-3xl font-cyber font-bold text-white mb-2">OPTIMIZATION COMPLETE</h2>
              <p className="text-white/50 font-mono">Review generated parameters before execution.</p>
           </div>
           
           <div className="flex gap-6 items-stretch flex-col md:flex-row">
               <div className="flex-1 glass-panel border border-white/10 p-6 rounded-2xl opacity-60 hover:opacity-100 transition-opacity">
                   <div className="text-[10px] font-bold uppercase text-white/40 mb-2 font-cyber tracking-widest">Original Input</div>
                   <p className="text-white/80 text-sm leading-relaxed">{idea}</p>
               </div>
               
               <div className="flex items-center justify-center text-neon-purple animate-pulse">
                  <ArrowRight className="w-8 h-8 rotate-90 md:rotate-0" />
               </div>
               
               <div className="flex-1 bg-gradient-to-br from-purple-900/40 to-black p-6 rounded-2xl relative overflow-hidden border border-neon-purple/50 shadow-[0_0_20px_rgba(188,19,254,0.2)]">
                   <div className="absolute top-0 right-0 bg-neon-purple text-black text-[10px] px-2 py-1 rounded-bl-lg font-bold font-cyber">
                      SCORE: {refinedData.score}/100
                   </div>
                   <div className="text-[10px] font-bold uppercase text-neon-purple mb-2 font-cyber tracking-widest">AI Optimized</div>
                   <h3 className="text-xl font-bold text-white mb-2 font-cyber">{refinedData.title}</h3>
                   <p className="text-blue-100/80 text-sm leading-relaxed mb-4">{refinedData.refinedPrompt}</p>
                   
                   <div className="pt-4 border-t border-white/10">
                      <Badge color="bg-neon-purple/20 text-neon-purple border border-neon-purple/50">
                         <Wand2 className="w-3 h-3 mr-1" /> {refinedData.summary}
                      </Badge>
                   </div>
               </div>
           </div>

           <div className="flex gap-4">
              <Button variant="ghost" onClick={() => setStep(2)}>BACK</Button>
              <Button variant="primary" className="flex-1" onClick={handleCreate}>INITIATE GENERATION</Button>
           </div>
        </div>
      )}
    </div>
  );
};
