/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
  HelpCircle,
  Eye,
  Activity,
  Layers,
} from 'lucide-react';
import { SimulationConfig, DopplerCalculation, WaterTheme } from '../types/simulation';
import { PRESETS, PresetConfig } from '../utils/physics';

interface ControlPanelProps {
  config: SimulationConfig;
  onChangeConfig: (newConfig: Partial<SimulationConfig>) => void;
  metrics: DopplerCalculation;
  onReset: () => void;
  onEmitPulseManual: () => void;
  onOpenHelp: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChangeConfig,
  metrics,
  onReset,
  onEmitPulseManual,
  onOpenHelp,
}) => {
  const handlePresetSelect = (p: PresetConfig) => {
    onChangeConfig({
      mode: p.mode,
      motionPattern: p.pattern,
      sourceSpeed: config.waveSpeed * p.sourceSpeedRatio,
      isPlaying: true,
    });
  };

  return (
    <div className="w-full lg:w-96 flex flex-col gap-4 bg-slate-900 border-l border-slate-800 p-4 overflow-y-auto text-slate-200">
      {/* 1. Mode Switcher (수동 vs 자동) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>작동 모드 선택</span>
          <span className="text-[11px] font-normal text-cyan-400">
            {config.mode === 'manual' ? '클릭 수동 생성' : '파원 등속 자동 이동'}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/70 border border-slate-800 rounded-lg">
          <button
            onClick={() => onChangeConfig({ mode: 'manual' })}
            className={`py-2 px-3 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              config.mode === 'manual'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>👆 수동 클릭 모드</span>
          </button>
          <button
            onClick={() => onChangeConfig({ mode: 'auto' })}
            className={`py-2 px-3 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${
              config.mode === 'auto'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>🚀 자동 이동 모드</span>
          </button>
        </div>
      </div>

      {/* 2. Simulation Playback Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChangeConfig({ isPlaying: !config.isPlaying })}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            config.isPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
        >
          {config.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{config.isPlaying ? '일시 정지' : '시뮬레이션 재생'}</span>
        </button>

        <button
          onClick={onReset}
          title="파동 초기화"
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={() => onChangeConfig({ soundEnabled: !config.soundEnabled })}
          title="도플러 음향 효과"
          className={`p-2 rounded-lg transition-colors border ${
            config.soundEnabled
              ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
              : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
          }`}
        >
          {config.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenHelp}
          title="도플러 효과 원리 설명"
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Manual Mode Specific Quick Trigger */}
      {config.mode === 'manual' ? (
        <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-lg flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-200">수동 파동 발생기</span>
            <span className="text-[11px] text-cyan-400">화면 클릭 또는 버튼 누름</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            화면 상의 원하는 위치를 <strong>마우스로 클릭</strong>하면 그 지점을 중심으로 물결파가 퍼져나갑니다.
            마우스를 움직이면서 빠르게 클릭하면 내가 직접 파원을 움직이며 도플러 효과를 체감할 수 있습니다!
          </p>
          <button
            onClick={onEmitPulseManual}
            className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>💧 현재 위치에서 파동 발생 (클릭)</span>
          </button>
        </div>
      ) : (
        /* Auto Mode Pattern Select */
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium">자동 파원 운동 형태</label>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <button
              onClick={() => onChangeConfig({ motionPattern: 'linear' })}
              className={`py-1.5 px-2 rounded border text-[11px] transition-colors ${
                config.motionPattern === 'linear'
                  ? 'bg-amber-600/30 text-amber-200 border-amber-500/60'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              ➡️ 직선 이동 (루프)
            </button>
            <button
              onClick={() => onChangeConfig({ motionPattern: 'bounce' })}
              className={`py-1.5 px-2 rounded border text-[11px] transition-colors ${
                config.motionPattern === 'bounce'
                  ? 'bg-amber-600/30 text-amber-200 border-amber-500/60'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              ↔️ 좌우 왕복 바운스
            </button>
          </div>
        </div>
      )}

      {/* 3. Quick Presets (도플러 대표 상황 프리셋) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>도플러 현상 핵심 프리셋</span>
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((preset, idx) => {
            const isActive =
              config.mode === preset.mode &&
              Math.abs(config.sourceSpeed / config.waveSpeed - preset.sourceSpeedRatio) < 0.08;
            return (
              <button
                key={idx}
                onClick={() => handlePresetSelect(preset)}
                className={`p-2 rounded-lg text-left border transition-all ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/80 text-amber-200 shadow-sm'
                    : 'bg-slate-800/50 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-[11px] font-semibold flex items-center justify-between">
                  <span>{preset.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{preset.subtitle}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Physics Parameters Controls */}
      <div className="flex flex-col gap-3 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>물리 파라미터 조절</span>
        </label>

        {/* Source Speed vs */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">파원 이동 속도 ($v_s$)</span>
            <span className="font-mono text-amber-400 font-bold">
              {Math.round(config.sourceSpeed)} px/s
              <span className="ml-1 text-[11px] text-slate-400">
                (M = {metrics.machNumber.toFixed(2)})
              </span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.round(config.waveSpeed * 1.8)}
            step={2}
            value={config.sourceSpeed}
            onChange={(e) => onChangeConfig({ sourceSpeed: Number(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>정지 (0)</span>
            <span>음속 (M=1.0)</span>
            <span>초음속 (M&gt;1)</span>
          </div>
        </div>

        {/* Wave Propagation Speed v */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">파동 전파 속도 ($v$)</span>
            <span className="font-mono text-cyan-400 font-bold">{Math.round(config.waveSpeed)} px/s</span>
          </div>
          <input
            type="range"
            min={80}
            max={260}
            step={5}
            value={config.waveSpeed}
            onChange={(e) => onChangeConfig({ waveSpeed: Number(e.target.value) })}
            className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Emission Frequency f */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">파동 발생 진동수 ($f$)</span>
            <span className="font-mono text-slate-100 font-bold">
              {config.emitFrequency.toFixed(1)} Hz
              <span className="text-[10px] text-slate-400 ml-1">
                (주기 {(1 / config.emitFrequency).toFixed(2)}s)
              </span>
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={3.0}
            step={0.1}
            value={config.emitFrequency}
            onChange={(e) => onChangeConfig({ emitFrequency: Number(e.target.value) })}
            className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
          />
        </div>

        {/* Time Scale (Slow Motion) */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">시간 배속 (슬로우 모션)</span>
            <span className="font-mono text-slate-200">{config.timeScale}x</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
            {[0.25, 0.5, 1.0, 1.5].map((scale) => (
              <button
                key={scale}
                onClick={() => onChangeConfig({ timeScale: scale })}
                className={`py-1 rounded border transition-colors ${
                  config.timeScale === scale
                    ? 'bg-cyan-900/60 border-cyan-500 text-cyan-200'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {scale}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Real-time Doppler Formula Calculation Box */}
      <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            실시간 도플러 물리량 분석
          </span>
          <span
            className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
              metrics.machNumber >= 1
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}
          >
            {metrics.machNumber >= 1.01
              ? '초음속 충격파 (Supersonic)'
              : metrics.machNumber >= 0.99
              ? '음벽 (Sonic Barrier)'
              : '아음속 (Subsonic)'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Approaching (Front) */}
          <div className="p-2 bg-sky-950/30 border border-sky-900/50 rounded flex flex-col gap-1">
            <span className="text-[11px] font-bold text-sky-400">전방 관측 (접근 시)</span>
            <div className="text-[11px] flex justify-between text-slate-300">
              <span>관측 진동수 $f'$:</span>
              <span className="font-mono text-sky-300 font-bold">
                {Number.isFinite(metrics.approachingFrequency)
                  ? `${metrics.approachingFrequency.toFixed(1)} Hz`
                  : '∞ (중첩)'}
              </span>
            </div>
            <div className="text-[11px] flex justify-between text-slate-300">
              <span>관측 파장 $\lambda'$:</span>
              <span className="font-mono text-sky-300 font-bold">
                {Math.round(metrics.approachingWavelength)} px
              </span>
            </div>
            <span className="text-[10px] text-sky-300/80 mt-0.5">파장 압축 · 높은 음 (Blue-shift)</span>
          </div>

          {/* Receding (Back) */}
          <div className="p-2 bg-rose-950/30 border border-rose-900/50 rounded flex flex-col gap-1">
            <span className="text-[11px] font-bold text-rose-400">후방 관측 (후퇴 시)</span>
            <div className="text-[11px] flex justify-between text-slate-300">
              <span>관측 진동수 $f'$:</span>
              <span className="font-mono text-rose-300 font-bold">
                {metrics.recedingFrequency.toFixed(1)} Hz
              </span>
            </div>
            <div className="text-[11px] flex justify-between text-slate-300">
              <span>관측 파장 $\lambda'$:</span>
              <span className="font-mono text-rose-300 font-bold">
                {Math.round(metrics.recedingWavelength)} px
              </span>
            </div>
            <span className="text-[10px] text-rose-300/80 mt-0.5">파장 팽창 · 낮은 음 (Red-shift)</span>
          </div>
        </div>

        {/* Mach Angle readout if supersonic */}
        {metrics.machAngleDeg && (
          <div className="p-1.5 bg-rose-950/50 border border-rose-800 rounded text-[11px] text-rose-200 flex justify-between items-center">
            <span>마하각 $\mu = \arcsin(1/M)$:</span>
            <span className="font-mono font-bold text-rose-300">{metrics.machAngleDeg.toFixed(1)}°</span>
          </div>
        )}
      </div>

      {/* 6. Display Toggles & Water Themes */}
      <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-slate-400" />
          <span>시각화 표시 옵션</span>
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
            <input
              type="checkbox"
              checked={config.showWavefrontCircles}
              onChange={(e) => onChangeConfig({ showWavefrontCircles: e.target.checked })}
              className="rounded accent-cyan-500"
            />
            <span>파면 원형 링</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
            <input
              type="checkbox"
              checked={config.showHeightmapShading}
              onChange={(e) => onChangeConfig({ showHeightmapShading: e.target.checked })}
              className="rounded accent-cyan-500"
            />
            <span>물결 파고 음영</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
            <input
              type="checkbox"
              checked={config.showSourcePath}
              onChange={(e) => onChangeConfig({ showSourcePath: e.target.checked })}
              className="rounded accent-cyan-500"
            />
            <span>파원 이동 궤적선</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-slate-100">
            <input
              type="checkbox"
              checked={config.showObservers}
              onChange={(e) => onChangeConfig({ showObservers: e.target.checked })}
              className="rounded accent-cyan-500"
            />
            <span>관측자 위치 (A, B)</span>
          </label>
        </div>

        {/* Theme select */}
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            물결 테마
          </span>
          <select
            value={config.theme}
            onChange={(e) => onChangeConfig({ theme: e.target.value as WaterTheme })}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 text-xs"
          >
            <option value="deepBlue">딥 블루 심해 (기본)</option>
            <option value="cyanOcean">에메랄드 오션</option>
            <option value="neonLab">네온 물리 실험실</option>
            <option value="cleanMono">미니멀 모노크롬</option>
          </select>
        </div>
      </div>
    </div>
  );
};
