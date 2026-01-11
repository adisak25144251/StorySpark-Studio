
import React, { useRef, useEffect, useState } from 'react';
import { Button, Card } from './UIComponents';
import { Download, Type, Palette, X, Image as ImageIcon, Sparkles } from 'lucide-react';

interface PhotoCompositorProps {
  imageUrl: string;
  text: string;
  emotion: string; // e.g. "Happy", "Dark", "Tense"
  onClose: () => void;
}

type TextStyle = 'CINEMATIC' | 'COMIC' | 'NEON' | 'HORROR' | 'BASIC';

export const PhotoCompositor: React.FC<PhotoCompositorProps> = ({ imageUrl, text, emotion, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [style, setStyle] = useState<TextStyle>('CINEMATIC');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(1);

  // Helper to extract clean narrative text (removing markdown headers like ## Scene 1)
  const cleanText = (raw: string) => {
    return raw.replace(/^##.*$/gm, '').replace(/^-.*$/gm, '').trim(); 
  };
  
  const narrative = cleanText(text);

  // Auto-detect style based on emotion
  useEffect(() => {
    const e = emotion.toLowerCase();
    if (e.includes('happy') || e.includes('fun') || e.includes('bright')) setStyle('COMIC');
    else if (e.includes('scary') || e.includes('tense') || e.includes('dark')) setStyle('HORROR');
    else if (e.includes('sci') || e.includes('tech') || e.includes('neon')) setStyle('NEON');
    else setStyle('CINEMATIC'); // Default
  }, [emotion]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      // 1. Setup Canvas Dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // 2. Draw Image
      ctx.drawImage(img, 0, 0);

      // 3. Apply Style & Draw Text
      const w = canvas.width;
      const h = canvas.height;
      const padding = w * 0.05;
      
      let fontName = 'Kanit'; // Default Thai-supporting font
      let fontSize = w * 0.04 * fontSizeScale; 
      
      // -- STYLE CONFIG --
      if (style === 'CINEMATIC') {
         // Letterbox
         const barHeight = h * 0.12;
         ctx.fillStyle = 'black';
         ctx.fillRect(0, h - barHeight, w, barHeight);
         
         ctx.font = `300 ${fontSize}px 'Kanit'`;
         ctx.fillStyle = 'white';
         ctx.textAlign = 'center';
         ctx.textBaseline = 'middle';
         
         wrapText(ctx, narrative, w / 2, h - (barHeight / 2), w * 0.8, fontSize * 1.5);
      
      } else if (style === 'COMIC') {
         // Speech Bubble / Caption Box
         const boxHeight = h * 0.25;
         ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
         ctx.strokeStyle = 'black';
         ctx.lineWidth = 4;
         roundRect(ctx, padding, h - boxHeight - padding, w - (padding*2), boxHeight, 20, true, true);
         
         ctx.font = `600 ${fontSize}px 'Kanit'`;
         ctx.fillStyle = 'black';
         ctx.textAlign = 'left';
         ctx.textBaseline = 'top';
         
         wrapText(ctx, narrative, padding * 1.5, h - boxHeight - padding + (padding), w - (padding*3), fontSize * 1.4);

      } else if (style === 'NEON') {
         // Dark overlay + Glowing Text
         const grad = ctx.createLinearGradient(0, h * 0.6, 0, h);
         grad.addColorStop(0, 'rgba(0,0,0,0)');
         grad.addColorStop(0.8, 'rgba(5,0,20,0.9)');
         ctx.fillStyle = grad;
         ctx.fillRect(0, h/2, w, h/2);

         ctx.font = `bold ${fontSize*1.2}px 'Kanit'`;
         ctx.textAlign = 'center';
         ctx.textBaseline = 'bottom';
         
         // Glow Effect
         ctx.shadowColor = '#00f3ff';
         ctx.shadowBlur = 15;
         ctx.fillStyle = 'white';
         wrapText(ctx, narrative, w/2, h - padding*2, w * 0.8, fontSize * 1.6);
         
         // Reset Shadow
         ctx.shadowBlur = 0;
      
      } else if (style === 'HORROR') {
          // Vignette + Red/Scratchy Text
          const grad = ctx.createRadialGradient(w/2, h/2, w/3, w/2, h/2, w);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(1, 'rgba(0,0,0,0.8)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          ctx.font = `800 ${fontSize*1.1}px 'Kanit'`; // Bold Kanit works well for horror too
          ctx.fillStyle = '#ff3333';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.shadowColor = 'black';
          ctx.shadowBlur = 5;
          
          wrapText(ctx, narrative, w/2, h - padding, w * 0.9, fontSize * 1.4);
      } else {
          // Basic
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(0, h - (h*0.2), w, h*0.2);
          ctx.font = `${fontSize}px 'Kanit'`;
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          wrapText(ctx, narrative, w/2, h - (h*0.1), w * 0.9, fontSize * 1.5);
      }
    };
  };

  useEffect(() => {
     drawCanvas();
  }, [style, fontSizeScale, narrative, imageUrl]);

  // Helper function to wrap text
  function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        // If single line text is very long, it handles basic wrapping.
        // For centering vertical block, ideally calculate total height first, but this is simple version.
        
        // Handle explicit newlines if any
        const paragraphs = text.split('\n');
        
        // Simple calculation for starting Y if we want to center vertically in a box (omitted for brevity, assume top-aligned relative to y)
        
        for(let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                ctx.fillText(line, x, currentY);
                line = words[i] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, currentY);
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      if (fill) ctx.fill();
      if (stroke) ctx.stroke();
  }

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `story_spark_edit_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in">
        <div className="w-full max-w-6xl h-full flex flex-col md:flex-row gap-6">
            
            {/* Left: Canvas Area */}
            <div className="flex-1 flex items-center justify-center bg-black/50 rounded-2xl border border-white/10 relative overflow-hidden">
                <canvas ref={canvasRef} className="max-w-full max-h-full shadow-2xl rounded-lg" />
            </div>

            {/* Right: Controls */}
            <div className="w-full md:w-80 glass-panel p-6 rounded-2xl flex flex-col gap-6 overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <h3 className="text-xl font-bold font-cyber text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-neon-blue" />
                        MAGIC EDITOR
                    </h3>
                    <button onClick={onClose} className="text-white/50 hover:text-white"><X className="w-5 h-5"/></button>
                </div>

                {/* Mood Indicator */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-xs text-white/40 block mb-1 font-mono uppercase">Detected Mood</span>
                    <span className="text-neon-pink font-bold font-cyber">{emotion || "NEUTRAL"}</span>
                </div>

                {/* Style Selector */}
                <div>
                    <label className="text-xs font-bold text-white/60 mb-3 block flex items-center">
                        <Palette className="w-3 h-3 mr-2"/> STYLE PRESET
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {['CINEMATIC', 'COMIC', 'NEON', 'HORROR'].map((s) => (
                            <button 
                                key={s}
                                onClick={() => setStyle(s as TextStyle)}
                                className={`text-xs font-bold py-3 px-2 rounded-lg border transition-all ${style === s ? 'bg-neon-blue/20 border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]' : 'bg-black/30 border-white/10 text-white/50 hover:bg-white/5'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Font Scale */}
                <div>
                    <label className="text-xs font-bold text-white/60 mb-3 block flex items-center">
                        <Type className="w-3 h-3 mr-2"/> FONT SIZE
                    </label>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1" 
                        value={fontSizeScale} 
                        onChange={(e) => setFontSizeScale(parseFloat(e.target.value))}
                        className="w-full accent-neon-blue h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                {/* Action */}
                <div className="mt-auto pt-4 border-t border-white/10">
                    <Button variant="magic" onClick={handleDownload} className="w-full">
                        <Download className="w-4 h-4 mr-2" /> SAVE IMAGE
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};
