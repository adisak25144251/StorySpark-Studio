
export enum StoryMode {
  PICTURE_BOOK = 'PICTURE_BOOK',
  NOVEL = 'NOVEL',
  COMIC = 'COMIC',
  NON_FICTION = 'NON_FICTION',
  CINEMATIC_REALISM = 'CINEMATIC_REALISM' // New Mode
}

export enum LanguageMode {
  THAI_ONLY = 'THAI_ONLY',
  ENGLISH_ONLY = 'ENGLISH_ONLY',
  BILINGUAL = 'BILINGUAL' // Parallel display
}

export enum AppView {
  HOME = 'HOME',
  WIZARD = 'WIZARD',
  STUDIO = 'STUDIO',
  BIBLE = 'BIBLE',
  PROMPT_LAB = 'PROMPT_LAB',
  LIBRARY = 'LIBRARY',
  GUIDE = 'GUIDE'
}

export enum SafetyLevel {
  STRICT = 'STRICT', // Kids (<10)
  MODERATE = 'MODERATE', // Teens (10-15)
  OPEN = 'OPEN' // Young Adults (16+)
}

export interface StoryBibleSeed {
  target_age: string;
  genre: string;
  tone: string;
  main_characters: { name: string; role: string; traits: string; visual_signature: string }[];
  locations: { name: string; description: string }[];
  world_rules: string[];
}

export interface PromptVersion {
  id: string;
  timestamp: number;
  original: string;
  refined: string;
  changesSummary: string;
  qualityScore: number; // 0-100
  bibleSeed?: StoryBibleSeed;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  visualTrait: string; 
  role: string;
  personality: string;
}

export interface Setting {
  id: string;
  name: string;
  description: string;
  visualStyle: string;
}

export interface ConsistencyTokens {
  character_tokens: Record<string, string>;
  location_tokens: Record<string, string>;
  global_style_tokens: string[];
}

export interface PlotSpine {
  start: string;
  middle: string;
  end: string;
  theme: string;
  lesson?: string;
}

export interface StoryBible {
  characters: Character[];
  settings: Setting[];
  artStyle: string;
  tone: string;
  plotSpine?: PlotSpine;
  consistency?: ConsistencyTokens;
  glossary?: Record<string, string>; // Term -> Translation
}

export interface VoiceStyle {
  emotion: string; // e.g. "warm", "excited", "whisper"
  pace_wpm: number;
  energy: 'low' | 'medium' | 'high';
}

export interface VoiceTrack {
  track_id: string; // e.g. "TH_NARRATOR", "EN_CHARACTER_1"
  speaker: string;
  style: VoiceStyle;
  ssml: string; // <speak>...</speak>
  timing_hint_sec: number;
}

export interface PronunciationLexicon {
  word: string;
  ipa: string;
  note: string;
}

export interface CinematicAudioScript {
  unit_no: number;
  tracks: VoiceTrack[];
  pronunciation_lexicon: PronunciationLexicon[];
  sfx_cues?: { description: string; timestamp: number }[]; 
}

// --- NEW SOUND DESIGN TYPES ---
export interface SoundLayer {
  type: string; // e.g. "forest_day", "gentle_adventure"
  mood?: string;
  start: string; // "0s"
  end: string; // "28s"
  mix_db: number; // -18
}

export interface SoundEffect {
  name: string;
  at: string; // "6s"
  mix_db: number;
  note: string;
}

export interface MixGuidelines {
  dialogue_priority: string;
  max_sfx_per_minute: number;
  ducking_when_speaking_db: number;
}

export interface UnitSoundDesign {
  unit_no: number;
  ambience: SoundLayer[];
  bgm: SoundLayer[];
  sfx: SoundEffect[];
  safety_check: string;
  mix_guidelines?: MixGuidelines;
}

export interface Scene {
  id: string;
  order: number;
  content: string; // Primary language (Thai)
  contentTranslation?: string; // Secondary language (English)
  imagePrompt: string;
  negativePrompt?: string;
  altText?: string;
  imageUrl?: string; 
  audioScript?: CinematicAudioScript;
  soundDesign?: UnitSoundDesign; // New field
  isGeneratingImage: boolean;
}

export interface ExportHints {
  pdfLayout?: string;
  coverIdea?: string;
}

export interface StoryProject {
  id: string;
  title: string;
  thumbnailUrl?: string;
  originalPrompt: string;
  refinedPrompt: string;
  currentPromptVersionId: string;
  promptHistory: PromptVersion[];
  mode: StoryMode;
  languageMode: LanguageMode;
  targetAge: string;
  safetyLevel: SafetyLevel;
  sceneCount: number;
  bible: StoryBible;
  scenes: Scene[];
  exportHints?: ExportHints;
  createdAt: number;
  updatedAt: number;
}

// --- PRODUCT STRATEGY TYPES ---
export interface FeatureRecommendation {
  name: string;
  category: 'Engagement' | 'Social' | 'Creator Tools' | 'Safety/Parents' | 'Learning/Edu' | 'Monetization';
  impact: string;
  effort: 'S' | 'M' | 'L';
  why: string;
  risk_control: string;
}

export interface ProductStrategy {
  top_features: FeatureRecommendation[];
}

// --- TREND ANALYST TYPES ---
export interface TrendItem {
  rank: number;
  title: string;
  why_popular: string;
  recommended_for_age: string[];
  prompt_starter: string;
  safety_note: string;
}

export interface TrendAnalysis {
  trend_digest: TrendItem[];
  do_not_recommend: { tag: string; reason: string }[];
  update_frequency: string;
}
