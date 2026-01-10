
import { GoogleGenAI, Type } from "@google/genai";
import { StoryBible, Scene, StoryMode, SafetyLevel, StoryBibleSeed, ExportHints, CinematicAudioScript, LanguageMode, UnitSoundDesign, TrendAnalysis, ProductStrategy } from './types';
import { MODEL_TEXT_FAST, MODEL_TEXT_CREATIVE, MODEL_IMAGE, RECOMMENDATIONS } from './constants';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

// --- HELPER: JSON Parser that handles Markdown blocks ---
const cleanAndParseJSON = (text: string, defaultVal: any = {}) => {
    if (!text) return defaultVal;
    try {
        // 1. Remove markdown code blocks (```json ... ```)
        let clean = text.replace(/```json\s*|```/g, '');
        
        // 2. Find the first '{' and last '}' to extract the JSON object
        // This handles cases where the model puts text before or after the JSON
        const firstBrace = clean.indexOf('{');
        const lastBrace = clean.lastIndexOf('}');
        
        if (firstBrace >= 0 && lastBrace >= 0 && lastBrace > firstBrace) {
            clean = clean.substring(firstBrace, lastBrace + 1);
        }

        return JSON.parse(clean);
    } catch (e) {
        console.error("JSON Parse Error:", e, "\nOriginal Text:", text);
        return defaultVal;
    }
};

// --- HELPER: Retry Logic for 429/Quota Errors ---
const generateContentSafe = async (params: any, retries = 3): Promise<any> => {
    const client = getClient();
    for (let i = 0; i < retries; i++) {
        try {
            return await client.models.generateContent(params);
        } catch (error: any) {
            // Check for rate limit / quota errors
            const isRateLimit = error.status === 429 || 
                                (error.message && (error.message.includes('429') || error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')));
            
            if (isRateLimit) {
                 console.warn("API Quota Exceeded. Skipping retries and using fallback.");
                 throw error; 
            }

            if (i < retries - 1) {
                const waitTime = 3000 * Math.pow(2, i); 
                console.warn(`API Error. Retrying in ${waitTime}ms... (Attempt ${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
};

// --- SYSTEM PROMPTS (Internal) ---
const SAFETY_PROMPT = (level: SafetyLevel) => {
  if (level === SafetyLevel.STRICT) return "Strictly filter all violence, scary themes, romance, and rude language. Ensure content is purely wholesome and educational.";
  if (level === SafetyLevel.MODERATE) return "Filter explicit violence and sexual content. Mild conflict and adventure are allowed.";
  return "Standard safety filters apply. Avoid hate speech and explicit NSFW content.";
};

// 1. Prompt Refiner & Scorer
export const refinePrompt = async (
  originalPrompt: string, 
  age: string, 
  mode: string, 
  safety: SafetyLevel
): Promise<{ refinedPrompt: string; title: string; score: number; summary: string; seed: StoryBibleSeed }> => {
  
  const systemInstruction = `You are the "World-Class Prompt Refiner" (Kids/Teens Safe).
  Role: Accept a user's Idea Prompt and transform it into a precise, actionable, and safe "Production Prompt".
  
  Context:
  - Target Audience: ${age}
  - Genre/Mode: ${mode}
  - Safety Level: ${SAFETY_PROMPT(safety)}

  Principles:
  1. Measureable: clearly specify genre, tone, POV, length, scene count, structure, twists, ending, and moral (if applicable).
  2. Consistency: Separate Character/Location/Rules into a "Story Bible Seed" within the prompt logic.
  3. Reading Level: Adjust vocabulary and complexity to suit ${age}.
  4. Visual Instructions: Include specific directives for illustration style, color palette, and mood.
  5. Safety: Filter/Adjust inappropriate content (violence, sexual, self-harm, profanity, PII).
  6. Constraint: Do NOT write the full story. Generate the structural prompt and guidelines only.
  7. Output Language: Ensure the 'title' and 'summary' are in THAI (ภาษาไทย), but keep the 'production_prompt' in English for better image generation compatibility, or Thai if specifically requested for text generation nuance. Let's keep 'production_prompt' in English for consistency. 'auto_fix_notes' should be in Thai.

  Output Format (JSON Only):
  {
    "quality_score_0_100": number,
    "detected_intent": "string",
    "title": "string (Thai)",
    "production_prompt": "string (English recommended for internal logic)",
    "story_bible_seed": {
      "target_age": "string",
      "genre": "string",
      "tone": "string",
      "main_characters": [{ "name": "string", "role": "string", "traits": "string", "visual_signature": "string" }],
      "locations": [{ "name": "string", "description": "string" }],
      "world_rules": ["string"]
    },
    "auto_fix_notes": ["string (Thai)"]
  }`;

  try {
    const response = await generateContentSafe({
        model: MODEL_TEXT_FAST,
        contents: `Raw Idea: "${originalPrompt}"`,
        config: {
        responseMimeType: "application/json",
        systemInstruction: systemInstruction,
        }
    });

    const data = cleanAndParseJSON(response.text);
    return {
        refinedPrompt: data.production_prompt || originalPrompt,
        title: data.title || "Untitled Story",
        score: data.quality_score_0_100 || 50,
        summary: data.auto_fix_notes?.join('. ') || "ปรับปรุงคำสั่งให้ชัดเจนและปลอดภัยแล้วครับ",
        seed: data.story_bible_seed || {}
    };
  } catch (e) {
    console.error("Refine Prompt Error", e);
    return { 
      refinedPrompt: originalPrompt, 
      title: "เรื่องใหม่", 
      score: 50, 
      summary: "ระบบกำลังมีปัญหา (อาจเป็นที่อินเทอร์เน็ตหรือโควต้า)",
      seed: {} as StoryBibleSeed 
    };
  }
};

// 2. Story Bible Builder – Continuity Director
export const generateStoryBible = async (
  refinedPrompt: string, 
  seed: StoryBibleSeed, 
  safety: SafetyLevel
): Promise<StoryBible> => {
  
  const systemInstruction = `You are the "Story Bible Builder – Continuity Director".
  Your goal: Create a comprehensive Story Bible to ensure narrative and visual consistency for a ${seed.target_age} year old's story.
  Input: Production Prompt + Bible Seed.
  Safety: ${SAFETY_PROMPT(safety)}

  Deliverables:
  1. Character Sheets: Expanded details, catchphrases, and SPECIFIC visual traits for AI image gen.
  2. Location Bible: Key details and sensory cues.
  3. Plot Spine: Start, Middle, End, Theme.
  4. Style Guide: Art style, palette, lighting.
  5. Consistency Tokens: Create unique, short, descriptive "Tokens" (keywords) for each character/location to be inserted into EVERY image prompt.
  6. Glossary: Create a map of proper nouns (names, places) to their English translations.
  
  Language: Content within the bible (descriptions, roles) can be in Thai or English, but Thai is preferred for 'description' and 'personality' to display to the user. 'visualTrait' should be English for Image Gen.

  Output Format (JSON):
  {
    "bible": {
       "characters": [{ "name": "string", "role": "string", "description": "string (Thai)", "visualTrait": "string (English - detailed)", "personality": "string (Thai)" }],
       "locations": [{ "name": "string", "description": "string (Thai)", "visualStyle": "string (English)" }],
       "plot_spine": { "start": "string", "middle": "string", "end": "string", "theme": "string", "lesson": "string" },
       "style_guide": { "art_style": "string", "palette": "string", "lighting": "string" }
    },
    "consistency_tokens": {
       "character_tokens": { "CharacterName": "string (e.g. 'wearing a red hoodie, messy hair')" },
       "location_tokens": { "LocationName": "string" },
       "global_style_tokens": ["string", "string"]
    },
    "glossary": { "ThaiName": "EnglishName" }
  }`;

  const response = await generateContentSafe({
    model: MODEL_TEXT_FAST,
    contents: `Production Prompt: ${refinedPrompt}. \n Bible Seed: ${JSON.stringify(seed)}`,
    config: {
      responseMimeType: "application/json",
      systemInstruction: systemInstruction
    }
  });

  const data = cleanAndParseJSON(response.text);
  const bibleData = data.bible || {};
  
  return {
    characters: bibleData.characters?.map((c: any) => ({ ...c, id: crypto.randomUUID() })) || [],
    settings: bibleData.locations?.map((s: any) => ({ ...s, id: crypto.randomUUID() })) || [],
    artStyle: bibleData.style_guide?.art_style || "Digital Illustration",
    tone: seed.tone || "Fun",
    plotSpine: bibleData.plot_spine,
    consistency: data.consistency_tokens,
    glossary: data.glossary || {}
  };
};

// 3. Story Generator (Full Draft)
export const generateStoryDraft = async (
  refinedPrompt: string, 
  sceneCount: number, 
  bible: StoryBible,
  mode: StoryMode,
  safety: SafetyLevel
): Promise<Scene[]> => {
  
  const systemInstruction = `You are a "Professional Children/YA Writer".
  
  Task: Create a full story draft based on the Story Bible.
  
  Language Requirements:
  - Narrative (Text) & Dialogue: THAI (ภาษาไทย).
  
  Context:
  - Count: Exactly ${sceneCount} units (scenes/chapters).
  - Mode: ${mode}.
  - Safety: ${SAFETY_PROMPT(safety)}
  - Plot Spine: ${JSON.stringify(bible.plotSpine)}

  Format Constraint: Return valid JSON.
  {
    "units": [
      {
        "unit_no": 1,
        "title": "string (Thai)",
        "text": "string (Thai narrative)",
        "dialogue": ["string (Thai dialogue lines)"],
        "emotion_beat": "string"
      }
    ]
  }`;

  const response = await generateContentSafe({
    model: MODEL_TEXT_CREATIVE,
    contents: `Refined Request: "${refinedPrompt}". \n Bible: ${JSON.stringify(bible)}`,
    config: {
      responseMimeType: "application/json",
      systemInstruction: systemInstruction
    }
  });

  const data = cleanAndParseJSON(response.text, { units: [] });

  return (data.units || []).map((item: any, index: number) => ({
    id: crypto.randomUUID(),
    order: index + 1,
    content: `## ${item.title}\n\n${item.text}\n\n${(item.dialogue || []).map((d:string) => `- ${d}`).join('\n')}`,
    imagePrompt: "", // Will be filled by the Visual Director
    isGeneratingImage: false
  }));
};

// 4. Illustration Prompt Generator
export const generateProImagePrompts = async (
  scenes: Scene[],
  bible: StoryBible,
  safety: SafetyLevel
): Promise<Scene[]> => {

  const consistencyTokens = bible.consistency ? JSON.stringify(bible.consistency) : "Use consistent characters.";
  const inputUnits = scenes.map(s => ({ unit_no: s.order, content: s.content }));

  const systemInstruction = `You are the "Illustration Prompt Generator – World-Class Visual Director (Kid/Teen Safe)".
  
  Input: List of story units + Consistency Tokens.
  
  Task: Generate a production-ready image prompt for EACH unit.
  
  Rules:
  1. Consistency: You MUST include the specific Character Tokens and Global Style Tokens in every prompt to ensure characters look the same.
  2. Detail: Specify subject, action, location, camera angle, lighting, and mood.
  3. Safety: ${SAFETY_PROMPT(safety)}
  4. Alt Text: Provide a Thai description (Alt Text) for accessibility.

  Output Format (JSON Only):
  {
    "images": [
      {
        "unit_no": 1,
        "image_prompt": "string (English, optimized for GenAI)",
        "negative_prompt": "string (English, what to avoid)",
        "alt_text_th": "string (Thai description)"
      }
    ]
  }`;

  const response = await generateContentSafe({
    model: MODEL_TEXT_FAST,
    contents: `Story Units: ${JSON.stringify(inputUnits)}. \n Consistency Tokens: ${consistencyTokens}.`,
    config: {
      responseMimeType: "application/json",
      systemInstruction: systemInstruction
    }
  });

  const data = cleanAndParseJSON(response.text);

  // Merge the new visual directions into the existing scenes
  return scenes.map(scene => {
    const visualData = data.images?.find((img: any) => img.unit_no === scene.order);
    if (visualData) {
      return {
        ...scene,
        imagePrompt: visualData.image_prompt,
        negativePrompt: visualData.negative_prompt,
        altText: visualData.alt_text_th
      };
    }
    return scene;
  });
};

// 5. Image Generator
export const generateSceneImage = async (imagePrompt: string, negativePrompt?: string): Promise<string> => {
  // Gemini 2.5 Flash Image uses generateContent. 
  let finalPrompt = imagePrompt;
  if (negativePrompt) {
    finalPrompt += `\n\n(NO: ${negativePrompt})`;
  }

  try {
    const response = await generateContentSafe({
      model: MODEL_IMAGE,
      contents: {
        parts: [{ text: finalPrompt }]
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return "";
  } catch (error) {
    console.error("Image gen error", error);
    return ""; 
  }
};

// 6. QA Editor + Safety Reviewer
export const reviewStory = async (
  scenes: Scene[],
  bible: StoryBible,
  age: string,
  safety: SafetyLevel
): Promise<{ issues: string[]; fixedScenes: Scene[]; exportHints: ExportHints }> => {
  
  const inputContext = {
    scenes: scenes.map(s => ({
      unit_no: s.order,
      content: s.content,
      image_prompt: s.imagePrompt,
      alt_text: s.altText
    })),
    bible: {
      characters: bible.characters.map(c => ({ name: c.name, visual: c.visualTrait })),
      consistency_tokens: bible.consistency
    },
    target_age: age
  };

  const systemInstruction = `You are the "QA Editor + Safety Reviewer".
  
  Goal: Polish the story to perfection.
  Checks:
  1. Consistency: Ensure character names, visuals, and logic match the Story Bible.
  2. Safety & Age Appropriateness: Verify content suits ${age} year olds (${SAFETY_PROMPT(safety)}).
  3. Language (Thai): Ensure narrative flows naturally in Thai.
  4. Text-Image Alignment: Ensure image prompts match the story events.

  Output Format (JSON Only):
  {
    "issues": ["List of detected issues (string in Thai)"],
    "fixed_units": [
      { "unit_no": 1, "title": "string", "text": "string", "dialogue": ["string"] } 
    ],
    "fixed_images": [
      { "unit_no": 1, "image_prompt": "string", "negative_prompt": "string", "alt_text_th": "string" }
    ],
    "export_hints": {
       "pdf_layout": "string",
       "cover_idea": "string"
    }
  }`;

  const response = await generateContentSafe({
    model: MODEL_TEXT_FAST,
    contents: `Review Context: ${JSON.stringify(inputContext)}`,
    config: {
      responseMimeType: "application/json",
      systemInstruction: systemInstruction
    }
  });

  const data = cleanAndParseJSON(response.text, { issues: [], fixed_units: [], fixed_images: [], export_hints: {} });

  const issues = data.issues || [];
  
  // Merge fixes into scenes
  const fixedScenes = scenes.map(scene => {
    let updatedScene = { ...scene };
    
    // Apply Text Fixes
    const textFix = data.fixed_units?.find((u: any) => u.unit_no === scene.order);
    if (textFix) {
        updatedScene.content = `## ${textFix.title}\n\n${textFix.text}\n\n${(textFix.dialogue || []).map((d:string) => `- ${d}`).join('\n')}`;
    }

    // Apply Image Fixes
    const imgFix = data.fixed_images?.find((u: any) => u.unit_no === scene.order);
    if (imgFix) {
        updatedScene.imagePrompt = imgFix.image_prompt;
        updatedScene.negativePrompt = imgFix.negative_prompt;
        updatedScene.altText = imgFix.alt_text_th;
    }

    return updatedScene;
  });

  return { 
      issues, 
      fixedScenes, 
      exportHints: { 
          pdfLayout: data.export_hints?.pdf_layout,
          coverIdea: data.export_hints?.cover_idea
      } 
  };
};

// 7. NEW AGENT: Polyglot Translator (Bilingual Mode)
export const translateContent = async (
    content: string, 
    bible: StoryBible,
    targetAge: string
): Promise<string> => {
    
    const glossary = bible.glossary ? JSON.stringify(bible.glossary) : "{}";
    
    const systemInstruction = `You are the "Polyglot Story Translator" (Thai -> English).
    Target Audience: ${targetAge} years old.
    
    Rules:
    1. Maintain exact Markdown structure (headers, lists).
    2. Tone: Match the original Thai tone (Fun, Serious, Scary, etc).
    3. GLOSSARY STRICTNESS: You MUST use the provided glossary for proper nouns.
    4. Output only the translated text. Do not add explanations.
    
    Glossary (TH->EN): ${glossary}`;

    const response = await generateContentSafe({
        model: MODEL_TEXT_FAST,
        contents: content,
        config: {
            systemInstruction: systemInstruction
        }
    });

    return response.text || "";
};

// 8. NEW AGENT: Voice Director – Cinematic Narration (Updated)
export const generateCinematicAudioScript = async (
    content: string,
    bible: StoryBible,
    languageMode: LanguageMode,
    targetAge: string,
    unitNo: number
): Promise<CinematicAudioScript> => {

    const characters = bible.characters.map(c => c.name).join(", ");
    const voiceCast = `Narrator (Standard), ${characters}`;
    
    const systemInstruction = `You are the "Voice Director – Cinematic Narration (Kids/Teens Safe)".
    Role: Create a professional voice acting script for a story unit.
    
    Input:
    - Text Content (Thai/English)
    - Target Age: ${targetAge}
    - Voice Cast: ${voiceCast}
    - Language Mode: ${languageMode}
    
    Tasks:
    1. Analyze the text and split into "Tracks".
       - Create separate tracks for Narrator vs Characters.
       - If BILINGUAL, create tracks for BOTH languages (e.g. TH_NARRATOR, EN_NARRATOR).
    2. Directing:
       - Emotion: Assign valid emotions (warm, excited, sad, whisper, shout).
       - Pace: Words per minute (120-160 typical).
       - Energy: low, medium, high.
    3. SSML Generation:
       - Wrap text in <speak> tags.
       - Use <break time="500ms"/> for pauses.
       - Use <emphasis> for key words.
       - Use <prosody rate="fast/slow"> if needed.
    4. Pronunciation Lexicon:
       - Identify difficult names/terms and provide IPA or phonetic notes.
    
    Safety:
    - No horror/gore sounds.
    - No profanity.
    
    Output Format (JSON Only):
    {
      "audio_script": [
        {
          "unit_no": ${unitNo},
          "tracks": [
            {
              "track_id": "string (e.g., TH_NARRATOR, EN_HERO)",
              "speaker": "string",
              "style": {"emotion": "string", "pace_wpm": number, "energy": "low|medium|high"},
              "ssml": "<speak>string</speak>",
              "timing_hint_sec": number
            }
          ],
          "pronunciation_lexicon":[{"word": "string", "ipa": "string", "note": "string"}]
        }
      ],
      "qc_rules":["string"]
    }`;

    // Pass bilingual content context if needed, for now we assume 'content' contains the primary text
    // In a real app, we might pass both TH and EN text blocks here if they exist.
    
    const response = await generateContentSafe({
        model: MODEL_TEXT_FAST,
        contents: `Story Content: ${content}`,
        config: {
            responseMimeType: "application/json",
            systemInstruction: systemInstruction
        }
    });

    const data = cleanAndParseJSON(response.text);
    // Extract the specific unit script
    const script = data.audio_script?.find((s:any) => s.unit_no === unitNo);
    
    if (script) {
        return {
            unit_no: unitNo,
            tracks: script.tracks,
            pronunciation_lexicon: script.pronunciation_lexicon
        };
    }
    return { unit_no: unitNo, tracks: [], pronunciation_lexicon: [] };
};

// 9. NEW AGENT: Sound Designer – Immersive Audio
export const generateSoundDesign = async (
    content: string,
    imagePrompt: string,
    audioScript: CinematicAudioScript | undefined,
    targetAge: string,
    unitNo: number,
    safetyLevel: SafetyLevel
): Promise<UnitSoundDesign> => {
    
    const durationHint = audioScript?.tracks.reduce((acc, t) => Math.max(acc, t.timing_hint_sec), 30) || 30;
    const intensity = safetyLevel === SafetyLevel.STRICT ? 'low' : 'medium';

    const systemInstruction = `You are the "Sound Designer – Immersive Audio (Kids/Teens Safe)".
    Role: Create a soundscape specification (SFX, BGM, Ambience) suitable for the scene and age group.
    
    Inputs:
    - Text Content: ${content}
    - Visual Context: ${imagePrompt}
    - Target Age: ${targetAge}
    - Est Duration: ${durationHint} seconds
    - Intensity Limit: ${intensity} (Low=Toddlers, Med=Kids, High=Teens)

    Directives:
    1. Safety First: No ear-piercing noises, no horror jumpscares.
    2. Mix Guidelines: Ensure SFX does not drown out the dialogue (ducking).
    3. Layers:
       - Ambience: Background loops (wind, forest, city).
       - BGM: Background Music mood.
       - SFX: Specific timing cues (footsteps, magic chime).

    Output Format (JSON Only):
    {
     "sound_cues": [
       {
         "unit_no": ${unitNo},
         "ambience": [{"type": "string", "start": "string (0s)", "end": "string", "mix_db": number}],
         "bgm": [{"mood": "string", "start": "string", "end": "string", "mix_db": number}],
         "sfx": [
           {"name": "string", "at": "string (e.g. 5s)", "mix_db": number, "note": "string"}
         ],
         "safety_check": "string (pass/fail)"
       }
     ],
     "mix_guidelines":{
       "dialogue_priority": "always_on_top",
       "max_sfx_per_minute": number,
       "ducking_when_speaking_db": number
     }
    }`;

    const response = await generateContentSafe({
        model: MODEL_TEXT_FAST,
        contents: `Analyze this scene for sound design.`,
        config: {
            responseMimeType: "application/json",
            systemInstruction: systemInstruction
        }
    });

    const data = cleanAndParseJSON(response.text);
    const design = data.sound_cues?.find((s:any) => s.unit_no === unitNo);
    
    if (design) {
        return {
            unit_no: unitNo,
            ambience: design.ambience,
            bgm: design.bgm,
            sfx: design.sfx,
            safety_check: design.safety_check,
            mix_guidelines: data.mix_guidelines
        };
    }
    return { unit_no: unitNo, ambience: [], bgm: [], sfx: [], safety_check: "error" };
};

// 10. NEW AGENT: Trend Analyst
export const generateTrendAnalysis = async (): Promise<TrendAnalysis> => {
    // Mock internal metrics to simulate a data source
    const MOCK_METRICS = {
      total_reads_last_24h: 4500,
      top_tags: ["โรงเรียนเวทมนตร์", "แมวจอมป่วน", "ทำอาหาร", "สืบสวนจิ๋ว"],
      completion_rate_by_genre: {
        "Fantasy": 85,
        "Sci-Fi": 70,
        "SliceOfLife": 92
      },
      avg_read_time: "3 mins"
    };

    const systemInstruction = `You are the "Trend Analyst – Kids/Teens Story Platform".
    Role: Analyze internal metrics to identify 15 trending story themes that are short, fast to read, and safe.
    
    Input Metrics (Simulated): ${JSON.stringify(MOCK_METRICS)}
    Safety Policy: STRICT (Kids/Teens Safe). No explicit romance, violence, or horror.

    Task:
    1. Identify 15 distinct trends based on high engagement potential.
    2. Rank them 1-15.
    3. Explain "Why Popular" (e.g. "Quick read", "Relatable").
    4. Provide a "Prompt Starter" for users to immediately create this story.
    5. Output Language: THAI (ภาษาไทย) for all user-facing strings (title, why_popular, prompt_starter).
    
    Output Format (JSON Only):
    {
     "trend_digest": [
       {
         "rank": 1,
         "title": "string (Thai)",
         "why_popular": "string (Thai)",
         "recommended_for_age": ["string"],
         "prompt_starter": "string (Thai - ready for create wizard)",
         "safety_note": "string"
       }
     ],
     "do_not_recommend": [{"tag": "string", "reason": "string"}],
     "update_frequency": "daily"
    }`;

    // Fallback Data if API fails
    const FALLBACK_TRENDS: TrendAnalysis = {
        trend_digest: [
            {
                rank: 1,
                title: "โรงเรียนเวทมนตร์ฉบับกระเป๋า",
                why_popular: "เรื่องราวแฟนตาซีโรงเรียนที่เข้าถึงง่าย สนุก ตื่นเต้น",
                recommended_for_age: ["9-12", "13+"],
                prompt_starter: "เด็กชายคนหนึ่งพบว่ากระเป๋านักเรียนของเขาเป็นประตูมิติสู่โรงเรียนเวทมนตร์...",
                safety_note: "Safe"
            },
            {
                rank: 2,
                title: "นักสืบจิ๋วกับแมวพูดได้",
                why_popular: "การสืบสวนสอบสวนที่น่ารักและไม่รุนแรง",
                recommended_for_age: ["6-8", "9-12"],
                prompt_starter: "แมวสีส้มตัวอ้วนที่บ้านจู่ๆ ก็พูดภาษาคนได้ และขอให้ช่วยตามหาปลาทูทองคำที่หายไป",
                safety_note: "Safe"
            },
            {
                rank: 3,
                title: "ฮีโร่พิทักษ์โลกผักผลไม้",
                why_popular: "ปลูกฝังการกินผักผ่านฮีโร่สุดเท่",
                recommended_for_age: ["3-5", "6-8"],
                prompt_starter: "ในเมืองที่ทุกคนเป็นผักผลไม้ มีวายร้ายขนมหวานกำลังบุกมา...",
                safety_note: "Safe"
            },
            {
                rank: 4,
                title: "การผจญภัยในโลกไดโนเสาร์",
                why_popular: "เด็กๆ ชื่นชอบไดโนเสาร์และการสำรวจโลกดึกดำบรรพ์",
                recommended_for_age: ["6-8", "9-12"],
                prompt_starter: "กลุ่มเพื่อนค้นพบถ้ำลึกลับที่พาพวกเขาย้อนเวลากลับไปยุคจูราสสิค",
                safety_note: "Safe"
            },
            {
                rank: 5,
                title: "ร้านขนมหวานแห่งความลับ",
                why_popular: "ผสมผสานความน่ากินของขนมกับเวทมนตร์เล็กๆ น้อยๆ",
                recommended_for_age: ["6-8", "Teens"],
                prompt_starter: "คุณยายมอบสูตรคุกกี้วิเศษที่กินแล้วสามารถอ่านใจคนได้ 1 นาที",
                safety_note: "Safe"
            },
            {
                rank: 6,
                title: "ภารกิจกู้โลกไซเบอร์",
                why_popular: "ธีมเทคโนโลยีและเกมที่เข้ากับยุคสมัย",
                recommended_for_age: ["9-12", "13+"],
                prompt_starter: "เมื่อตัวละครในเกมหลุดออกมาในโลกความจริง เด็กติดเกมต้องกลายเป็นฮีโร่",
                safety_note: "Safe"
            },
            {
                rank: 7,
                title: "ความลับของสัตว์เลี้ยง",
                why_popular: "จินตนาการว่าสัตว์เลี้ยงทำอะไรตอนเราไม่อยู่บ้าน",
                recommended_for_age: ["3-5", "6-8"],
                prompt_starter: "หมาน้อยที่แอบเป็นสายลับปกป้องบ้านตอนเจ้าของไปโรงเรียน",
                safety_note: "Safe"
            },
            {
                rank: 8,
                title: "นิทานก่อนนอนฉบับอวกาศ",
                why_popular: "สร้างจินตนาการเกี่ยวกับดวงดาวและการเดินทางไกล",
                recommended_for_age: ["3-5", "6-8"],
                prompt_starter: "กระต่ายบนดวงจันทร์ที่เหงาและอยากชวนเด็กๆ ไปงานปาร์ตี้น้ำชา",
                safety_note: "Safe"
            },
            {
                rank: 9,
                title: "ตำนานผีไทย (ฉบับน่ารัก)",
                why_popular: "ความเชื่อท้องถิ่นที่นำมาเล่าใหม่ให้ไม่น่ากลัวแต่สนุก",
                recommended_for_age: ["9-12", "13+"],
                prompt_starter: "ผีกระหังที่บินไม่ได้เพราะปวดหลัง ต้องมาขอให้เด็กๆ ช่วย",
                safety_note: "Safe"
            },
            {
                rank: 10,
                title: "นักเดินทางข้ามเวลาตัวจิ๋ว",
                why_popular: "เรียนรู้ประวัติศาสตร์ผ่านการผจญภัยที่สนุกสนาน",
                recommended_for_age: ["9-12", "13+"],
                prompt_starter: "นาฬิกาของคุณปู่พาเด็กๆ ย้อนเวลาไปพบกับบุคคลสำคัญในอดีต",
                safety_note: "Safe"
            },
            {
                rank: 11,
                title: "อาณาจักรใต้สมุทร",
                why_popular: "สำรวจโลกใต้น้ำที่เต็มไปด้วยสีสันและสัตว์แปลกตา",
                recommended_for_age: ["6-8", "9-12"],
                prompt_starter: "เงือกน้อยพาเด็กๆ ไปชมเมืองปะการังที่ซ่อนอยู่ใต้ทะเลลึก",
                safety_note: "Safe"
            },
            {
                rank: 12,
                title: "วงดนตรีโรงเรียนปีศาจ",
                why_popular: "ความสนุกสนานของเสียงดนตรีและมิตรภาพที่แตกต่าง",
                recommended_for_age: ["9-12", "13+"],
                prompt_starter: "เด็กมนุษย์หลงเข้าไปเป็นมือกลองในวงดนตรีของเหล่ามอนสเตอร์",
                safety_note: "Safe"
            },
            {
                rank: 13,
                title: "หุ่นยนต์มีหัวใจ",
                why_popular: "เรื่องราวซึ้งกินใจเกี่ยวกับมิตรภาพระหว่างเด็กและหุ่นยนต์",
                recommended_for_age: ["6-8", "9-12"],
                prompt_starter: "หุ่นยนต์พี่เลี้ยงเริ่มมีความรู้สึกเมื่อต้องดูแลเด็กกำพร้า",
                safety_note: "Safe"
            },
            {
                rank: 14,
                title: "กีฬาสีมหัศจรรย์",
                why_popular: "การแข่งขันที่เน้นความสามัคคีและพลังวิเศษ",
                recommended_for_age: ["6-8", "9-12"],
                prompt_starter: "งานกีฬาสีที่นักเรียนใช้เวทมนตร์ในการแข่งวิ่งและว่ายน้ำ",
                safety_note: "Safe"
            },
            {
                rank: 15,
                title: "ความลับของผู้พิทักษ์ป่า",
                why_popular: "ปลูกจิตสำนึกรักษ์ธรรมชาติผ่านเรื่องราวลึกลับ",
                recommended_for_age: ["9-12", "13+"],
                prompt_starter: "เด็กเมืองกรุงพบกับภูตจิ๋วที่ทำหน้าที่ปกป้องป่าหลังบ้าน",
                safety_note: "Safe"
            }
        ],
        do_not_recommend: [],
        update_frequency: "fallback"
    };

    try {
        const response = await generateContentSafe({
            model: MODEL_TEXT_FAST,
            contents: "Analyze current trends.",
            config: {
                responseMimeType: "application/json",
                systemInstruction: systemInstruction
            }
        });

        return cleanAndParseJSON(response.text);
    } catch (e: any) {
        if (e.status === 429 || (e.message && e.message.includes('429'))) {
             console.info("Using fallback trends (Quota Exceeded).");
        } else {
             console.warn("Trend Analysis API failed:", e);
        }
        return FALLBACK_TRENDS;
    }
};

// 11. NEW AGENT: Product Strategist
export const generateProductStrategy = async (): Promise<ProductStrategy> => {
  
  const systemInstruction = `You are the "Product Strategist – Kids/Teens Creative Platform".
  Mission: Recommend high-value features for a storytelling/comic platform.
  
  Market Context:
  - Interactive choice-based stories are trending.
  - Gamification (streaks/badges) boosts engagement.
  - Immersive audio is key for accessibility and engagement.
  - Safety-by-design and parental transparency are mandatory.
  
  Constraints:
  - Recommend at least 12 features.
  - Categories: 'Engagement', 'Social', 'Creator Tools', 'Safety/Parents', 'Learning/Edu'.
  - Provide Impact, Effort (S/M/L), and Risk Control for each.
  - Output Language: THAI (ภาษาไทย) for name, why, impact, risk_control.
  
  Output Format (JSON Only):
  {
   "top_features":[
    {"name":"string (Thai)","category":"string","impact":"string (Thai)","effort":"S|M|L","why":"string (Thai)", "risk_control":"string (Thai)"}
   ]
  }`;

  try {
    const response = await generateContentSafe({
        model: MODEL_TEXT_FAST,
        contents: "Generate feature strategy roadmap.",
        config: {
        responseMimeType: "application/json",
        systemInstruction: systemInstruction,
        }
    });

    return cleanAndParseJSON(response.text);
  } catch (e: any) {
    if (e.status === 429 || (e.message && e.message.includes('429'))) {
        console.info("Using fallback strategy (Quota Exceeded).");
    } else {
        console.warn("Product Strategy API failed:", e);
    }
    // Return hardcoded recommendations from constants as fallback
    return { top_features: RECOMMENDATIONS };
  }
};


// --- PIPELINE ORCHESTRATOR ---
export const orchestrateStoryCreation = async (
    rawPrompt: string,
    settings: {
        mode: StoryMode;
        age: string;
        count: number;
        safety: SafetyLevel;
    },
    preRefined?: {
        prompt: string;
        seed: StoryBibleSeed;
        title: string;
    },
    onProgress?: (message: string) => void
): Promise<{ 
    title: string; 
    bible: StoryBible; 
    scenes: Scene[]; 
    refinedPrompt: string; 
    seed: StoryBibleSeed; 
    exportHints: ExportHints;
}> => {
    
    // Step 1 & 2: Prompt Refinement
    let refinedPrompt = preRefined?.prompt;
    let seed = preRefined?.seed;
    let title = preRefined?.title;

    if (!refinedPrompt || !seed) {
        onProgress?.("กำลังเกลาไอเดีย + เช็คความปลอดภัย...");
        const refResult = await refinePrompt(rawPrompt, settings.age, settings.mode, settings.safety);
        refinedPrompt = refResult.refinedPrompt;
        seed = refResult.seed;
        title = refResult.title;
    }

    // Step 3: Story Bible Builder
    onProgress?.("กำลังสร้างคัมภีร์ข้อมูลเรื่อง (Story Bible)...");
    const bible = await generateStoryBible(refinedPrompt!, seed!, settings.safety);

    // Step 4: Story Generator (Drafting)
    onProgress?.("AI กำลังแต่งเนื้อเรื่องภาษาไทย...");
    let scenes = await generateStoryDraft(refinedPrompt!, settings.count, bible, settings.mode, settings.safety);

    // Step 5: Visual Director (Image Prompts)
    onProgress?.("ผู้กำกับกำลังวางมุมกล้องและภาพประกอบ...");
    scenes = await generateProImagePrompts(scenes, bible, settings.safety);

    // Step 6: QA & Safety Editor (Review & Fix)
    onProgress?.("ตรวจทานความเรียบร้อยขั้นตอนสุดท้าย...");
    const qaResult = await reviewStory(scenes, bible, settings.age, settings.safety);
    
    // Use the fixed version from QA
    const finalScenes = qaResult.fixedScenes;
    const exportHints = qaResult.exportHints;

    return {
        title: title || "Untitled",
        bible,
        scenes: finalScenes,
        refinedPrompt: refinedPrompt!,
        seed: seed!,
        exportHints
    };
};
