
import React, { useState } from 'react';
import { StoryProject, AppView, Scene } from '../types';
import { Card, Button, Badge } from './UIComponents';
import { Wand2, Lock, Library, ImageIcon, Sparkles, AlertTriangle } from 'lucide-react';
import { PhotoCompositor } from './PhotoCompositor';

interface MagicEditorViewProps {
  project: StoryProject | null;
  onNavigate?: (view: AppView) => void;
}

export const MagicEditorView: React.FC<MagicEditorViewProps> = ({ project, onNavigate }) => {
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  if (!project) {
       return (
          <div className="p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="glass-panel p-10 rounded-3xl max-w-lg border-white/10 shadow-[0_0_30px_rgba(255,0,255,0.1)]">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Lock className="w-10 h-10 text-white/30" />
                  </div>
                  <h2 className="text-3xl font-cyber font-bold text-white mb-2">ACCESS DENIED</h2>
                  <p className="text-white/50 mb-8 font-mono text-sm">
                      Magic Editor requires an active narrative sequence. Please load a project to manipulate visual assets.
                  </p>
                  <Button variant="secondary" onClick={() => onNavigate?.(AppView.LIBRARY)}>
                      <Library className="w-4 h-4 mr-2" /> ACCESS LIBRARY
                  </Button>
              </div>
          </div>
      );
  }

  const scenesWithImages = project.scenes.filter(s => s.imageUrl);

  return (
    <div className="flex flex-col h-full bg-transparent text-white relative">
      
      {/* Editor Overlay */}
      {selectedScene && (
        <PhotoCompositor 
          imageUrl={selectedScene.imageUrl!} 
          text={selectedScene.content} 
          emotion={selectedScene.emotion || 'Neutral'}
          onClose={() => setSelectedScene(null)}
        />
      )}

      {/* Header */}
      <div className="glass-panel px-8 py-6 border-b border-white/10 m-4 rounded-xl flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-cyber font-bold text-white flex items-center">
                    <Wand2 className="mr-3 text-neon-pink w-8 h-8 drop-shadow-[0_0_10px_rgba(255,0,255,0.6)]" /> 
                    MAGIC EDITOR
                </h2>
                <p className="text-white/50 mt-1 font-mono text-sm">Automated Scene Compositor & Typography Engine</p>
            </div>
            <div className="bg-neon-pink/10 px-4 py-2 rounded-lg border border-neon-pink/30 text-neon-pink text-xs font-bold font-cyber">
                {scenesWithImages.length} VISUALS READY
            </div>
          </div>
      </div>

      {/* Gallery Grid */}
      <div className="px-4 pb-4 overflow-y-auto flex-1 scroll-smooth">
          {scenesWithImages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <ImageIcon className="w-16 h-16 mb-4 text-white/20" />
                  <h3 className="text-xl font-bold font-cyber">NO VISUALS DETECTED</h3>
                  <p className="text-sm font-mono mt-2">Generate images in Holo-Studio first.</p>
                  <Button variant="ghost" className="mt-6" onClick={() => onNavigate?.(AppView.STUDIO)}>
                      GO TO STUDIO
                  </Button>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                  {scenesWithImages.map((scene) => (
                      <Card key={scene.id} className="group hover:border-neon-pink/50 transition-all bg-black/40" noPadding>
                          <div className="relative aspect-square overflow-hidden bg-black/50">
                              <img 
                                src={scene.imageUrl} 
                                alt={`Scene ${scene.order}`}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              />
                              <div className="absolute top-2 left-2">
                                  <Badge color="bg-black/60 text-white border border-white/20 backdrop-blur-md">
                                      UNIT {scene.order}
                                  </Badge>
                              </div>
                              <div className="absolute top-2 right-2">
                                  <Badge color="bg-neon-pink/20 text-neon-pink border border-neon-pink/50 backdrop-blur-md uppercase">
                                      {scene.emotion || 'NEUTRAL'}
                                  </Badge>
                              </div>
                              
                              {/* Overlay Action */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                                  <p className="text-xs text-white/70 mb-4 line-clamp-3 font-light italic">
                                      "{scene.content.substring(0, 100)}..."
                                  </p>
                                  <Button 
                                    variant="magic" 
                                    className="scale-90 hover:scale-100 shadow-neon-pink"
                                    onClick={() => setSelectedScene(scene)}
                                  >
                                      <Sparkles className="w-4 h-4 mr-2" /> EDIT TEXT
                                  </Button>
                              </div>
                          </div>
                          <div className="p-3 border-t border-white/10 flex justify-between items-center bg-white/5">
                              <span className="text-xs font-mono text-white/40">ID: {scene.id.slice(0,8)}</span>
                              <Sparkles className="w-3 h-3 text-neon-pink opacity-50" />
                          </div>
                      </Card>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
};
