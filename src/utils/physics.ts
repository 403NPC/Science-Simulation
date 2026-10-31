/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DopplerCalculation } from '../types/simulation';

export function calculateDopplerMetrics(
  waveSpeed: number,
  sourceSpeed: number,
  frequency: number
): DopplerCalculation {
  const baseWavelength = waveSpeed / Math.max(0.001, frequency);
  const machNumber = sourceSpeed / Math.max(0.001, waveSpeed);

  let approachingFrequency = frequency;
  let recedingFrequency = frequency;
  let approachingWavelength = baseWavelength;
  let recedingWavelength = baseWavelength;
  let machAngleDeg: number | null = null;

  if (machNumber < 0.999) {
    approachingFrequency = frequency * (waveSpeed / (waveSpeed - sourceSpeed));
    recedingFrequency = frequency * (waveSpeed / (waveSpeed + sourceSpeed));
    approachingWavelength = (waveSpeed - sourceSpeed) / frequency;
    recedingWavelength = (waveSpeed + sourceSpeed) / frequency;
  } else if (machNumber <= 1.001) {
    approachingFrequency = Infinity;
    recedingFrequency = frequency * 0.5;
    approachingWavelength = 0;
    recedingWavelength = (waveSpeed + sourceSpeed) / frequency;
    machAngleDeg = 90;
  } else {
    // Supersonic Mach cone
    approachingFrequency = Infinity;
    recedingFrequency = frequency * (waveSpeed / (waveSpeed + sourceSpeed));
    approachingWavelength = Math.abs(waveSpeed - sourceSpeed) / frequency;
    recedingWavelength = (waveSpeed + sourceSpeed) / frequency;
    const sinAngle = 1 / machNumber;
    machAngleDeg = (Math.asin(sinAngle) * 180) / Math.PI;
  }

  return {
    waveSpeed,
    sourceSpeed,
    baseFrequency: frequency,
    baseWavelength,
    machNumber,
    approachingFrequency,
    recedingFrequency,
    approachingWavelength,
    recedingWavelength,
    machAngleDeg,
  };
}

export interface PresetConfig {
  name: string;
  subtitle: string;
  description: string;
  mach: number;
  sourceSpeedRatio: number; // vs / v
  mode: 'manual' | 'auto';
  pattern: 'linear' | 'bounce' | 'circular';
}

export const PRESETS: PresetConfig[] = [
  {
    name: '정지 파원',
    subtitle: 'M = 0.00',
    description: '파원이 정지해 있어 모든 방향으로 동심원 파면이 일정하게 퍼져나갑니다.',
    mach: 0,
    sourceSpeedRatio: 0,
    mode: 'auto',
    pattern: 'linear',
  },
  {
    name: '아음속 이동 (일반)',
    subtitle: 'M = 0.50',
    description: '전방에서는 파장이 압축되어 진동수가 높아지고, 후방에서는 파장이 늘어납니다.',
    mach: 0.5,
    sourceSpeedRatio: 0.5,
    mode: 'auto',
    pattern: 'linear',
  },
  {
    name: '고속 접근',
    subtitle: 'M = 0.85',
    description: '파원이 파동 속도에 근접하여 전방 파면들이 매우 조밀하게 밀집됩니다.',
    mach: 0.85,
    sourceSpeedRatio: 0.85,
    mode: 'auto',
    pattern: 'linear',
  },
  {
    name: '음속 / 충격 전선',
    subtitle: 'M = 1.00',
    description: '파원의 속도가 파동 전파 속도와 같아져 전방에 파면들이 겹치는 음벽(충격 전선)이 형성됩니다.',
    mach: 1.0,
    sourceSpeedRatio: 1.0,
    mode: 'auto',
    pattern: 'linear',
  },
  {
    name: '초음속 마하 원뿔',
    subtitle: 'M = 1.40',
    description: '파원이 파동보다 빠르게 이동하여 V자형(원뿔형) 충격파면(Mach Cone)이 발생합니다.',
    mach: 1.4,
    sourceSpeedRatio: 1.4,
    mode: 'auto',
    pattern: 'linear',
  },
  {
    name: '왕복 진동 파원',
    subtitle: '바운스 모드',
    description: '파원이 좌우로 왕복하면서 방향 전환에 따른 도플러 주파수 변화를 연속 관찰합니다.',
    mach: 0.55,
    sourceSpeedRatio: 0.55,
    mode: 'auto',
    pattern: 'bounce',
  },
];
