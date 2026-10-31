/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { TopDownCanvas } from './components/TopDownCanvas';
import { ControlPanel } from './components/ControlPanel';
import { DopplerTheoryModal } from './components/DopplerTheoryModal';
import {
  WavePulse,
  SimulationConfig,
  Observer,
  DopplerCalculation,
} from './types/simulation';
import { calculateDopplerMetrics } from './utils/physics';
import { audioManager } from './utils/audio';

const INITIAL_CONFIG: SimulationConfig = {
  mode: 'manual', // Default: manual mode as requested
  motionPattern: 'linear',
  isPlaying: true,
  timeScale: 1.0,

  waveSpeed: 160, // px/s
  sourceSpeed: 90, // px/s
  emitFrequency: 1.4, // Hz
  waveDamping: 0, // Zero damping so lines stay constant
  initialAmplitude: 24,

  showWavefrontCircles: true,
  showHeightmapShading: false,
  showSliceLine: false,
  showObservers: true,
  showWavelengthMetrics: true,
  showSourcePath: true,
  theme: 'deepBlue',

  soundEnabled: false,
  volume: 0.3,
  sliceYRatio: 0.5,
};

export default function App() {
  const [config, setConfig] = useState<SimulationConfig>(INITIAL_CONFIG);
  const [pulses, setPulses] = useState<WavePulse[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Simulation time in seconds
  const simTimeRef = useRef<number>(0);
  const [currentTimeState, setCurrentTimeState] = useState<number>(0);

  // Real canvas dimensions
  const canvasSizeRef = useRef({ width: 1000, height: 700 });

  // Source state
  const sourceRef = useRef({
    x: 250,
    y: 350,
    vx: 90,
    vy: 0,
  });

  const lastEmitTimeRef = useRef<number>(0);
  const pulseIdCounterRef = useRef<number>(1);
  const lastFrameTimeRef = useRef<number | null>(null);

  // Observers (Left and Right)
  const [observers, setObservers] = useState<Observer[]>([
    {
      id: 'obs-left',
      name: '관측자 A (좌측)',
      x: 0.12,
      y: 0.5,
      color: '#ec4899',
      detectedCrests: 0,
      lastDetectionTime: -999,
      measuredFrequency: 0,
    },
    {
      id: 'obs-right',
      name: '관측자 B (우측)',
      x: 0.88,
      y: 0.5,
      color: '#10b981',
      detectedCrests: 0,
      lastDetectionTime: -999,
      measuredFrequency: 0,
    },
  ]);

  // Doppler metrics calculation
  const metrics: DopplerCalculation = useMemo(() => {
    return calculateDopplerMetrics(
      config.waveSpeed,
      config.sourceSpeed,
      config.emitFrequency
    );
  }, [config.waveSpeed, config.sourceSpeed, config.emitFrequency]);

  // Audio update
  useEffect(() => {
    if (config.soundEnabled) {
      if (config.mode === 'auto' && config.isPlaying) {
        audioManager.startContinuousTone(320, config.volume);
      } else {
        audioManager.stopContinuousTone();
      }
    } else {
      audioManager.stopContinuousTone();
    }
  }, [config.soundEnabled, config.mode, config.isPlaying, config.volume]);

  // Update pitch based on relative observer distance in auto mode
  useEffect(() => {
    if (config.soundEnabled && config.mode === 'auto' && config.isPlaying) {
      const mach = config.sourceSpeed / Math.max(1, config.waveSpeed);
      const freqRatio = sourceRef.current.vx >= 0 ? 1 / Math.max(0.2, 1 - mach * 0.7) : 1 / (1 + mach * 0.7);
      audioManager.updateDopplerPitch(freqRatio, config.volume);
    }
  }, [config.soundEnabled, config.mode, config.isPlaying, config.sourceSpeed, config.waveSpeed, config.volume]);

  // Reset simulation
  const handleReset = useCallback(() => {
    setPulses([]);
    simTimeRef.current = 0;
    lastEmitTimeRef.current = 0;
    setCurrentTimeState(0);
    setObservers((prev) =>
      prev.map((o) => ({
        ...o,
        detectedCrests: 0,
        lastDetectionTime: -999,
        measuredFrequency: 0,
      }))
    );
  }, []);

  // Handle dimensions change from TopDownCanvas
  const handleDimensionsChange = useCallback((w: number, h: number) => {
    canvasSizeRef.current = { width: w, height: h };
    if (config.mode === 'auto') {
      sourceRef.current.y = h * 0.5;
    }
  }, [config.mode]);

  // Handle manual click to emit ripple
  const handleCanvasClick = useCallback(
    (x: number, y: number) => {
      sourceRef.current.x = x;
      sourceRef.current.y = y;

      const newPulse: WavePulse = {
        id: pulseIdCounterRef.current++,
        x,
        y,
        emitTime: simTimeRef.current,
        initialAmplitude: config.initialAmplitude,
        frequency: config.emitFrequency,
        sourceVelocityX: sourceRef.current.vx,
      };

      setPulses((prev) => [...prev.slice(-150), newPulse]);

      if (config.soundEnabled) {
        audioManager.playRippleSound(config.volume);
      }
    },
    [config.initialAmplitude, config.emitFrequency, config.soundEnabled, config.volume]
  );

  // Manual source movement (drag or move)
  const handleManualSourceMove = useCallback((x: number, y: number) => {
    sourceRef.current.x = x;
    sourceRef.current.y = y;
  }, []);

  // Emit pulse programmatically
  const handleEmitPulseManual = useCallback(() => {
    handleCanvasClick(sourceRef.current.x, sourceRef.current.y);
  }, [handleCanvasClick]);

  // Update Config Helper
  const handleChangeConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    setConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      if (newConfig.sourceSpeed !== undefined || newConfig.waveSpeed !== undefined) {
        const sign = sourceRef.current.vx >= 0 ? 1 : -1;
        sourceRef.current.vx = sign * (newConfig.sourceSpeed ?? updated.sourceSpeed);
      }
      return updated;
    });
  }, []);

  // Main Physics & Animation Loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = now;
      }
      const rawDt = Math.min(0.06, (now - lastFrameTimeRef.current) / 1000);
      lastFrameTimeRef.current = now;

      if (config.isPlaying) {
        const dt = rawDt * config.timeScale;
        simTimeRef.current += dt;
        const simTime = simTimeRef.current;
        setCurrentTimeState(simTime);

        const currentW = canvasSizeRef.current.width;
        const currentH = canvasSizeRef.current.height;
        const maxDiagonal = Math.sqrt(currentW * currentW + currentH * currentH);
        const maxAge = maxDiagonal / Math.max(1, config.waveSpeed) + 1.0;

        // Update Source Position in Auto Mode
        if (config.mode === 'auto') {
          sourceRef.current.y = currentH * 0.5;

          if (config.motionPattern === 'bounce') {
            sourceRef.current.x += sourceRef.current.vx * dt;
            const margin = 70;
            if (sourceRef.current.x > currentW - margin && sourceRef.current.vx > 0) {
              sourceRef.current.vx = -config.sourceSpeed;
            } else if (sourceRef.current.x < margin && sourceRef.current.vx < 0) {
              sourceRef.current.vx = config.sourceSpeed;
            }
          } else {
            // Linear loop
            sourceRef.current.vx = config.sourceSpeed;
            sourceRef.current.x += sourceRef.current.vx * dt;
            if (sourceRef.current.x > currentW + 60) {
              sourceRef.current.x = -40;
            }
          }

          // Auto-emit pulses at fixed period T = 1 / f
          const period = 1 / Math.max(0.1, config.emitFrequency);
          if (simTime - lastEmitTimeRef.current >= period) {
            lastEmitTimeRef.current = simTime;

            const newPulse: WavePulse = {
              id: pulseIdCounterRef.current++,
              x: sourceRef.current.x,
              y: sourceRef.current.y,
              emitTime: simTime,
              initialAmplitude: config.initialAmplitude,
              frequency: config.emitFrequency,
              sourceVelocityX: sourceRef.current.vx,
            };

            setPulses((prev) => {
              // Retain active pulses until they actually exit the screen
              const filtered = prev.filter((p) => simTime - p.emitTime <= maxAge);
              return [...filtered, newPulse];
            });
          }
        }

        // Clean up old pulses in manual mode once they leave the screen
        if (config.mode === 'manual') {
          setPulses((prev) => {
            if (prev.length > 20) {
              return prev.filter((p) => simTime - p.emitTime <= maxAge);
            }
            return prev;
          });
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animId);
      lastFrameTimeRef.current = null;
    };
  }, [
    config.isPlaying,
    config.timeScale,
    config.mode,
    config.motionPattern,
    config.sourceSpeed,
    config.waveSpeed,
    config.emitFrequency,
    config.initialAmplitude,
  ]);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Top Navigation Bar */}
      <Header
        config={config}
        onChangeConfig={handleChangeConfig}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* 2. Main Content Split: Full Top-Down Wave Canvas on left, Control Panel on right */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Main Wavefront Top-Down View Canvas (Full Canvas Area) */}
        <div className="flex-1 h-full relative overflow-hidden bg-slate-950">
          <TopDownCanvas
            pulses={pulses}
            sourcePos={sourceRef.current}
            config={config}
            observers={observers}
            onCanvasClick={handleCanvasClick}
            onManualSourceMove={handleManualSourceMove}
            onDimensionsChange={handleDimensionsChange}
            currentTime={currentTimeState}
          />
        </div>

        {/* Right Side Control & Analysis Panel */}
        <ControlPanel
          config={config}
          onChangeConfig={handleChangeConfig}
          metrics={metrics}
          onReset={handleReset}
          onEmitPulseManual={handleEmitPulseManual}
          onOpenHelp={() => setIsHelpOpen(true)}
        />
      </div>

      {/* 3. Educational Doppler Theory Modal */}
      <DopplerTheoryModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
