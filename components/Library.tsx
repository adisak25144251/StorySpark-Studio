
import React from 'react';
import { StoryProject } from '../types';
import { Card, Button, Badge } from './UIComponents';
import { Book, Plus, Clock, Layout } from 'lucide-react';
import { PLACEHOLDER_IMAGE } from '../constants';

interface LibraryProps {
  projects: StoryProject[];
  onSelect: (p: StoryProject) => void;
  onCreateNew: () => void;
}

export const Library: React.FC<LibraryProps> = ({ projects, onSelect, onCreateNew }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
            <div>
                <h2 className="text-4xl font-cyber font-bold text-white mb-2 tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">MY LIBRARY</h2>
                <p className="text-blue-200/60 font-light">Your collected works in the neural cloud.</p>
            </div>
        </div>

        {projects.length === 0 ? (
            <div className="text-center py-20 glass-panel rounded-3xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <Book className="w-20 h-20 text-white/20 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Void Detected</h3>
                <p className="text-white/50 mb-8">No narrative sequences found in memory.</p>
                <Button variant="magic" onClick={onCreateNew}>Initialize New Story</Button>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(p => (
                    <Card key={p.id} className="group cursor-pointer hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all overflow-hidden border border-white/10 bg-black/40 hover:border-neon-blue/50" noPadding>
                        <div onClick={() => onSelect(p)}>
                            <div className="h-52 bg-black/60 relative group-hover:scale-105 transition-transform duration-700">
                                {p.scenes[0]?.imageUrl ? (
                                    <img src={p.scenes[0].imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10 bg-gradient-to-br from-black to-blue-950/50">
                                        <Layout className="w-12 h-12 opacity-30" />
                                    </div>
                                )}
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                                <div className="absolute top-3 right-3">
                                    <Badge color="bg-black/60 text-neon-blue border border-neon-blue/50 backdrop-blur-md shadow-[0_0_10px_rgba(0,243,255,0.3)]">{p.mode}</Badge>
                                </div>
                            </div>
                            <div className="p-6 relative z-10 bg-black/20 backdrop-blur-sm">
                                <h3 className="font-bold font-cyber text-xl text-white mb-2 group-hover:text-neon-blue transition-colors line-clamp-1 tracking-wide">{p.title}</h3>
                                <p className="text-sm text-white/60 line-clamp-2 mb-4 h-10 font-light">{p.refinedPrompt}</p>
                                
                                <div className="flex justify-between items-center text-xs text-white/40 border-t border-white/10 pt-4 font-mono">
                                    <div className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(p.updatedAt).toLocaleDateString()}
                                    </div>
                                    <div className="bg-white/5 px-2 py-1 rounded">
                                        {p.scenes.length} SEGS
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        )}
    </div>
  );
};
