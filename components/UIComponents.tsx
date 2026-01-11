
import React, { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export const Button: React.FC<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'magic' | 'danger', isLoading?: boolean }> = 
({ className = '', variant = 'primary', isLoading, children, ...props }) => {
  
  const baseStyle = "relative overflow-hidden inline-flex items-center justify-center rounded-xl font-cyber font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050014] disabled:opacity-50 disabled:pointer-events-none tracking-wide";
  
  const variants = {
    primary: "bg-gradient-to-r from-neon-blue to-blue-600 text-black hover:text-white hover:from-blue-600 hover:to-neon-blue shadow-neon-blue hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] py-3 px-6 text-lg border border-neon-blue/50",
    secondary: "bg-white/5 backdrop-blur-md text-neon-blue border border-neon-blue/30 hover:bg-neon-blue/10 hover:border-neon-blue hover:shadow-neon-blue py-3 px-6 text-lg",
    ghost: "text-white/70 hover:bg-white/10 hover:text-white py-2 px-4",
    magic: "bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:brightness-110 shadow-neon-pink hover:shadow-[0_0_25px_rgba(255,0,255,0.6)] active:scale-95 py-3 px-8 text-xl border border-white/20",
    danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] py-2 px-4"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] opacity-0 hover:opacity-100 transition-opacity pointer-events-none animate-shimmer"></div>
      
      {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin text-current" />}
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode, className?: string, noPadding?: boolean }> = ({ children, className = '', noPadding = false }) => (
  <div className={`glass-panel rounded-2xl relative overflow-hidden group ${noPadding ? '' : ''} ${className}`}>
    {/* Holographic Border Effect */}
    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none"></div>
    <div className="absolute -inset-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 blur transition-opacity duration-500 pointer-events-none"></div>
    {children}
  </div>
);

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full rounded-xl glass-input px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all ${className}`}
    {...props}
  />
);

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-white/10 text-white border border-white/20' }) => (
  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-cyber tracking-wider uppercase backdrop-blur-sm ${color}`}>
    {children}
  </span>
);
