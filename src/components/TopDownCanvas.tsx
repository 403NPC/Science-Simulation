/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useCallback } from 'react';
import { WavePulse, SimulationConfig, Observer } from '../types/simulation';
import { THEMES } from '../utils/theme';

interface TopDownCanvasProps {
  pulses: WavePulse[];
  sourcePos: { x: number; y: number; vx: number; vy: number };
  config: SimulationConfig;
  observers: Observer[];
  onCanvasClick: (x: number, y: number) => void;
  onManualSourceMove?: (x: number, y: number) => void;
  onDimensionsChange?: (width: number, height: number) => void;
  currentTime: number;
}

export const TopDownCanvas: React.FC<TopDownCanvasProps> = ({
  pulses,
  sourcePos,
  config,
  observers,
  onCanvasClick,
  onManualSourceMove,
  onDimensionsChange,
  currentTime,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isMouseDownRef = useRef(false);

  // Convert client click to canvas coordinates
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);
    isMouseDownRef.current = true;
    onCanvasClick(x, y);

    if (config.mode === 'manual' && onManualSourceMove) {
      onManualSourceMove(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDownRef.current) return;
    const { x, y } = getCanvasCoords(e);

    if (config.mode === 'manual') {
      if (onManualSourceMove) {
        onManualSourceMove(x, y);
      }
    }
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
    onCanvasClick(x, y);
    if (config.mode === 'manual' && onManualSourceMove) {
      onManualSourceMove(x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((touch.clientY - rect.top) / rect.height) * canvas.height;
    if (config.mode === 'manual' && onManualSourceMove) {
      onManualSourceMove(x, y);
    }
  };

  // Main Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const theme = THEMES[config.theme] || THEMES.deepBlue;

    // 1. Clear background
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw subtle coordinate grid / distance scales
    ctx.strokeStyle = theme.gridLine;
    ctx.lineWidth = 1;
    const gridSize = 40;
    ctx.beginPath();
    for (let x = 0; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 3. Draw Water Waves (Wavefronts - 파면)
    // Request: 파면을 나타내는 선이 파원으로부터 퍼져나갈수록 흐려지지 않고 일정한 진하기로 표현
    const maxRadius = Math.sqrt(width * width + height * height);

    if (config.showWavefrontCircles) {
      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        const age = currentTime - pulse.emitTime;
        if (age < 0) continue;

        const r = config.waveSpeed * age;
        if (r > maxRadius) continue; // Only cull once outside visible screen

        ctx.save();

        // Constant, crisp opacity and thickness (흐려지지 않고 일정한 진하기 유지)
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, Math.max(1, r), 0, Math.PI * 2);

        // Constant crisp stroke without distance decay
        ctx.strokeStyle = theme.waveCrest;
        ctx.lineWidth = 2.4;
        ctx.globalAlpha = 0.92; // Constant vivid opacity

        if (config.showHeightmapShading) {
          // Add a subtle crisp double-line/glow effect without reducing opacity
          ctx.shadowColor = theme.waveCrest;
          ctx.shadowBlur = 4;
        }

        ctx.stroke();
        ctx.restore();
      }
    }

    // 4. Draw Mach Cone envelope if Mach > 1 (Supersonic)
    const mach = config.sourceSpeed / Math.max(1, config.waveSpeed);
    if (config.mode === 'auto' && mach > 1.01) {
      const sinMu = 1 / mach;
      const mu = Math.asin(sinMu);
      const coneLength = width * 1.5;

      ctx.save();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([8, 4]);

      const angle = Math.atan2(sourcePos.vy, sourcePos.vx);

      // Upper cone ray
      const upperAngle = angle + Math.PI - mu;
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(
        sourcePos.x + Math.cos(upperAngle) * coneLength,
        sourcePos.y + Math.sin(upperAngle) * coneLength
      );
      ctx.stroke();

      // Lower cone ray
      const lowerAngle = angle + Math.PI + mu;
      ctx.beginPath();
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(
        sourcePos.x + Math.cos(lowerAngle) * coneLength,
        sourcePos.y + Math.sin(lowerAngle) * coneLength
      );
      ctx.stroke();

      // Label Mach cone
      const labelX = sourcePos.x - 70;
      const labelY = sourcePos.y - 45;
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(`마하 충격파 원뿔 (Mach Cone: ${(mu * (180 / Math.PI)).toFixed(1)}°)`, labelX, labelY);

      ctx.restore();
    }

    // 5. Draw Source Path Trail (in auto mode)
    if (config.mode === 'auto' && config.showSourcePath) {
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, sourcePos.y);
      ctx.lineTo(width, sourcePos.y);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Draw Observers
    if (config.showObservers) {
      observers.forEach((obs) => {
        const obsX = obs.x * width;
        const obsY = obs.y * height;

        ctx.save();
        // Outer ring
        ctx.beginPath();
        ctx.arc(obsX, obsY, 13, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = obs.color;
        ctx.stroke();

        // Center dot
        ctx.beginPath();
        ctx.arc(obsX, obsY, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = obs.color;
        ctx.fill();

        // Observer Badge & Name
        ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = obs.color;
        ctx.fillText(obs.name, obsX - 20, obsY - 18);

        // Measured wave counts
        ctx.font = '10px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`감지: ${obs.detectedCrests}회`, obsX - 22, obsY + 26);

        ctx.restore();
      });
    }

    // 7. Draw Wave Source (파원)
    ctx.save();
    const sx = sourcePos.x;
    const sy = sourcePos.y;

    // Outer glow
    const glowGrad = ctx.createRadialGradient(sx, sy, 2, sx, sy, 24);
    glowGrad.addColorStop(0, theme.sourceGlow);
    glowGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(sx, sy, 24, 0, Math.PI * 2);
    ctx.fill();

    // Source main body
    ctx.beginPath();
    ctx.arc(sx, sy, 8.5, 0, Math.PI * 2);
    ctx.fillStyle = theme.sourceColor;
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Velocity arrow if moving
    if (config.mode === 'auto' && config.sourceSpeed > 5) {
      const arrowLength = Math.min(60, (config.sourceSpeed / config.waveSpeed) * 40 + 15);
      const angle = Math.atan2(sourcePos.vy, sourcePos.vx);
      const endX = sx + Math.cos(angle) * arrowLength;
      const endY = sy + Math.sin(angle) * arrowLength;

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Arrowhead
      const headLen = 9;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle - Math.PI / 6),
        endY - headLen * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(
        endX - headLen * Math.cos(angle + Math.PI / 6),
        endY - headLen * Math.sin(angle + Math.PI / 6)
      );
      ctx.closePath();
      ctx.fill();

      // Label
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`vs=${Math.round(config.sourceSpeed)}px/s`, sx - 24, sy - 16);
    } else {
      // Manual mode helper label
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(config.mode === 'manual' ? '파원 (클릭 위치)' : '파원 (정지)', sx - 35, sy - 16);
    }

    ctx.restore();
  }, [pulses, sourcePos, config, observers, currentTime]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const targetWidth = Math.floor(rect.width);
      const targetHeight = Math.floor(rect.height);

      if (targetWidth > 0 && targetHeight > 0) {
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          onDimensionsChange?.(targetWidth, targetHeight);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onDimensionsChange]);

  // Trigger render on props update
  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Top Left Canvas Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-700/60 rounded-md px-3 py-1.5 text-xs pointer-events-none shadow-md">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-semibold text-slate-100">물결파 평면도 (Top-Down View)</span>
        <span className="text-slate-400">·</span>
        <span className="text-cyan-300">
          {config.mode === 'manual' ? '클릭 시 해당 지점에서 파동 발생' : '파원 자동 등속 이동'}
        </span>
      </div>

      {/* Wavefront constant intensity indicator */}
      <div className="absolute top-3 right-3 hidden sm:flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-md px-2.5 py-1 text-[11px] text-slate-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-sky-400" />
        <span>파면 선: 일정한 진하기 유지 (감쇠 없음)</span>
      </div>

      {/* Click Hint for Manual Mode */}
      {config.mode === 'manual' && pulses.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-900/95 border border-cyan-500/50 rounded-xl px-6 py-4 text-center shadow-2xl backdrop-blur-md animate-bounce">
            <p className="text-sm font-semibold text-cyan-200">화면의 아무 곳이나 클릭해 보세요!</p>
            <p className="text-xs text-slate-300 mt-1">
              마우스를 클릭할 때마다 일정한 진하기의 물결파가 실시간으로 퍼져나갑니다
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
