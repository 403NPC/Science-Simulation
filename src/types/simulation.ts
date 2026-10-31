/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SimulationMode = 'manual' | 'auto';

export type MotionPattern = 'linear' | 'bounce' | 'circular';

export type WaterTheme = 'deepBlue' | 'cyanOcean' | 'neonLab' | 'cleanMono';

export interface WavePulse {
  id: number;
  x: number;
  y: number;
  emitTime: number; // in seconds
  initialAmplitude: number;
  frequency: number;
  sourceVelocityX?: number;
}

export interface Observer {
  id: string;
  name: string;
  x: number; // in canvas coordinate or relative [0, 1]
  y: number;
  color: string;
  detectedCrests: number;
  lastDetectionTime: number;
  measuredFrequency: number;
}

export interface SimulationConfig {
  mode: SimulationMode;
  motionPattern: MotionPattern;
  isPlaying: boolean;
  timeScale: number; // 0.25x, 0.5x, 1x, 2x
  
  // Wave physics
  waveSpeed: number; // px/s (e.g., 160)
  sourceSpeed: number; // px/s (e.g., 80)
  emitFrequency: number; // Hz (e.g., 1.5)
  waveDamping: number; // damping coefficient
  initialAmplitude: number; // amplitude in px
  
  // Display settings
  showWavefrontCircles: boolean;
  showHeightmapShading: boolean;
  showSliceLine: boolean;
  showObservers: boolean;
  showWavelengthMetrics: boolean;
  showSourcePath: boolean;
  theme: WaterTheme;
  
  // Audio
  soundEnabled: boolean;
  volume: number; // 0 to 1
  
  // Cross section cut line y position (ratio 0..1)
  sliceYRatio: number;
}

export interface DopplerCalculation {
  waveSpeed: number;
  sourceSpeed: number;
  baseFrequency: number;
  baseWavelength: number;
  machNumber: number;
  approachingFrequency: number;
  recedingFrequency: number;
  approachingWavelength: number;
  recedingWavelength: number;
  machAngleDeg: number | null; // null if Mach < 1
}
