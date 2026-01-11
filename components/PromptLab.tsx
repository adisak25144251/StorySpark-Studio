
import React, { useState } from 'react';
import { StoryProject, SafetyLevel, StoryMode, AppView } from '../types';
import { Card, Badge, Button } from './UIComponents';
import { History, Star, ArrowRight, Sparkles, FlaskConical, Eraser, Lock, Library } from 'lucide-react';
import * as GeminiService from '../geminiService';

interface PromptLabProps {
  project: StoryProject | null;
  onNavigate?: (view: AppView) => void;
}

type LabTab = 'HISTORY' | 'PLAYGROUND';

export const PromptLab: React.FC<PromptLabProps> = ({ project, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<LabTab>('HISTORY');
  
  // Playground State
  const [testPrompt, setTestPrompt] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [testResult, setTestResult] = useState<{
    original: string;
    refined: string;
    score: number;
    summary: string;
  } | null>(null);

  if (!project) {
       return (
          <div className="p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="glass-panel p-10 rounded-3xl max-w-lg border-white/10 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Lock className="w-10 h-10 text-white/30" />
                  </div>
                  <h2 className="text-3xl font-cyber font-bold text-white mb-2">LAB OFFLINE</h2>
                  <p className="text-white/50 mb-8 font-mono text-sm">
                      Connection to neural history logs required. Select a project to begin experiments.
                  </p>
                  <Button variant="secondary" onClick={() => onNavigate?.(AppView.LIBRARY)}>
                      <Library className="w-4 h-4 mr-2" /> ACCESS LIBRARY
                  </Button>
              </div>
          </div>
      );
  }

  const handleTestRefine = async () => {
    if (!testPrompt) return;
    setIsRefining(true);
    try {
        const result = await GeminiService.refinePrompt(
            testPrompt, 
            project.targetAge || "6-8", 
            project.mode || StoryMode.PICTURE_BOOK, 
            project.safetyLevel || SafetyLevel.STRICT
        );
        setTestResult({
            original: testPrompt,
            refined: result.refinedPrompt,
            score: result.score,
            summary: result.summary
        });
    } catch (e) {
        alert("System Overload. Try again.");
    } finally {
        setIsRefining(false);
    }
  };

  const handleClear = () => {
      setTestPrompt("");
      setTestResult(null);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-white">
      {/* Header & Tabs */}
      <div className="glass-panel px-8 py-6 border-b border-white/10 m-4 rounded-xl flex-shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-3xl font-cyber font-bold text-white flex items-center">
                    <FlaskConical className="mr-3 text-neon-green w-8 h-8 drop-shadow-[0_0_10px_rgba(10,255,96,0.6)]" /> PROMPT LAB
                </h2>
                <p className="text-white/50 mt-1 font-mono text-sm">Experimental Neural Interface</p>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-black/40 rounded-lg inline-flex border border-white/10">
              <button 
                onClick={() => setActiveTab('HISTORY')}
                className={`px-6 py-2 rounded-md font-bold text-sm transition-all font-cyber tracking-wide ${activeTab === 'HISTORY' ? 'bg-neon-blue/20 text-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]' : 'text-white/40 hover:text-white'}`}
              >
                  <History className="w-4 h-4 inline mr-2" /> LOGS
              </button>
              <button 
                onClick={() => setActiveTab('PLAYGROUND')}
                className={`px-6 py-2 rounded-md font-bold text-sm transition-all font-cyber tracking-wide ${activeTab === 'PLAYGROUND' ? 'bg-neon-purple/20 text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]' : 'text-white/40 hover:text-white'}`}
              >
                  <Sparkles className="w-4 h-4 inline mr-2" /> PLAYGROUND
              </button>
          </div>
      </div>

      <div className="px-4 pb-4 overflow-y-auto flex-1 scroll-smooth">
        
        {/* === HISTORY TAB === */}
        {activeTab === 'HISTORY' && (
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in p-4">
                {project.promptHistory.length === 0 ? (
                    <div className="text-center py-20 opacity-50 glass-panel rounded-2xl">
                        <History className="w-16 h-16 mx-auto mb-4 text-white/20" />
                        <p className="font-cyber text-xl">NO DATA LOGS</p>
                    </div>
                ) : (
                    project.promptHistory.map((version, idx) => (
                        <div key={version.id} className="relative pl-8 border-l border-white/10 last:border-0 pb-8 group">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-neon-blue box-shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                            
                            <Card className="p-6 border border-white/10 bg-black/40 hover:border-neon-blue/30 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-bold text-lg text-white font-cyber flex items-center gap-3">
                                            VERSION {idx + 1}.0
                                            {idx === 0 && <span className="text-[10px] font-normal text-white/40 border border-white/10 px-2 py-0.5 rounded uppercase tracking-wider">Genesis</span>}
                                            {idx === project.promptHistory.length - 1 && <Badge color="bg-neon-green/20 text-neon-green border-neon-green/50">LATEST</Badge>}
                                        </h3>
                                        <div className="text-xs text-white/30 mt-1 font-mono">
                                            TIMESTAMP: {new Date(version.timestamp).toLocaleString('en-US')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-neon-yellow/10 px-3 py-1 rounded-full text-neon-yellow font-bold border border-neon-yellow/30 text-sm font-mono">
                                        <Star className="w-4 h-4 fill-current" />
                                        {version.qualityScore}%
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 relative">
                                    {/* Arrow for desktop */}
                                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full items-center justify-center border border-white/20 z-10 text-white/50">
                                        <ArrowRight className="w-4 h-4" />
                                    </div>

                                    <div className="bg-white/5 p-5 rounded-xl border border-white/5">
                                        <div className="text-xs font-bold text-white/40 uppercase mb-3 flex items-center font-cyber tracking-widest">
                                            Input Signal
                                        </div>
                                        <p className="text-white/70 text-sm font-light leading-relaxed">{version.original}</p>
                                    </div>
                                    <div className="bg-neon-purple/5 p-5 rounded-xl border border-neon-purple/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-neon-purple/20 blur-[30px] rounded-full pointer-events-none"></div>
                                        <div className="text-xs font-bold text-neon-purple uppercase mb-3 flex items-center font-cyber tracking-widest relative z-10">
                                            <Sparkles className="w-3 h-3 mr-2" /> Neural Optimization
                                        </div>
                                        <p className="text-blue-100 text-sm leading-relaxed relative z-10">{version.refined}</p>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-3">
                                    <Badge color="bg-white/10 text-white/70 shrink-0 font-mono text-[10px]">CHANGELOG</Badge>
                                    <p className="text-sm text-white/50 leading-relaxed font-mono text-xs">{version.changesSummary}</p>
                                </div>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        )}

        {/* === PLAYGROUND TAB === */}
        {activeTab === 'PLAYGROUND' && (
            <div className="max-w-6xl mx-auto animate-fade-in p-4">
                <div className="mb-8 text-center">
                    <h3 className="text-3xl font-cyber font-bold text-white mb-2">SANDBOX ENVIRONMENT</h3>
                    <p className="text-white/40 font-mono">Test prompt permutations safely.</p>
                </div>

                <div className="grid md:grid-cols-[1fr,auto,1fr] gap-6 items-start">
                    {/* Input */}
                    <Card className="p-1 border border-neon-blue/50 shadow-[0_0_20px_rgba(0,243,255,0.1)] bg-black/60">
                        <div className="p-5">
                            <label className="block text-xs font-bold text-neon-blue mb-3 font-cyber tracking-widest uppercase">Raw Input</label>
                            <textarea 
                                className="w-full h-48 resize-none p-4 rounded-lg border border-white/10 bg-black/50 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all outline-none placeholder:text-white/20 font-mono text-sm"
                                placeholder="Enter experimental data stream..."
                                value={testPrompt}
                                onChange={(e) => setTestPrompt(e.target.value)}
                            />
                            <div className="mt-4 flex justify-end gap-2">
                                 <Button variant="ghost" onClick={handleClear} disabled={!testPrompt} className="text-xs">
                                     <Eraser className="w-3 h-3 mr-2" /> CLEAR
                                 </Button>
                                 <Button variant="magic" onClick={handleTestRefine} isLoading={isRefining} disabled={!testPrompt} className="text-xs py-2">
                                     <Sparkles className="w-3 h-3 mr-2" /> EXECUTE
                                 </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Arrow */}
                    <div className="flex justify-center pt-24 text-white/20">
                        <ArrowRight className="w-8 h-8 hidden md:block" />
                        <div className="md:hidden w-8 h-8 rotate-90 mx-auto my-2"><ArrowRight /></div>
                    </div>

                    {/* Output */}
                    <Card className={`p-1 border transition-all min-h-[300px] ${testResult ? 'border-neon-purple shadow-[0_0_30px_rgba(188,19,254,0.2)] bg-black/60' : 'border-dashed border-white/10 bg-transparent'}`}>
                        {testResult ? (
                            <div className="animate-fade-in p-5">
                                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-3">
                                    <label className="text-xs font-bold text-neon-purple flex items-center font-cyber tracking-widest uppercase">
                                        <Sparkles className="w-4 h-4 mr-2" /> Output Stream
                                    </label>
                                    <Badge color="bg-neon-yellow/10 text-neon-yellow border border-neon-yellow/30 font-mono">
                                        SCORE: {testResult.score}
                                    </Badge>
                                </div>
                                
                                <p className="text-sm text-blue-100 leading-relaxed font-light mb-6">
                                    {testResult.refined}
                                </p>
                                
                                <div className="bg-white/5 p-3 rounded-lg text-xs text-white/60 border border-white/10 font-mono">
                                    <strong className="text-neon-pink">&gt;&gt; ANALYSIS:</strong> {testResult.summary}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white/20 text-center p-8">
                                {isRefining ? (
                                    <div className="animate-pulse">
                                        <Sparkles className="w-12 h-12 text-neon-purple mx-auto mb-4 animate-spin" />
                                        <p className="font-cyber tracking-widest text-sm">PROCESSING...</p>
                                    </div>
                                ) : (
                                    <>
                                        <FlaskConical className="w-12 h-12 mb-4 opacity-50" />
                                        <p className="font-cyber tracking-widest text-sm">AWAITING INPUT</p>
                                    </>
                                )}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};
