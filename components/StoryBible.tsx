
import React from 'react';
import { AppView, StoryBible } from '../types';
import { Card, Badge, Button } from './UIComponents';
import { Users, MapPin, Palette, Lock, Library } from 'lucide-react';

interface BibleProps {
  bible?: StoryBible;
  onNavigate?: (view: AppView) => void;
}

export const StoryBibleView: React.FC<BibleProps> = ({ bible, onNavigate }) => {
  if (!bible) {
      return (
          <div className="p-8 h-full flex flex-col items-center justify-center text-center">
              <div className="glass-panel p-10 rounded-3xl max-w-lg border-white/10 shadow-[0_0_30px_rgba(188,19,254,0.1)]">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                      <Lock className="w-10 h-10 text-white/30" />
                  </div>
                  <h2 className="text-3xl font-cyber font-bold text-white mb-2">DATABASE ENCRYPTED</h2>
                  <p className="text-white/50 mb-8 font-mono text-sm">
                      No narrative bible found in active memory. Initialize a project to decrypt assets.
                  </p>
                  <Button variant="secondary" onClick={() => onNavigate?.(AppView.LIBRARY)}>
                      <Library className="w-4 h-4 mr-2" /> ACCESS LIBRARY
                  </Button>
              </div>
          </div>
      );
  }

  return (
    <div className="p-8 overflow-y-auto h-full max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-4">
          <div className="p-3 bg-neon-purple/10 rounded-xl border border-neon-purple/30 text-neon-purple">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-cyber font-bold text-white tracking-wide">STORY BIBLE</h2>
            <p className="text-white/40 font-mono text-sm">Consistency Database & Assets</p>
          </div>
      </div>

      <div className="grid gap-8">
        {/* Style Guide Panel */}
        <Card className="p-6 border-l-4 border-l-neon-purple bg-gradient-to-r from-neon-purple/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
                <Palette className="w-5 h-5 text-neon-purple" />
                <h3 className="font-bold text-lg text-white font-cyber">ART DIRECTION & TONE</h3>
            </div>
            <div className="flex flex-wrap gap-3">
                <Badge color="bg-neon-purple/20 text-neon-purple border border-neon-purple/50 px-4 py-2 text-sm">{bible.artStyle}</Badge>
                <Badge color="bg-neon-blue/20 text-neon-blue border border-neon-blue/50 px-4 py-2 text-sm">{bible.tone}</Badge>
            </div>
        </Card>

        {/* Characters Grid */}
        <div>
            <h3 className="font-bold text-neon-blue uppercase tracking-[0.2em] font-cyber text-sm mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-blue rounded-full"></div> CHARACTERS
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
                {bible.characters.map(char => (
                    <Card key={char.id} className="p-6 bg-black/40 hover:border-neon-blue/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-xl text-white font-cyber">{char.name}</h4>
                            <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/60 border border-white/10">{char.role}</span>
                        </div>
                        <p className="text-sm text-white/70 mb-4 line-clamp-3 leading-relaxed font-light">{char.description}</p>
                        <div className="p-3 bg-white/5 rounded-xl text-xs text-blue-200/60 border border-white/10 font-mono">
                            <strong className="text-neon-blue block mb-1">VISUAL TRAITS:</strong> 
                            {char.visualTrait}
                        </div>
                    </Card>
                ))}
            </div>
        </div>

        {/* Settings Grid */}
        <div>
            <h3 className="font-bold text-neon-pink uppercase tracking-[0.2em] font-cyber text-sm mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-pink rounded-full"></div> LOCATIONS
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
                {bible.settings.map(place => (
                    <Card key={place.id} className="p-6 bg-black/40 hover:border-neon-pink/50 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-neon-pink" />
                            <h4 className="font-bold text-lg text-white font-cyber">{place.name}</h4>
                        </div>
                        <p className="text-sm text-white/70 line-clamp-3 leading-relaxed font-light">{place.description}</p>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
