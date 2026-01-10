import React, { useState } from 'react';
import { Card, Badge, Button } from './UIComponents';
import { Book, ShieldCheck, Zap, AlertTriangle, CheckCircle, Info, Menu, PlayCircle, Mic, Globe2, Sparkles, Layout, PenTool, Download, Headphones, Flame, MessageCircle } from 'lucide-react';

const GUIDE_CONTENT = [
    {
        id: 'cover',
        title: 'หน้าปก',
        content: (
            <div className="text-center py-12">
                <div className="w-24 h-24 bg-neon-blue/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-blue animate-pulse">
                    <Book className="w-12 h-12 text-neon-blue" />
                </div>
                <h1 className="text-5xl font-cyber font-bold text-white mb-4">
                    StorySpark Studio <span className="text-neon-pink">Guide</span>
                </h1>
                <p className="text-xl text-white/60 mb-8 font-light">
                    คู่มือการใช้งานฉบับสมบูรณ์สำหรับ Creator รุ่นใหม่
                </p>
                <div className="inline-block text-left bg-white/5 p-6 rounded-xl border border-white/10">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-mono text-white/70">
                        <span className="text-neon-blue">VERSION:</span> <span>2.5.0 (Cyber Edition)</span>
                        <span className="text-neon-blue">DATE:</span> <span>October 2025</span>
                        <span className="text-neon-blue">TARGET:</span> <span>Kids, Teens, Parents, Teachers</span>
                        <span className="text-neon-blue">FORMAT:</span> <span>Web Application</span>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ch1',
        title: 'บทที่ 1: ภาพรวมระบบ',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    1. ภาพรวมระบบ (System Overview)
                </h2>
                <p className="text-lg leading-relaxed text-white/80">
                    <strong>StorySpark Studio</strong> คือแพลตฟอร์มเล่าเรื่องอัจฉริยะ (AI Storytelling Platform) ที่เปลี่ยนจินตนาการให้กลายเป็นผลงานจริง ไม่ว่าจะเป็นนิทานภาพ, นิยายสั้น, หรือการ์ตูน
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 my-6">
                    <Card className="p-4 bg-neon-blue/5 border-neon-blue/30">
                        <h3 className="font-bold text-neon-blue mb-2 flex items-center"><Sparkles className="w-4 h-4 mr-2"/> วัตถุประสงค์</h3>
                        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                            <li>ช่วยให้เด็กและวัยรุ่นฝึกทักษะการเล่าเรื่อง (Storytelling)</li>
                            <li>เปลี่ยนไอเดียสั้นๆ ให้เป็นเรื่องราวที่สมบูรณ์ด้วย AI</li>
                            <li>ฝึกทักษะภาษาผ่านโหมด 2 ภาษา (TH/EN)</li>
                            <li>สร้างความเข้าใจเรื่อง AI Safety และการใช้เทคโนโลยีอย่างรับผิดชอบ</li>
                        </ul>
                    </Card>
                    <Card className="p-4 bg-neon-pink/5 border-neon-pink/30">
                        <h3 className="font-bold text-neon-pink mb-2 flex items-center"><Layout className="w-4 h-4 mr-2"/> สิ่งที่ทำได้</h3>
                        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                            <li>แต่งเรื่องพร้อมภาพประกอบอัตโนมัติ</li>
                            <li>สร้างเสียงพากย์และเอฟเฟกต์เสียง</li>
                            <li>ออกแบบตัวละครและฉากให้ต่อเนื่อง (Consistency)</li>
                            <li>ส่งออกผลงานเป็นไฟล์ JSON หรือรูปภาพ</li>
                        </ul>
                    </Card>
                </div>
            </div>
        )
    },
    {
        id: 'ch2',
        title: 'บทที่ 2: เริ่มต้นใช้งาน',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    2. เริ่มต้นใช้งาน (Getting Started)
                </h2>
                
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neon-blue text-black flex items-center justify-center text-xs font-bold">1</div>
                        เข้าสู่ระบบ
                    </h3>
                    <p className="text-white/70 pl-8">
                        ระบบ StorySpark ออกแบบมาให้ใช้งานได้ทันที (Instant Access) โดยไม่ต้องสมัครสมาชิกในโหมดทดลองใช้ 
                        เพียงแค่มี <strong>API Key</strong> (สำหรับการเชื่อมต่อสมองกล AI)
                    </p>
                    
                    <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30 ml-8 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                        <div className="text-sm text-yellow-200/80">
                            <strong>Note:</strong> ในเวอร์ชันโรงเรียน (Classroom Mode) ครูผู้สอนจะเป็นผู้จัดการ API Key ให้กับนักเรียน อุปกรณ์ของนักเรียนจึงพร้อมใช้งานทันที
                        </div>
                    </div>
                </div>

                <div className="space-y-4 mt-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neon-blue text-black flex items-center justify-center text-xs font-bold">2</div>
                        ตั้งค่าความปลอดภัย (Safety First)
                    </h3>
                    <p className="text-white/70 pl-8">
                        ก่อนเริ่มสร้าง ควรตรวจสอบระดับความปลอดภัยให้เหมาะสมกับผู้ใช้:
                    </p>
                    <div className="grid grid-cols-3 gap-2 ml-8 text-center">
                        <div className="p-3 bg-green-900/40 rounded border border-green-500/30">
                            <div className="text-green-400 font-bold mb-1">STRICT</div>
                            <div className="text-[10px] text-white/50">สำหรับเด็กเล็ก (กรองสูงสุด)</div>
                        </div>
                        <div className="p-3 bg-yellow-900/40 rounded border border-yellow-500/30">
                            <div className="text-yellow-400 font-bold mb-1">MODERATE</div>
                            <div className="text-[10px] text-white/50">สำหรับวัยรุ่น (ยอมรับฉากต่อสู้ได้)</div>
                        </div>
                        <div className="p-3 bg-red-900/40 rounded border border-red-500/30 opacity-50">
                            <div className="text-red-400 font-bold mb-1">OPEN</div>
                            <div className="text-[10px] text-white/50">ผู้ใหญ่ (18+)</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ch3',
        title: 'บทที่ 3: สร้างโปรเจกต์ด้วย Wizard',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    3. สร้างโปรเจกต์ใหม่ (Wizard Mode)
                </h2>
                <p className="text-white/80">
                    Wizard คือผู้ช่วยอัจฉริยะที่จะพาคุณสร้างโครงเรื่องใน 3 ขั้นตอนง่ายๆ:
                </p>

                <div className="relative border-l-2 border-white/10 ml-4 space-y-8 pl-8 py-4">
                    {/* Step 1 */}
                    <div className="relative">
                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-neon-purple border-4 border-[#050014]"></div>
                        <h4 className="font-bold text-lg text-neon-purple mb-2">ขั้นตอนที่ 1: เลือกรูปแบบ (Format)</h4>
                        <p className="text-sm text-white/60 mb-2">เลือกประเภทงานเขียนที่คุณต้องการสร้าง:</p>
                        <div className="flex gap-2 text-xs">
                             <Badge>Picture Book (นิทานภาพ)</Badge>
                             <Badge>Short Novel (นิยาย)</Badge>
                             <Badge>Comic (การ์ตูน)</Badge>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-neon-purple border-4 border-[#050014]"></div>
                        <h4 className="font-bold text-lg text-neon-purple mb-2">ขั้นตอนที่ 2: ใส่ไอเดีย (Idea Input)</h4>
                        <p className="text-sm text-white/60 mb-2">
                            พิมพ์ไอเดียสั้นๆ ลงในช่อง <strong>Core Concept</strong> เช่น "แมวอวกาศหลงทางในกรุงเทพฯ"
                        </p>
                        <div className="bg-white/5 p-3 rounded text-sm italic text-white/50 border-l-2 border-neon-blue">
                            "Tip: ไม่ต้องกังวลเรื่องภาษา AI จะช่วยเกลาให้เอง กดปุ่ม **REFINE WITH AI** เพื่อให้ระบบช่วยคิดต่อ"
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                        <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-neon-purple border-4 border-[#050014]"></div>
                        <h4 className="font-bold text-lg text-neon-purple mb-2">ขั้นตอนที่ 3: ตรวจสอบและสร้าง (Review & Generate)</h4>
                        <p className="text-sm text-white/60">
                            ระบบจะแสดง "ชื่อเรื่อง", "โครงเรื่องฉบับปรับปรุง" และ "คะแนนคุณภาพ" หากพอใจให้กดปุ่ม <strong>INITIATE GENERATION</strong>
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ch4',
        title: 'บทที่ 4: เจาะลึก Studio Editor',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    4. ใช้งาน Studio Editor
                </h2>
                <p className="text-white/80 mb-4">
                    นี่คือหน้าจอหลักสำหรับการทำงาน แบ่งออกเป็น 3 โซนหลัก:
                </p>

                <div className="grid gap-6">
                    <Card className="p-4 border-l-4 border-l-neon-blue">
                        <h3 className="font-bold text-white mb-2">1. โซนเนื้อเรื่อง (Left Panel)</h3>
                        <p className="text-sm text-white/60 mb-2">พื้นที่สำหรับเขียนและแก้ไขข้อความ</p>
                        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                            <li><strong>Primary Narrative:</strong> เนื้อเรื่องหลัก (ภาษาไทย) สามารถแก้ไขได้เอง</li>
                            <li><strong>Translation:</strong> (ถ้าเปิดโหมด 2 ภาษา) จะแสดงคำแปลด้านล่าง กดปุ่ม <span className="inline-block p-1 bg-white/10 rounded text-[10px]"><Sparkles className="w-2 h-2 inline"/> AUTO TRANSLATE</span> เพื่อแปลอัตโนมัติ</li>
                        </ul>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-neon-pink">
                        <h3 className="font-bold text-white mb-2">2. โซนภาพประกอบ (Right Panel)</h3>
                        <p className="text-sm text-white/60 mb-2">พื้นที่แสดงภาพและควบคุม AI วาดภาพ</p>
                        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                            <li><strong>Visual Module:</strong> แสดงภาพฉากปัจจุบัน</li>
                            <li><strong>AI Prompt:</strong> คำสั่งสร้างภาพภาษาอังกฤษ (AI เขียนให้แล้ว แต่คุณแก้ได้)</li>
                            <li><strong>GENERATE / REGENERATE:</strong> ปุ่มสั่งวาดภาพใหม่</li>
                        </ul>
                    </Card>

                    <Card className="p-4 border-l-4 border-l-neon-green">
                        <h3 className="font-bold text-white mb-2">3. แถบเครื่องมือ (Top Toolbar)</h3>
                        <p className="text-sm text-white/60 mb-2">ปุ่มควบคุมทั่วไป</p>
                        <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                            <li><strong>Unit Navigation:</strong> ปุ่มลูกศรซ้าย/ขวา เพื่อเปลี่ยนฉาก</li>
                            <li><strong>QA SCAN:</strong> ให้ AI ตรวจสอบคำผิดและความปลอดภัย</li>
                            <li><strong>SAVE JSON:</strong> บันทึกโปรเจกต์เก็บไว้ในเครื่อง</li>
                        </ul>
                    </Card>
                </div>
            </div>
        )
    },
    {
        id: 'ch5',
        title: 'บทที่ 5: โหมด Comic',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    5. โหมดการ์ตูน (Comic Mode)
                </h2>
                <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30 mb-6">
                    <h4 className="font-bold text-purple-300 mb-2 flex items-center"><Info className="w-4 h-4 mr-2"/> วิธีเปิดใช้งาน</h4>
                    <p className="text-sm text-purple-200/70">เลือก <strong>Comic / Manga</strong> ในขั้นตอนที่ 1 ของ Wizard</p>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-4">ความพิเศษของโหมดนี้</h3>
                <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                        <div className="bg-white/10 p-2 rounded-full"><Layout className="w-4 h-4 text-neon-blue" /></div>
                        <div>
                            <strong className="text-white block">Prompt แบบแบ่งช่อง (Paneling Prompt)</strong>
                            <span className="text-white/60 text-sm">AI จะเขียน Prompt โดยระบุ "Panel 1:", "Panel 2:" เพื่อให้ภาพออกมาเหมือนหน้าหนังสือการ์ตูนที่มีหลายช่อง</span>
                        </div>
                    </li>
                    <li className="flex gap-4 items-start">
                        <div className="bg-white/10 p-2 rounded-full"><MessageCircle className="w-4 h-4 text-neon-blue" /></div>
                        <div>
                            <strong className="text-white block">เน้นบทพูด (Dialogue Heavy)</strong>
                            <span className="text-white/60 text-sm">เนื้อเรื่องจะถูกสร้างในรูปแบบบทสนทนามากกว่าบทบรรยาย เพื่อให้นำไปใส่ในบอลลูนคำพูดได้ง่าย</span>
                        </div>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 'ch6',
        title: 'บทที่ 6: โหมด 2 ภาษา',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    6. โหมด 2 ภาษา (Bilingual)
                </h2>
                <p className="text-white/80 mb-6">
                    StorySpark รองรับการเรียนรู้ภาษาด้วยฟีเจอร์ <strong>Polyglot Translator</strong>
                </p>

                <div className="space-y-6">
                    <div className="glass-panel p-5 rounded-xl border-l-4 border-neon-yellow">
                        <h3 className="font-bold text-white mb-2">การเปิดใช้งาน</h3>
                        <p className="text-sm text-white/60">
                            ในหน้า Wizard ขั้นตอนที่ 2 หัวข้อ "Language Output" ให้เลือกปุ่ม <strong>Bilingual (TH/EN)</strong>
                        </p>
                    </div>

                    <div className="glass-panel p-5 rounded-xl border-l-4 border-neon-purple">
                        <h3 className="font-bold text-white mb-2">Glossary Lock (ล็อคคำศัพท์)</h3>
                        <p className="text-sm text-white/60 mb-2">
                            ระบบ Story Bible จะสร้าง "Glossary" เก็บไว้ เพื่อให้ AI แปลชื่อตัวละครและสถานที่เหมือนเดิมทุกครั้ง
                        </p>
                        <div className="bg-black/40 p-3 rounded text-xs font-mono text-neon-purple">
                            "สมชาย" -&gt; "Somchai" (จะไม่แปลว่า "Handsome Man")
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ch7',
        title: 'บทที่ 7: เสียงพากย์และเอฟเฟกต์',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    7. ระบบเสียง (Audio & SFX)
                </h2>
                <p className="text-white/80 mb-6">
                    เปลี่ยนนิยายให้อ่านให้ฟังได้ (Audiobook) ด้วยแท็บ <strong>AUDIO</strong> ใน Studio Editor
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="p-4">
                        <h3 className="font-bold text-neon-blue mb-3 flex items-center"><Mic className="w-5 h-5 mr-2"/> Cinematic Voice</h3>
                        <p className="text-sm text-white/60 mb-3">สร้างสคริปต์เสียงพากย์แยกตามตัวละคร</p>
                        <div className="text-xs space-y-2">
                            <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> ระบุอารมณ์ (Happy, Sad, Excited)</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> กำหนดความเร็วการพูด</div>
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs border border-white/10">กดปุ่ม GENERATE SCRIPT</Button>
                    </Card>

                    <Card className="p-4">
                        <h3 className="font-bold text-neon-pink mb-3 flex items-center"><Headphones className="w-5 h-5 mr-2"/> Immersive Sound</h3>
                        <p className="text-sm text-white/60 mb-3">ออกแบบเสียงประกอบบรรยากาศ (Ambience) และเอฟเฟกต์ (SFX)</p>
                        <div className="text-xs space-y-2">
                            <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> เสียงฝนตก, นกร้อง, เมือง</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500"/> Preview ฟังเสียงตัวอย่างได้ทันที</div>
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs border border-white/10">กดปุ่ม DESIGN SFX</Button>
                    </Card>
                </div>
            </div>
        )
    },
    {
        id: 'ch8',
        title: 'บทที่ 8: Trending Digest',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    8. Trending Digest & Ideas
                </h2>
                <p className="text-white/80 mb-4">
                    คิดไม่ออกว่าจะแต่งเรื่องอะไร? ใช้ฟีเจอร์ <strong>Trending Signals</strong> ในหน้า Dashboard
                </p>
                
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Flame className="w-20 h-20" /></div>
                    <h3 className="font-bold text-lg text-white mb-4">วิธีใช้งาน</h3>
                    <ol className="list-decimal list-inside space-y-3 text-sm text-white/70">
                        <li>ไปที่หน้า <strong>Dashboard</strong></li>
                        <li>เลื่อนลงมาที่หัวข้อ "TRENDING SIGNALS"</li>
                        <li>ดูอันดับเรื่องยอดนิยม (Rank #1 - #15)</li>
                        <li>กดปุ่ม <strong>IGNITE SPARK</strong> บนการ์ดที่คุณชอบ</li>
                        <li>ระบบจะพาไปหน้า Wizard พร้อมกรอกไอเดียตั้งต้นให้ทันที!</li>
                    </ol>
                </div>
            </div>
        )
    },
    {
        id: 'ch9',
        title: 'บทที่ 9: การส่งออกและแชร์',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    9. การส่งออกและแชร์ (Export)
                </h2>
                
                <div className="space-y-4">
                    <h3 className="font-bold text-white">1. Save Project (JSON)</h3>
                    <p className="text-sm text-white/60">
                        กดปุ่ม <span className="inline-block px-2 py-1 bg-neon-blue/20 text-neon-blue rounded font-bold text-xs"><Download className="w-3 h-3 inline"/> SAVE JSON</span> เพื่อดาวน์โหลดไฟล์โปรเจกต์เก็บไว้ในเครื่องคอมพิวเตอร์ ไฟล์นี้สามารถนำมาเปิดใหม่ได้ในภายหลัง
                    </p>

                    <h3 className="font-bold text-white mt-6">2. Download Images</h3>
                    <p className="text-sm text-white/60">
                        ในแต่ละฉาก สามารถกดปุ่ม <span className="inline-block px-2 py-1 bg-white/10 rounded font-bold text-xs">IMG</span> เพื่อดาวน์โหลดเฉพาะรูปภาพความละเอียดสูงไปใช้งานต่อได้
                    </p>
                    
                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 mt-6">
                        <h4 className="font-bold text-blue-300 mb-2 text-sm">Future Feature: Export to PDF</h4>
                        <p className="text-xs text-blue-200/70">
                            ในเวอร์ชันถัดไป ระบบจะรองรับการจัดหน้าและส่งออกเป็น E-book (PDF/ePub) ได้ทันที
                        </p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ch10',
        title: 'บทที่ 10: ความปลอดภัย',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    10. ความปลอดภัย (Safety & Parents)
                </h2>
                
                <div className="grid gap-6">
                    <Card className="p-6 border-l-4 border-l-green-500">
                        <h3 className="font-bold text-white mb-2 flex items-center"><ShieldCheck className="w-5 h-5 mr-2 text-green-400"/> ระบบกรองเนื้อหา (AI Safety Layer)</h3>
                        <p className="text-sm text-white/60 leading-relaxed">
                            StorySpark ใช้ AI ในการตรวจสอบทุกข้อความและภาพที่ถูกสร้างขึ้น
                            หากพบเนื้อหาที่ไม่เหมาะสม (ความรุนแรง, เพศ, คำหยาบ) ระบบจะ:
                        </p>
                        <ul className="list-disc list-inside text-sm text-white/60 mt-2 ml-4">
                            <li>ปฏิเสธการสร้าง (Block Generation)</li>
                            <li>แจ้งเตือนให้ผู้ใช้เปลี่ยนคำสั่ง (Alert User)</li>
                            <li>ปรับแก้เนื้อหาให้อัตโนมัติในโหมด STRICT</li>
                        </ul>
                    </Card>

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="font-bold text-white mb-4">คำแนะนำสำหรับผู้ปกครอง/ครู</h3>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li className="flex gap-3">
                                <CheckCircle className="w-4 h-4 text-neon-blue flex-shrink-0" />
                                <span>ควรตั้งค่า Safety Level เป็น <strong>STRICT</strong> เสมอสำหรับเด็กอายุต่ำกว่า 12 ปี</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle className="w-4 h-4 text-neon-blue flex-shrink-0" />
                                <span>สอนเด็กๆ เรื่อง <strong>Prompt Engineering</strong> ว่าการสั่งงาน AI ที่ดีควรมีความชัดเจนและสุภาพ</span>
                            </li>
                            <li className="flex gap-3">
                                <CheckCircle className="w-4 h-4 text-neon-blue flex-shrink-0" />
                                <span>ตรวจสอบผลงานสุดท้ายร่วมกับเด็กๆ ก่อนที่จะแชร์ออกไปภายนอก</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'ch11',
        title: 'บทที่ 11: การแก้ปัญหา',
        content: (
            <div className="space-y-6">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    11. การแก้ปัญหา (Troubleshooting)
                </h2>
                
                <div className="space-y-4">
                    <div className="border border-white/10 rounded-xl p-4">
                        <h3 className="font-bold text-neon-pink mb-2">Q: กด Generate แล้วค้าง หรือหมุนนานเกินไป</h3>
                        <div className="text-sm text-white/70 space-y-2">
                            <p><strong>วิธีแก้:</strong></p>
                            <ol className="list-decimal list-inside ml-2">
                                <li>ตรวจสอบอินเทอร์เน็ตของคุณ</li>
                                <li>อาจเกิดจากโควต้า API เต็ม (Quota Exceeded) ให้รอสักครู่แล้วลองใหม่</li>
                                <li>รีเฟรชหน้าจอ (ข้อมูลที่ยังไม่ Save อาจหายไป)</li>
                            </ol>
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-xl p-4">
                        <h3 className="font-bold text-neon-pink mb-2">Q: AI สร้างภาพไม่ตรงกับเนื้อเรื่อง</h3>
                        <div className="text-sm text-white/70 space-y-2">
                            <p><strong>วิธีแก้:</strong></p>
                            <p>
                                ลองแก้ไขช่อง <strong>AI Prompt</strong> ใน Visual Module ด้วยตัวเอง โดยเพิ่มรายละเอียดเช่น 
                                "full body shot", "close up face", หรือระบุสีเสื้อผ้าให้ชัดเจน
                            </p>
                        </div>
                    </div>

                    <div className="border border-white/10 rounded-xl p-4">
                        <h3 className="font-bold text-neon-pink mb-2">Q: หน้าจอแจ้งเตือน "HOLO-STUDIO OFFLINE"</h3>
                        <div className="text-sm text-white/70 space-y-2">
                            <p><strong>สาเหตุ:</strong> คุณยังไม่ได้โหลดโปรเจกต์ หรือโปรเจกต์ว่างเปล่า</p>
                            <p><strong>วิธีแก้:</strong> กดปุ่ม <strong>NEW PROJECT</strong> หรือไปที่ Library เพื่อเลือกงานเก่า</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'appendix',
        title: 'ภาคผนวก',
        content: (
            <div className="space-y-8">
                <h2 className="text-3xl font-cyber font-bold text-white border-b border-white/10 pb-4 mb-6">
                    ภาคผนวก (Appendix)
                </h2>

                <div>
                    <h3 className="text-xl font-bold text-white mb-4">A. Glossary (ศัพท์น่ารู้)</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            {t: "Prompt", d: "คำสั่งข้อความที่เราป้อนให้ AI ทำงาน"},
                            {t: "Refine", d: "กระบวนการที่ AI ช่วยเกลาและปรับปรุงคำสั่งของเราให้ดีขึ้น"},
                            {t: "Story Bible", d: "คัมภีร์ข้อมูลของเรื่อง เก็บชื่อตัวละคร ลักษณะนิสัย เพื่อให้ AI จำได้ตลอดทั้งเรื่อง"},
                            {t: "Generate", d: "การสั่งให้ AI สร้างเนื้อหาใหม่ (ภาพ/ข้อความ/เสียง)"},
                            {t: "SSML", d: "โค้ดควบคุมเสียงพูด (เช่น สั่งให้หยุดหายใจ, เน้นเสียง)"},
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 items-start bg-black/40 p-3 rounded border border-white/5">
                                <span className="font-bold text-neon-blue font-mono">{item.t}:</span>
                                <span className="text-sm text-white/60">{item.d}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-white mb-4">B. Checklist ก่อนเผยแพร่</h3>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                        <ul className="space-y-3">
                            {[
                                "ตรวจสอบตัวสะกดภาษาไทยให้ถูกต้อง",
                                "เช็คว่าชื่อตัวละครสะกดเหมือนกันทุกหน้า",
                                "ดูว่าภาพประกอบสอดคล้องกับเนื้อหาในหน้านั้นๆ",
                                "ไม่มีเนื้อหารุนแรงหรือหยาบคายหลุดรอดไป",
                                "ทดลองฟังเสียงพากย์ว่าออกเสียงชื่อเฉพาะถูกไหม"
                            ].map((check, i) => (
                                <li key={i} className="flex gap-3 items-center text-sm text-white/80">
                                    <div className="w-5 h-5 rounded border border-white/30 flex-shrink-0"></div>
                                    {check}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
];

// Helper Component for ToC Item
const ToCItem: React.FC<{ active: boolean, onClick: () => void, children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 font-cyber tracking-wide ${active ? 'bg-neon-blue/20 text-neon-blue border-l-2 border-neon-blue' : 'text-white/50 hover:text-white hover:bg-white/5'}`}
    >
        {children}
    </button>
);

export const StorySparkGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState('cover');

  return (
    <div className="flex h-full bg-transparent overflow-hidden">
        {/* Left Sidebar - Table of Contents */}
        <div className="w-64 glass-panel border-r border-white/10 flex-shrink-0 flex flex-col m-4 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20">
                <h3 className="font-bold text-white font-cyber flex items-center">
                    <Menu className="w-4 h-4 mr-2 text-neon-pink" />
                    CONTENTS
                </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {GUIDE_CONTENT.map(chapter => (
                    <ToCItem 
                        key={chapter.id} 
                        active={activeSection === chapter.id}
                        onClick={() => {
                            setActiveSection(chapter.id);
                            // Scroll to top of content area on click
                            document.getElementById('guide-content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        {chapter.title}
                    </ToCItem>
                ))}
            </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-4 h-full overflow-hidden">
            <div id="guide-content-area" className="h-full overflow-y-auto glass-panel rounded-xl p-8 md:p-12 scroll-smooth">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    {GUIDE_CONTENT.find(c => c.id === activeSection)?.content}
                    
                    {/* Navigation Footer */}
                    <div className="mt-16 pt-8 border-t border-white/10 flex justify-between">
                        <Button 
                            variant="ghost" 
                            disabled={GUIDE_CONTENT.findIndex(c => c.id === activeSection) === 0}
                            onClick={() => {
                                const idx = GUIDE_CONTENT.findIndex(c => c.id === activeSection);
                                if (idx > 0) {
                                    setActiveSection(GUIDE_CONTENT[idx - 1].id);
                                    document.getElementById('guide-content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                        >
                            &larr; Previous
                        </Button>
                        <Button 
                            variant="primary"
                            disabled={GUIDE_CONTENT.findIndex(c => c.id === activeSection) === GUIDE_CONTENT.length - 1}
                            onClick={() => {
                                const idx = GUIDE_CONTENT.findIndex(c => c.id === activeSection);
                                if (idx < GUIDE_CONTENT.length - 1) {
                                    setActiveSection(GUIDE_CONTENT[idx + 1].id);
                                    document.getElementById('guide-content-area')?.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }}
                        >
                            Next Chapter &rarr;
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};