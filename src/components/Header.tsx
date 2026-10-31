/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Waves, Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';
import { SimulationConfig } from '../types/simulation';

interface HeaderProps {
  config: SimulationConfig;
  onChangeConfig: (newConfig: Partial<SimulationConfig>) => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ config, onChangeConfig, onOpenHelp }) => {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Waves className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">
              도플러 효과 물결파 시뮬레이터
            </h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium bg-slate-800 text-cyan-300 rounded border border-slate-700">
              {config.mode === 'manual' ? '수동 클릭 모드' : '자동 등속 이동 모드'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden md:block">
            마우스 클릭 수동 생성 및 등속 이동 파원의 실시간 물결파 파면 시뮬레이션
          </p>
        </div>
      </div>

      {/* Right Action Bar */}
      <div className="flex items-center gap-2">
        {/* Mode Switch Pills */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-xs">
          <button
            onClick={() => onChangeConfig({ mode: 'manual' })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              config.mode === 'manual'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            수동 (클릭)
          </button>
          <button
            onClick={() => onChangeConfig({ mode: 'auto' })}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              config.mode === 'auto'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            자동 (이동)
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => onChangeConfig({ soundEnabled: !config.soundEnabled })}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
            config.soundEnabled
              ? 'bg-cyan-950/60 text-cyan-300 border-cyan-700'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
          title="도플러 효과 음향 켜기/끄기"
        >
          {config.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{config.soundEnabled ? '소리 ON' : '소리 OFF'}</span>
        </button>

        {/* Help / Guide */}
        <button
          onClick={onOpenHelp}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>도플러 원리</span>
        </button>
      </div>
    </header>
  );
};
