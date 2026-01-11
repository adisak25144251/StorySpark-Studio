
import { FeatureRecommendation } from './types';

// Models
export const MODEL_TEXT_FAST = 'gemini-3-flash-preview'; 
export const MODEL_TEXT_CREATIVE = 'gemini-3-pro-preview'; 
export const MODEL_IMAGE = 'gemini-2.5-flash-image'; 

export const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600';

export const RECOMMENDATIONS: FeatureRecommendation[] = [
  // 1. Engagement
  {
    name: "ระบบสะสมแต้มต่อเนื่องพร้อมสัตว์เลี้ยงดิจิทัล (Daily Streak Pets)",
    why: "กระตุ้นให้กลับมาแต่งหรืออ่านทุกวันเพื่อให้อาหารและเลี้ยงสัตว์ดิจิทัลให้เติบโต",
    impact: "เพิ่ม Retention Rate มหาศาล",
    category: "Engagement",
    effort: 'M',
    risk_control: "จำกัดเวลาหน้าจอ (Screen time limit)"
  },
  // 2. Interactive
  {
    name: "เส้นทางเลือกในเนื้อเรื่องแบบ Interactive",
    why: "ผู้อ่านสามารถเลือกชะตาชีวิตตัวละครได้เอง (Choice-based) ทำให้ลุ้นระทึกและอยากกลับมาอ่านซ้ำ",
    impact: "เพิ่มยอด Time Spent",
    category: "Engagement",
    effort: 'L',
    risk_control: "ตรวจสอบความปลอดภัยทุกเส้นทางเลือก"
  },
  // 3. Social
  {
    name: "สตูดิโอสร้างการ์ตูนร่วมกับเพื่อน (Comic Jam)",
    why: "ชวนเพื่อนมาช่วยกันวาดคนละช่อง หรือแต่งคนละประโยค จบในหน้าเดียวแบบเรียลไทม์",
    impact: "Viral & Community Growth",
    category: "Social",
    effort: 'L',
    risk_control: "ระบบกรองคำหยาบในแชท (Anti-bullying)"
  },
  // 4. AI Helper
  {
    name: "ผู้ช่วยอัจฉริยะแนะนำโครงเรื่อง (AI Story Prompt)",
    why: "แก้อาการสมองตัน (Writer's Block) ด้วยการกดปุ่มเดียวเพื่อขอไอเดียจุดหักมุมหรือตอนจบ",
    impact: "เพิ่มจำนวนคอนเทนต์ที่สร้างเสร็จ",
    category: "Creator Tools",
    effort: 'S',
    risk_control: "ป้องกันพล็อตที่รุนแรง"
  },
  // 5. Creator Tools
  {
    name: "เครื่องมือออกแบบตัวละครเฉพาะตัว (Avatar Creator)",
    why: "สร้างตัวเอกที่เป็นเอกลักษณ์ของตัวเอง ปรับแต่งทรงผม เสื้อผ้า หน้าตาได้ดั่งใจ",
    impact: "สร้างความผูกพัน (Attachment)",
    category: "Creator Tools",
    effort: 'M',
    risk_control: "ป้องกันการสร้างรูปลักษณ์อนาจาร"
  },
  // 6. Education/Events
  {
    name: "กิจกรรมท้าทายการเขียนเชิงสร้างสรรค์ (Weekly Creative Challenges)",
    why: "โจทย์การเขียนเชิงสร้างสรรค์ชิงรางวัล เช่น 'แต่งเรื่องเกี่ยวกับอวกาศ' เพื่อฝึกทักษะ",
    impact: "Active Users รายสัปดาห์",
    category: "Learning/Edu",
    effort: 'S',
    risk_control: "กรรมการคัดกรองผลงาน"
  },
  // 7. Audio
  {
    name: "ระบบบันทึกเสียงพากย์และการเปลี่ยนเสียง (Voice-over Lab)",
    why: "บันทึกเสียงตัวเองแล้วใช้ AI เปลี่ยนเป็นเสียงปีศาจ, หุ่นยนต์ หรือเจ้าหญิงได้ทันที",
    impact: "ประสบการณ์ Immersive ขั้นสุด",
    category: "Creator Tools",
    effort: 'M',
    risk_control: "ตรวจจับถ้อยคำรุนแรงในเสียง"
  },
  // 8. Export
  {
    name: "ระบบส่งออก E-book (PDF/ePub Export)",
    why: "ผู้ใช้ต้องการนำผลงานไปจำหน่ายหรือเผยแพร่ในรูปแบบ E-book ที่สวยงาม",
    impact: "สร้างรายได้ให้ Creator",
    category: "Creator Tools",
    effort: 'L',
    risk_control: "Watermark ป้องกันลิขสิทธิ์"
  }
];
