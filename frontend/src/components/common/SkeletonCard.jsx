import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden glass-aetheria border border-aetheria-border animate-pulse flex flex-col h-[450px]">
      <div className="w-full h-64 bg-slate-800/40 relative">
        <div className="absolute top-4 left-4 w-24 h-6 rounded-full bg-slate-700/50" />
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-700/50" />
        <div className="absolute bottom-4 left-4 space-y-2">
          <div className="w-16 h-3 rounded bg-slate-700/40" />
          <div className="w-36 h-6 rounded-lg bg-slate-700/60" />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="w-full h-4 bg-slate-800/60 rounded-md" />
          <div className="w-3/4 h-4 bg-slate-800/50 rounded-md" />
          <div className="flex gap-2 pt-2">
            <div className="w-16 h-5 bg-slate-800/70 rounded-md" />
            <div className="w-20 h-5 bg-slate-800/70 rounded-md" />
          </div>
        </div>
        <div className="pt-4 border-t border-aetheria-border flex items-center justify-between">
          <div className="w-24 h-4 bg-slate-700/50 rounded-md" />
          <div className="w-24 h-4 bg-slate-700/50 rounded-md" />
        </div>
      </div>
    </div>
  );
}
