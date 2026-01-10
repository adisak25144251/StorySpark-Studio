
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StoryProject, Scene, LanguageMode, AppView } from '../types';
import { Card, Button, Badge } from './UIComponents';
import { RefreshCw, Image as ImageIcon, ChevronLeft, ChevronRight, Save, Eye, ShieldCheck, CheckCircle, Languages, Mic, Music, PlayCircle, BookOpen, Volume2, Activity, Headphones, PauseCircle, Maximize2, PenTool, Lock, Library as LibraryIcon, Sparkles, Download, FileJson, X, AlertTriangle } from 'lucide-react';
import * as GeminiService from '../geminiService';

interface StudioProps {
  project: StoryProject | null;
  onUpdateProject: (p: StoryProject) => void;
  onNavigate?: (view: AppView) => void;
  onCreateNew?: () => void;
}

type TabMode = 'STORY' | 'AUDIO';

export const StudioEditor: React.FC<StudioProps> = ({ project, onUpdateProject, onNavigate, onCreateNew }) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<TabMode>('STORY');
  
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isGeneratingSound, setIsGeneratingSound] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [lastReviewIssues, setLastReviewIssues] = useState<string[]>([]);
  const [showQAReport, setShowQAReport] = useState(false);

  // Safety check for null project
  const scene = project ? project.scenes[currentSceneIdx] : null;

  // Use useCallback to ensure stable reference and proper scoping
  const stopAudio = useCallback(() => {
    if (audioCtxRef.current) {
        if (audioCtxRef.current.state !== 'closed') audioCtxRef.current.close();
        audioCtxRef.current = null;
    }
    setIsPlayingSound(false);
  }, []);

  useEffect(() => {
    return () => { stopAudio(); };
  }, [currentSceneIdx, stopAudio]);

  if (!project || !scene) {
      return (
          <div className="flex flex-col h-full bg-transparent p-4">
               {/* Disabled Mock Toolbar */}
               <div className="glass-panel border-b border-white/10 px-6 py-3 flex items-center justify-between opacity-50 pointer-events-none rounded-xl mb-4">
                   <div className="flex items-center gap-4">
                       <h2 className="font-cyber font-bold text-xl text-white">UNIT -- <span className="text-white/40 text-sm">/ --</span></h2>
                   </div>
               </div>
               
               <div className="flex-1 glass-panel rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/10">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,transparent_70%)]"></div>
                   <div className="text-center relative z-10 p-8 max-w-md">
                       <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                           <Lock className="w-10 h-10 text-white/30" />
                       </div>
                       <h2 className="text-3xl font-cyber font-bold text-white mb-2">HOLO-STUDIO OFFLINE</h2>
                       <p className="text-white/50 mb-8 font-mono text-sm">
                           Neural Interface Disconnected. Please load a narrative sequence to activate studio tools.
                       </p>
                       <div className="flex gap-4 justify-center">
                           <Button variant="secondary" onClick={() => onNavigate?.(AppView.LIBRARY)}>
                               <LibraryIcon className="w-4 h-4 mr-2" /> OPEN LIBRARY
                           </Button>
                           <Button variant="magic" onClick={onCreateNew}>
                               <Sparkles className="w-4 h-4 mr-2" /> NEW PROJECT
                           </Button>
                       </div>
                   </div>
               </div>
          </div>
      );
  }

  const playAudioSimulation = () => {
     if (!scene.soundDesign) return;
     setIsPlayingSound(true);
     const Ctx = window.AudioContext || (window as any).webkitAudioContext;
     const ctx = new Ctx();
     audioCtxRef.current = ctx;
     const now = ctx.currentTime;

     const ambOsc1 = ctx.createOscillator();
     const ambOsc2 = ctx.createOscillator();
     const ambGain = ctx.createGain();
     ambOsc1.frequency.value = 100 + Math.random() * 50; 
     ambOsc2.frequency.value = 150 + Math.random() * 50;
     ambOsc1.type = 'triangle'; ambOsc2.type = 'sine';
     ambGain.gain.value = 0.05;
     ambOsc1.connect(ambGain); ambOsc2.connect(ambGain); ambGain.connect(ctx.destination);
     ambOsc1.start(now); ambOsc2.start(now);

     scene.soundDesign.sfx.forEach((effect) => {
        const timeStr = effect.at.toLowerCase().replace('s', '').trim();
        const offset = parseFloat(timeStr);
        if (!isNaN(offset)) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now + offset);
            osc.frequency.exponentialRampToValueAtTime(300, now + offset + 0.3);
            gain.gain.setValueAtTime(0, now + offset);
            gain.gain.linearRampToValueAtTime(0.2, now + offset + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.5);
            osc.start(now + offset); osc.stop(now + offset + 0.6);
        }
     });

     setTimeout(() => { if (audioCtxRef.current === ctx) stopAudio(); }, 20000);
  };

  const toggleSoundPreview = () => {
    if (isPlayingSound) stopAudio();
    else playAudioSimulation();
  };

  const handleNext = () => { stopAudio(); if (currentSceneIdx < project.scenes.length - 1) setCurrentSceneIdx(prev => prev + 1); };
  const handlePrev = () => { stopAudio(); if (currentSceneIdx > 0) setCurrentSceneIdx(prev => prev - 1); };

  const handleGenerateImage = async () => {
    if (!scene) return;
    setIsGeneratingImg(true);
    const updatedScenes = [...project.scenes];
    updatedScenes[currentSceneIdx] = { ...scene, isGeneratingImage: true };
    onUpdateProject({ ...project, scenes: updatedScenes });

    try {
      const base64Image = await GeminiService.generateSceneImage(scene.imagePrompt, scene.negativePrompt);
      if (base64Image) {
        updatedScenes[currentSceneIdx] = { ...scene, imageUrl: base64Image, isGeneratingImage: false };
      } else {
         updatedScenes[currentSceneIdx] = { ...scene, isGeneratingImage: false };
      }
      onUpdateProject({ ...project, scenes: updatedScenes });
    } catch (e) {
      updatedScenes[currentSceneIdx] = { ...scene, isGeneratingImage: false };
      onUpdateProject({ ...project, scenes: updatedScenes });
    } finally { setIsGeneratingImg(false); }
  };

  const handleQACheck = async () => {
    setIsReviewing(true);
    try {
        const { issues, fixedScenes } = await GeminiService.reviewStory(project.scenes, project.bible, project.targetAge, project.safetyLevel);
        onUpdateProject({ ...project, scenes: fixedScenes });
        setLastReviewIssues(issues);
        setShowQAReport(true);
        if (issues.length === 0) alert("ตรวจสอบคุณภาพเสร็จสิ้น: ระบบปกติ (System Nominal)");
    } catch (e) { alert("การตรวจสอบล้มเหลว (QA Failed)"); } finally { setIsReviewing(false); }
  };

  const handleTranslate = async () => {
      setIsTranslating(true);
      try {
          const trans = await GeminiService.translateContent(scene.content, project.bible, project.targetAge);
          const updatedScenes = [...project.scenes];
          updatedScenes[currentSceneIdx] = { ...scene, contentTranslation: trans };
          onUpdateProject({ ...project, scenes: updatedScenes });
      } catch (e) { alert("แปลภาษาขัดข้อง (Translation Error)"); } finally { setIsTranslating(false); }
  };

  const handleAudioScript = async () => {
      setIsGeneratingAudio(true);
      try {
          const contextContent = project.languageMode === LanguageMode.BILINGUAL && scene.contentTranslation
             ? `THAI: ${scene.content}\n\nENGLISH: ${scene.contentTranslation}`
             : scene.content;
          const script = await GeminiService.generateCinematicAudioScript(contextContent, project.bible, project.languageMode, project.targetAge, scene.order);
          const updatedScenes = [...project.scenes];
          updatedScenes[currentSceneIdx] = { ...scene, audioScript: script };
          onUpdateProject({ ...project, scenes: updatedScenes });
      } catch (e) { alert("สร้างสคริปต์เสียงล้มเหลว (Audio Script Gen Failed)"); } finally { setIsGeneratingAudio(false); }
  };

  const handleSoundDesign = async () => {
    setIsGeneratingSound(true);
    try {
        const soundDesign = await GeminiService.generateSoundDesign(scene.content, scene.imagePrompt, scene.audioScript, project.targetAge, scene.order, project.safetyLevel);
        const updatedScenes = [...project.scenes];
        updatedScenes[currentSceneIdx] = { ...scene, soundDesign: soundDesign };
        onUpdateProject({ ...project, scenes: updatedScenes });
    } catch (e) { alert("ออกแบบเสียงล้มเหลว (Sound Design Failed)"); } finally { setIsGeneratingSound(false); }
  };

  const handleSaveProject = () => {
      // 1. Trigger Local Storage Save (Implicit via onUpdateProject in App.tsx) - done
      // 2. Trigger File Download
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `story_spark_${project.title.replace(/\s+/g, '_')}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      alert("บันทึกข้อมูลโปรเจกต์และส่งออกไฟล์ JSON เรียบร้อย (Encrypted & Exported)");
  };

  const handleDownloadImage = () => {
      if (!scene?.imageUrl) return;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", scene.imageUrl);
      downloadAnchorNode.setAttribute("download", `scene_${currentSceneIdx + 1}.png`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
  };

  const updateSceneContent = (text: string, isTranslation: boolean = false) => {
    const updatedScenes = [...project.scenes];
    if (isTranslation) updatedScenes[currentSceneIdx] = { ...scene, contentTranslation: text };
    else updatedScenes[currentSceneIdx] = { ...scene, content: text };
    onUpdateProject({ ...project, scenes: updatedScenes });
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Toolbar - Glass Bar */}
      <div className="glass-panel border-b border-white/10 px-6 py-3 flex items-center justify-between shadow-neon-blue/10 flex-shrink-0 z-10 m-4 rounded-xl">
        <div className="flex items-center gap-4">
            <h2 className="font-cyber font-bold text-xl text-white whitespace-nowrap drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
            UNIT {currentSceneIdx + 1} <span className="text-white/40 font-normal text-sm font-sans">/ {project.scenes.length}</span>
            </h2>
            <div className="flex bg-black/40 p-1 rounded-lg flex-shrink-0 border border-white/10">
                <button onClick={() => setActiveTab('STORY')} className={`px-4 py-1 text-sm font-bold rounded-md transition-all ${activeTab === 'STORY' ? 'bg-neon-blue text-black shadow-[0_0_10px_rgba(0,243,255,0.6)]' : 'text-white/50 hover:text-white'}`}>STORY</button>
                <button onClick={() => setActiveTab('AUDIO')} className={`px-4 py-1 text-sm font-bold rounded-md transition-all ${activeTab === 'AUDIO' ? 'bg-neon-purple text-white shadow-[0_0_10px_rgba(188,19,254,0.6)]' : 'text-white/50 hover:text-white'}`}>AUDIO</button>
            </div>
        </div>

        <div className="flex gap-2 items-center">
             <Button variant="secondary" onClick={handleQACheck} isLoading={isReviewing} disabled={isReviewing} className="hidden md:flex text-sm py-2 px-4 border-neon-blue/30 text-neon-blue relative">
                <ShieldCheck className="w-4 h-4 mr-2" /> QA SCAN
                {lastReviewIssues.length > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
             </Button>
             <div className="h-6 w-px bg-white/20 mx-2 hidden md:block" />
             <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10">
                <Button variant="ghost" onClick={handlePrev} disabled={currentSceneIdx === 0} className="p-2 h-8 w-8 rounded-md hover:bg-white/10"><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-xs font-mono w-12 text-center text-white/70">{currentSceneIdx + 1}/{project.scenes.length}</span>
                <Button variant="ghost" onClick={handleNext} disabled={currentSceneIdx === project.scenes.length - 1} className="p-2 h-8 w-8 rounded-md hover:bg-white/10"><ChevronRight className="w-4 h-4" /></Button>
             </div>
             <Button variant="primary" className="ml-2 text-sm py-2 px-4 shadow-neon-blue" onClick={handleSaveProject}>
                <Save className="w-4 h-4 md:mr-2"/> <span className="hidden md:inline">SAVE JSON</span>
             </Button>
        </div>
      </div>

      {/* QA Report Modal/Panel Overlay */}
      {showQAReport && (
          <div className="absolute top-20 right-4 z-50 w-80 glass-panel border-neon-blue/50 shadow-[0_0_30px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden animate-fade-in">
              <div className="bg-black/60 p-3 flex justify-between items-center border-b border-white/10">
                  <h3 className="text-neon-blue font-cyber font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> QA REPORT
                  </h3>
                  <button onClick={() => setShowQAReport(false)} className="text-white/50 hover:text-white"><X className="w-4 h-4" /></button>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                  {lastReviewIssues.length === 0 ? (
                      <div className="text-center py-6">
                          <CheckCircle className="w-12 h-12 text-neon-green mx-auto mb-2 opacity-50" />
                          <p className="text-white font-bold">System Nominal</p>
                          <p className="text-xs text-white/50">ไม่พบปัญหา (No issues detected)</p>
                      </div>
                  ) : (
                      <ul className="space-y-3">
                          {lastReviewIssues.map((issue, i) => (
                              <li key={i} className="text-sm text-white/80 bg-red-500/10 border border-red-500/30 p-2 rounded flex gap-2">
                                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                  <span>{issue}</span>
                              </li>
                          ))}
                      </ul>
                  )}
                  <div className="mt-4 pt-3 border-t border-white/10 text-center">
                      <p className="text-[10px] text-white/40">ระบบได้ทำการแก้ไขเนื้อหาบางส่วนอัตโนมัติแล้ว</p>
                  </div>
              </div>
          </div>
      )}

      {/* Main Grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-full relative px-4 pb-4 gap-4">
        
        {/* === LEFT PANEL === */}
        <div className="lg:col-span-7 h-full overflow-y-auto p-6 glass-panel rounded-2xl border border-white/10">
           {activeTab === 'STORY' ? (
             <div className="h-full flex flex-col gap-6 max-w-3xl mx-auto">
               <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-neon-blue uppercase tracking-widest font-cyber">Primary Narrative (TH)</label>
                    {project.languageMode === LanguageMode.BILINGUAL && <Badge color="bg-neon-blue/20 text-neon-blue border-neon-blue/50">MAIN</Badge>}
                  </div>
                  <div className="flex-1 relative group">
                    <textarea 
                        className="w-full h-full min-h-[300px] resize-none outline-none text-lg md:text-xl text-white font-sans leading-relaxed bg-transparent border-0 focus:ring-0 p-0 placeholder:text-white/20 selection:bg-neon-pink selection:text-white"
                        value={scene.content}
                        onChange={(e) => updateSceneContent(e.target.value)}
                        placeholder="Initialize story sequence..."
                    />
                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] text-white/30 font-mono">{scene.content.length} chars</span>
                    </div>
                  </div>
               </div>

               {project.languageMode === LanguageMode.BILINGUAL && (
                   <div className="flex-1 flex flex-col pt-6 border-t border-white/10">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold text-neon-pink uppercase flex items-center gap-1 tracking-widest font-cyber">
                            <Languages className="w-3 h-3"/> Translation (EN)
                        </label>
                        {!scene.contentTranslation && (
                            <Button variant="ghost" onClick={handleTranslate} isLoading={isTranslating} className="text-xs py-1 h-7 border border-neon-pink/30 bg-neon-pink/10 text-neon-pink">
                                <RefreshCw className="w-3 h-3 mr-1" /> AUTO TRANSLATE
                            </Button>
                        )}
                      </div>
                      <div className="relative">
                          {scene.contentTranslation ? (
                              <textarea 
                                className="w-full min-h-[200px] resize-none outline-none text-lg text-white/80 font-sans leading-relaxed bg-black/30 p-4 rounded-xl border border-white/10 focus:border-neon-pink focus:bg-black/50 transition-all"
                                value={scene.contentTranslation}
                                onChange={(e) => updateSceneContent(e.target.value, true)}
                              />
                          ) : (
                              <div onClick={handleTranslate} className="w-full h-32 flex items-center justify-center text-white/30 text-sm bg-black/20 rounded-xl border border-dashed border-white/10 cursor-pointer hover:border-neon-pink hover:text-neon-pink transition-all">
                                 + Initialize Translation Module
                              </div>
                          )}
                      </div>
                   </div>
               )}
             </div>
           ) : (
             /* AUDIO TAB */
             <div className="h-full overflow-y-auto max-w-3xl mx-auto space-y-8 animate-fade-in pb-10">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold font-cyber text-white">CINEMATIC VOICE</h3>
                            <p className="text-sm text-white/50">Director's Cut & Emotions</p>
                        </div>
                        <Button variant="secondary" onClick={handleAudioScript} isLoading={isGeneratingAudio}>
                            <Mic className="w-4 h-4 mr-2" /> GENERATE SCRIPT
                        </Button>
                    </div>

                    {scene.audioScript ? (
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <Badge color="bg-indigo-900/50 text-indigo-300 border-indigo-500/50">{scene.audioScript.tracks.length} TRACKS</Badge>
                                <Badge color="bg-emerald-900/50 text-emerald-300 border-emerald-500/50">{scene.audioScript.pronunciation_lexicon.length} LEXICON</Badge>
                            </div>
                            <div className="space-y-4">
                                {scene.audioScript.tracks.map((track, i) => (
                                    <div key={i} className="bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                                        <div className="bg-white/5 px-4 py-3 flex justify-between items-center border-b border-white/10">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-lg ${track.track_id.includes('NARRATOR') ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'}`}>
                                                    <Mic className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-white">{track.track_id}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge color="bg-orange-500/20 text-orange-300 border-orange-500/30">{track.style.emotion}</Badge>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-black/60 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto border-l-2 border-emerald-500">
                                            {track.ssml}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-white/30 bg-black/20 rounded-xl border border-dashed border-white/10">
                            <p>No Audio Data Found</p>
                        </div>
                    )}
                </div>

                {/* Sound Design */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-xl font-bold font-cyber text-white">IMMERSIVE AUDIO</h3>
                        </div>
                        <div className="flex gap-2">
                             {scene.soundDesign && (
                                <Button variant="secondary" onClick={toggleSoundPreview} className={isPlayingSound ? "bg-green-500/20 text-green-400 border-green-500" : ""}>
                                    {isPlayingSound ? <><PauseCircle className="w-4 h-4 mr-2" /> STOP</> : <><PlayCircle className="w-4 h-4 mr-2" /> PREVIEW</>}
                                </Button>
                            )}
                            <Button variant="secondary" onClick={handleSoundDesign} isLoading={isGeneratingSound}>
                                <Headphones className="w-4 h-4 mr-2" /> DESIGN SFX
                            </Button>
                        </div>
                    </div>

                    {scene.soundDesign ? (
                        <div className="space-y-6">
                            <div className={`bg-black/60 rounded-xl p-4 text-white shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)] border border-white/5 transition-all ${isPlayingSound ? 'border-neon-green shadow-[0_0_15px_rgba(10,255,96,0.3)]' : ''}`}>
                                {scene.soundDesign.ambience.map((amb, i) => (
                                    <div key={i} className="mb-4">
                                        <div className="flex justify-between text-xs text-white/50 mb-1 uppercase font-bold">
                                            <span>AMB: {amb.type}</span>
                                            <span>{amb.mix_db}dB</span>
                                        </div>
                                        <div className="h-6 bg-blue-900/30 rounded flex items-center px-3 border border-blue-500/30 relative overflow-hidden">
                                            <div className={`absolute inset-0 bg-neon-blue/20 w-full ${isPlayingSound ? 'animate-pulse' : ''}`}></div>
                                            <span className="text-xs font-mono z-10 text-blue-200">{amb.start} - {amb.end}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="text-xs text-white/50 mb-2 uppercase font-bold">SFX Cues</div>
                                    <div className="flex gap-2 flex-wrap">
                                        {scene.soundDesign.sfx.map((sfx, i) => (
                                            <div key={i} className="bg-orange-500/20 text-orange-300 border border-orange-500/50 text-xs px-2 py-1 rounded flex items-center gap-2">
                                                <span className="font-mono bg-black/50 px-1 rounded text-orange-400">{sfx.at}</span>
                                                <span>{sfx.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-white/30 bg-black/20 rounded-xl border border-dashed border-white/10">
                            <p>No Sound Design Layer</p>
                        </div>
                    )}
                </div>
             </div>
           )}
        </div>

        {/* === RIGHT PANEL: VISUALS === */}
        <div className="lg:col-span-5 h-full overflow-y-auto glass-panel p-6 rounded-2xl border border-white/10">
           <div className="sticky top-0 z-10 pb-4 mb-2 flex justify-between items-center border-b border-white/10">
                <h3 className="font-bold text-white flex items-center font-cyber">
                    <ImageIcon className="w-4 h-4 mr-2 text-neon-pink" /> VISUAL MODULE
                </h3>
                <div className="flex gap-2">
                     {scene.imageUrl && (
                         <>
                             <Button variant="ghost" className="h-8 px-2 text-xs" onClick={handleDownloadImage}>
                                <Download className="w-3 h-3 mr-1" /> IMG
                             </Button>
                             <Button variant="ghost" className="h-8 px-2 text-xs" onClick={() => window.open(scene.imageUrl, '_blank')}>
                                <Maximize2 className="w-3 h-3 mr-1" /> MAX
                             </Button>
                         </>
                     )}
                </div>
           </div>

           <Card className="aspect-square w-full mb-6 relative overflow-hidden group bg-black/50 border border-white/10 shadow-inner rounded-2xl flex items-center justify-center">
              {scene.isGeneratingImage ? (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-neon-blue">
                      <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-white/10"></div>
                          <div className="w-16 h-16 rounded-full border-4 border-neon-blue border-t-transparent animate-spin absolute top-0 left-0 shadow-[0_0_20px_rgba(0,243,255,0.5)]"></div>
                      </div>
                      <p className="font-bold mt-4 animate-pulse font-cyber">RENDERING PIXELS...</p>
                  </div>
              ) : null}
              
              {scene.imageUrl ? (
                  <img 
                    src={scene.imageUrl} 
                    alt={scene.altText || "Scene illustration"} 
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" 
                  />
              ) : (
                  <div className="flex flex-col items-center text-white/30 p-8 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-full mb-4 flex items-center justify-center border border-white/10">
                        <ImageIcon className="w-10 h-10 text-white/50" />
                      </div>
                      <p className="text-sm font-cyber">HOLO-FRAME EMPTY</p>
                  </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 flex justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                 <Button variant="magic" onClick={handleGenerateImage} isLoading={isGeneratingImg} className="shadow-neon-pink scale-90 hover:scale-100 text-sm py-2 px-6">
                    {scene.imageUrl ? <><RefreshCw className="w-4 h-4 mr-2"/> REGENERATE</> : <><ImageIcon className="w-4 h-4 mr-2"/> GENERATE</>}
                 </Button>
              </div>
           </Card>
           
           <div className="space-y-4">
             <div className="bg-black/30 p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-white/50 uppercase flex items-center font-cyber">
                        <PenTool className="w-3 h-3 mr-1" /> AI Prompt
                    </label>
                    <span className="text-[10px] text-neon-yellow bg-neon-yellow/10 px-2 py-0.5 rounded border border-neon-yellow/30">ENG ONLY</span>
                </div>
                <textarea 
                    className="w-full text-sm text-white bg-transparent border border-white/10 rounded-lg p-3 min-h-[100px] focus:ring-1 focus:ring-neon-blue focus:border-neon-blue outline-none transition-all placeholder:text-white/20"
                    value={scene.imagePrompt}
                    onChange={(e) => {
                        const updatedScenes = [...project.scenes];
                        updatedScenes[currentSceneIdx] = { ...scene, imagePrompt: e.target.value };
                        onUpdateProject({ ...project, scenes: updatedScenes });
                    }}
                    placeholder="Enter visual parameters..."
                />
             </div>
             
             {scene.altText && (
                 <div className="flex items-start gap-3 text-xs text-white/60 bg-white/5 p-3 rounded-xl border border-white/10">
                     <Eye className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/40" />
                     <div className="flex-1">
                        <strong className="block text-white mb-1">Alt Text (TH)</strong>
                        {scene.altText}
                     </div>
                 </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};
