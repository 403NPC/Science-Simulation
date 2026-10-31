/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WaterTheme } from '../types/simulation';

export interface ThemeColors {
  bg: string;
  bgRgba: string;
  gridLine: string;
  waveCrest: string;
  waveTrough: string;
  waveGradientInner: string;
  waveGradientOuter: string;
  sourceColor: string;
  sourceGlow: string;
  sliceLine: string;
  observerA: string;
  observerB: string;
  subWaterTop: string;
  subWaterBottom: string;
  subSurfaceLine: string;
  subEquilibrium: string;
}

export const THEMES: Record<WaterTheme, ThemeColors> = {
  deepBlue: {
    bg: '#081226',
    bgRgba: 'rgba(8, 18, 38, 0.95)',
    gridLine: 'rgba(56, 189, 248, 0.08)',
    waveCrest: '#38bdf8',
    waveTrough: '#0369a1',
    waveGradientInner: 'rgba(56, 189, 248, 0.45)',
    waveGradientOuter: 'rgba(14, 165, 233, 0.0)',
    sourceColor: '#f59e0b',
    sourceGlow: 'rgba(245, 158, 11, 0.5)',
    sliceLine: 'rgba(234, 179, 8, 0.7)',
    observerA: '#ec4899', // Pink
    observerB: '#10b981', // Emerald
    subWaterTop: 'rgba(14, 165, 233, 0.65)',
    subWaterBottom: 'rgba(3, 105, 161, 0.9)',
    subSurfaceLine: '#7dd3fc',
    subEquilibrium: 'rgba(148, 163, 184, 0.4)',
  },
  cyanOcean: {
    bg: '#042129',
    bgRgba: 'rgba(4, 33, 41, 0.95)',
    gridLine: 'rgba(45, 212, 191, 0.08)',
    waveCrest: '#2dd4bf',
    waveTrough: '#0f766e',
    waveGradientInner: 'rgba(45, 212, 191, 0.5)',
    waveGradientOuter: 'rgba(20, 184, 166, 0.0)',
    sourceColor: '#fb923c',
    sourceGlow: 'rgba(251, 146, 60, 0.6)',
    sliceLine: 'rgba(244, 63, 94, 0.7)',
    observerA: '#a855f7', // Violet
    observerB: '#06b6d4', // Cyan
    subWaterTop: 'rgba(45, 212, 191, 0.6)',
    subWaterBottom: 'rgba(17, 94, 89, 0.95)',
    subSurfaceLine: '#5eead4',
    subEquilibrium: 'rgba(153, 246, 228, 0.3)',
  },
  neonLab: {
    bg: '#090d16',
    bgRgba: 'rgba(9, 13, 22, 0.95)',
    gridLine: 'rgba(99, 102, 241, 0.12)',
    waveCrest: '#06b6d4',
    waveTrough: '#4f46e5',
    waveGradientInner: 'rgba(6, 182, 212, 0.6)',
    waveGradientOuter: 'rgba(99, 102, 241, 0.0)',
    sourceColor: '#e11d48',
    sourceGlow: 'rgba(225, 29, 72, 0.7)',
    sliceLine: 'rgba(234, 179, 8, 0.8)',
    observerA: '#d946ef', // Fuchsia
    observerB: '#22c55e', // Green
    subWaterTop: 'rgba(99, 102, 241, 0.5)',
    subWaterBottom: 'rgba(30, 27, 75, 0.95)',
    subSurfaceLine: '#818cf8',
    subEquilibrium: 'rgba(129, 140, 248, 0.4)',
  },
  cleanMono: {
    bg: '#0f172a',
    bgRgba: 'rgba(15, 23, 42, 0.95)',
    gridLine: 'rgba(255, 255, 255, 0.06)',
    waveCrest: '#f1f5f9',
    waveTrough: '#475569',
    waveGradientInner: 'rgba(241, 245, 249, 0.4)',
    waveGradientOuter: 'rgba(148, 163, 184, 0.0)',
    sourceColor: '#38bdf8',
    sourceGlow: 'rgba(56, 189, 248, 0.6)',
    sliceLine: 'rgba(250, 204, 21, 0.7)',
    observerA: '#f43f5e',
    observerB: '#10b981',
    subWaterTop: 'rgba(148, 163, 184, 0.5)',
    subWaterBottom: 'rgba(30, 41, 59, 0.95)',
    subSurfaceLine: '#e2e8f0',
    subEquilibrium: 'rgba(255, 255, 255, 0.25)',
  },
};
