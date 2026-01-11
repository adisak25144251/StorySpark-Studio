
import React, { useState } from 'react';
import { Card, Button, Badge } from './UIComponents';
import { Lightbulb, RefreshCw, Copy, Check, Info, Film, User, Camera, Heart, Zap, AlertTriangle, BookOpen, Sparkles } from 'lucide-react';
import * as GeminiService from '../geminiService';
import { ViralStory } from '../types';

// Data Banks for Randomizer
const TARGETS = ["เด็กมัธยมต้น (Junior High)", "เด็กมัธยมปลาย (High School)", "วัยรุ่นตอนปลาย (Young Adult)"];
const TONES = ["อบอุ่นปนเหงา (Bittersweet)", "ดราม่าหนักหน่วง (Heavy Drama)", "ลึกลับระทึกขวัญ (Mystery/Thriller)", "โรแมนติกแฟนตาซี (Romantic Fantasy)"];
const LOCATIONS = ["ดาดฟ้าโรงเรียนยามเย็น", "ร้านสะดวกซื้อเที่ยงคืน", "สถานีรถไฟชนบท", "ร้านเช่าหนังสือเก่า", "ทางเดินใต้ดิน", "ตู้โทรศัพท์สาธารณะ"];
const MAGIC_ITEMS = ["ร้านซ่อมคำพูดที่พูดผิด", "ตั๋วรถไฟไปวันวาน", "กล้องถ่ายติดวิญญาณคนเป็น", "ตู้กดน้ำขายความกล้า", "ยางลบความทรงจำ", "ร่มที่กางแล้วเวลาหยุดเดิน"];
const RULES = ["ใช้ได้แค่ 3 ครั้ง", "ต้องแลกด้วยสิ่งที่มีค่าที่สุด", "ผลจะอยู่แค่ถึงเที่ยงคืน", "ทุกครั้งที่ใช้จะลืมชื่อคนสำคัญไป 1 คน"];
const COSTS = ["ความทรงจำเกี่ยวกับแม่", "เสียงหัวเราะของตัวเอง", "สีสันในการมองเห็น", "ความสามารถในการโกหก", "ชื่อของตัวเอง"];
const WOUNDS = ["กลัวการถูกลืม", "รู้สึกตัวเองไร้ค่า", "พยายามทำตัวสมบูรณ์แบบจนเหนื่อย", "ไม่กล้าปฏิเสธคนอื่น", "แบกความหวังของพ่อแม่"];
const PEAKS = ["ความจริงที่เจ็บปวด (Truth Reveal)", "การเสียสละเพื่อเพื่อน (Sacrifice)", "ทางเลือกที่ไม่มีคำตอบถูก (Dilemma)", "ยิ่งแก้ปัญหายิ่งแย่ลง (Fixing makes it worse)"];

const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const IdeaGenerator: React.FC = () => {
  const [story, setStory] = useState<ViralStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
        // Randomize Inputs
        const inputs = {
            audience: getRandom(TARGETS),
            tone: getRandom(TONES),
            location: getRandom(LOCATIONS),
            magicItem: getRandom(MAGIC_ITEMS),
            rule: getRandom(RULES),
            cost: getRandom(COSTS),
            wound: getRandom(WOUNDS),
            peak: getRandom(PEAKS)
        };

        const result = await GeminiService.generateViralIdea(
            inputs.audience,
            inputs.tone,
            inputs.location,
            inputs.magicItem,
            inputs.rule,
            inputs.cost,
            inputs.wound,
            inputs.peak
        );
        setStory(result);
    } catch (e) {
        alert("Failed to generate idea. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-white overflow-hidden">
        {/* Header */}
        <div className="glass-panel px-8 py-6 border-b border-white/10 m-4 rounded-xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-cyber font-bold text-white flex items-center">
                    <Lightbulb className="mr-3 text-neon-yellow w-8 h-8 drop-shadow-[0_0_10px_rgba(252,238,10,0.6)]" /> 
                    IDEA LAB
                </h2>
                <p className="text-white/50 mt-1 font-mono text-sm">Viral Short Story Generator</p>
            </div>
            <Button variant="magic" onClick={handleGenerate} isLoading={loading} className="min-w-[180px]">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> 
                {story ? 'REFRESH IDEA' : 'GENERATE IDEA'}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 scroll-smooth">
            {!story && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                    <Film className="w-20 h-20 mb-6 text-white/20" />
                    <h3 className="text-2xl font-bold font-cyber">WAITING FOR INPUT</h3>
                    <p className="max-w-md mt-4 font-mono text-sm text-white/60">
                        Click GENERATE to spin the neural engine and create a world-class viral short story concept.
                    </p>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 border-4 border-neon-yellow border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(252,238,10,0.4)]"></div>
                    <h3 className="text-xl font-bold font-cyber animate-pulse">CONSTRUCTING NARRATIVE...</h3>
                    <p className="text-sm font-mono text-white/40 mt-2">Applying strict viral rulesets</p>
                </div>
            )}

            {story && !loading && (
                <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
                    
                    {/* 1. Title & Hook */}
                    <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border-t-4 border-t-neon-yellow">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-32 h-32" /></div>
                        <h1 className="text-3xl md:text-4xl font-bold font-cyber text-white mb-4 leading-tight">
                            {story.title}
                        </h1>
                        <p className="text-neon-yellow font-bold text-lg mb-6 italic">"{story.social_hook}"</p>
                        
                        <div className="bg-white/5 p-6 rounded-xl border-l-4 border-neon-blue">
                            <h4 className="text-neon-blue font-bold text-sm uppercase tracking-widest mb-3">The Hook (3 Lines)</h4>
                            <p className="text-xl font-light leading-relaxed whitespace-pre-line font-thai">
                                {story.opening_hook_3_lines}
                            </p>
                        </div>
                    </div>

                    {/* 2. World Rule & Characters */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-black/40">
                            <h3 className="font-bold text-white mb-4 flex items-center text-neon-pink">
                                <AlertTriangle className="w-5 h-5 mr-2" /> WORLD RULE
                            </h3>
                            <p className="text-white/80 leading-relaxed font-thai">{story.world_rule}</p>
                        </Card>
                        
                        <Card className="p-6 bg-black/40">
                             <h3 className="font-bold text-white mb-4 flex items-center text-neon-green">
                                <User className="w-5 h-5 mr-2" /> CHARACTERS
                            </h3>
                            <div className="space-y-4">
                                {story.characters?.map((char, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-white">{char.name?.[0] || '?'}</div>
                                        <div>
                                            <div className="font-bold text-white">{char.name} <span className="text-xs font-normal text-white/50">({char.role})</span></div>
                                            <div className="text-sm text-white/60 mt-1"><span className="text-neon-green">Wound:</span> {char.wound}</div>
                                            <div className="text-sm text-white/60"><span className="text-neon-green">Prop:</span> {char.signature_prop}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* 3. Full Story */}
                    <Card className="p-8 md:p-12 bg-white/5 border border-white/10">
                        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                            <BookOpen className="w-6 h-6 text-white/70" />
                            <h3 className="text-2xl font-bold font-cyber">FULL STORY SCRIPT</h3>
                        </div>
                        <div className="prose prose-invert max-w-none font-thai text-lg leading-loose text-white/90 whitespace-pre-wrap">
                            {story.story_text}
                        </div>
                        <div className="mt-12 pt-8 border-t border-white/10 text-center">
                            <p className="text-neon-yellow font-bold text-xl italic">"{story.final_quote}"</p>
                        </div>
                    </Card>

                    {/* 4. Twist Clues */}
                    <div className="bg-neon-purple/10 border border-neon-purple/30 p-6 rounded-xl">
                        <h3 className="font-bold text-neon-purple mb-4 flex items-center uppercase tracking-widest text-sm">
                            <Info className="w-4 h-4 mr-2" /> Fair Twist Clues (Hidden in story)
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {story.twist_clues?.map((clue, i) => (
                                <div key={i} className="flex gap-3 items-center text-sm text-purple-200">
                                    <div className="w-6 h-6 rounded-full bg-neon-purple/20 flex items-center justify-center text-xs font-bold shrink-0">{i+1}</div>
                                    {clue}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Storyboard & Prompts */}
                    <div>
                        <h3 className="text-2xl font-bold font-cyber text-white mb-6 flex items-center">
                            <Camera className="w-6 h-6 mr-3 text-neon-blue" /> CINEMATIC STORYBOARD
                        </h3>
                        <div className="grid gap-6">
                            {story.storyboard?.map((scene, i) => (
                                <div key={i} className="glass-panel p-6 rounded-xl border border-white/10 hover:border-neon-blue/40 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <Badge color="bg-neon-blue/20 text-neon-blue border-neon-blue/50">SCENE {i+1}</Badge>
                                            <h4 className="font-bold text-white">{scene.scene_title}</h4>
                                        </div>
                                        <Badge color="bg-white/10 text-white/60">{scene.emotion}</Badge>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6 mb-4">
                                        <div className="col-span-2 space-y-2 text-sm text-white/70">
                                            <p><strong className="text-white">Setting:</strong> {scene.setting}</p>
                                            <p><strong className="text-white">Action:</strong> {scene.action}</p>
                                            <p className="text-neon-pink italic"><strong className="text-neon-pink not-italic">Cliffhanger:</strong> {scene.cliffhanger_tag}</p>
                                        </div>
                                        <div className="col-span-1">
                                            <div className="bg-black/50 p-4 rounded-xl border border-white/10 h-full flex flex-col group/prompt hover:border-neon-blue/50 transition-colors shadow-inner">
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-xxs font-bold text-neon-blue uppercase tracking-wider flex items-center">
                                                        <Sparkles className="w-3 h-3 mr-1" /> AI PROMPT
                                                    </span>
                                                    <button 
                                                        onClick={() => copyToClipboard(scene.image_prompt, i)}
                                                        className={`text-xxs font-bold px-2 py-1 rounded flex items-center transition-all ${copiedPromptId === i ? 'bg-neon-green text-black' : 'bg-white/10 text-white hover:bg-neon-blue hover:text-black'}`}
                                                    >
                                                        {copiedPromptId === i ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                                        {copiedPromptId === i ? 'COPIED' : 'COPY'}
                                                    </button>
                                                </div>
                                                <div className="relative flex-1 bg-black/30 rounded-lg border border-white/5 p-2 group-hover/prompt:border-white/10 transition-colors">
                                                    <p className="text-xxs text-white/60 leading-relaxed font-mono select-all h-full overflow-y-auto scrollbar-thin">
                                                        {scene.image_prompt}
                                                    </p>
                                                </div>
                                                <div className="mt-2 text-xxs text-white/30 text-center font-mono uppercase tracking-wide">
                                                    Use in Studio Visual Module
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    </div>
  );
};
