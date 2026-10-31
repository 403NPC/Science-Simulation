/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, BookOpen, AlertCircle, Waves, Volume2 } from 'lucide-react';

interface DopplerTheoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DopplerTheoryModal: React.FC<DopplerTheoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-base text-slate-100">도플러 효과(Doppler Effect) 원리 가이드</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 flex flex-col gap-5 text-sm leading-relaxed">
          {/* Section 1: Definition */}
          <div>
            <h3 className="text-cyan-300 font-semibold mb-1 flex items-center gap-1.5">
              <span>1. 도플러 효과란 무엇인가요?</span>
            </h3>
            <p className="text-slate-300">
              파동을 방출하는 <strong>파원(Source)</strong>과 이를 감지하는 <strong>관측자(Observer)</strong> 사이의
              상대적인 운동에 의해 관측자가 측정하는 <strong>파장($\lambda$)과 진동수($f$)가 달라지는 물리적 현상</strong>입니다.
            </p>
          </div>

          {/* Section 2: Formula */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col gap-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              핵심 물리 공식 (파원이 이동하고 관측자가 정지해 있을 때)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-sky-950/40 border border-sky-800/50 rounded-lg">
                <span className="font-bold text-sky-400 block mb-1">파원이 관측자에게 접근할 때:</span>
                <p className="font-mono text-sm text-sky-200 mb-1">
                  f′ = f₀ · [ v / (v − v_s) ]
                </p>
                <p className="font-mono text-slate-300">λ′ = λ₀ · (1 − v_s / v)</p>
                <p className="text-[11px] text-sky-300 mt-2">
                  👉 파장이 짧아지고(압축), 진동수가 높아져 <strong>높은 음</strong>으로 들립니다.
                </p>
              </div>

              <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-lg">
                <span className="font-bold text-rose-400 block mb-1">파원이 관측자로부터 멀어질 때:</span>
                <p className="font-mono text-sm text-rose-200 mb-1">
                  f′ = f₀ · [ v / (v + v_s) ]
                </p>
                <p className="font-mono text-slate-300">λ′ = λ₀ · (1 + v_s / v)</p>
                <p className="text-[11px] text-rose-300 mt-2">
                  👉 파장이 길어지고(팽창), 진동수가 낮아져 <strong>낮은 음</strong>으로 들립니다.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Screen Explanations */}
          <div>
            <h3 className="text-cyan-300 font-semibold mb-2">2. 본 시뮬레이션 화면 보는 법</h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/50">
                <strong className="text-cyan-300 block mb-1">물결파 평면도 (Top-Down Wavefront View)</strong>
                물결을 위에서 내려다본 전체 화면입니다. 원형으로 퍼져나가는 일정한 굵기와 진하기의 고리들은 파동의 마루(파면, Wavefront)를 나타냅니다.
                파원이 오른쪽으로 이동함에 따라 전방의 파면들은 좁은 간격으로 압축(파장 단축, 고진동수)되고,
                후방의 파면들은 넓은 간격으로 팽창(파장 증가, 저진동수)하는 도플러 기하학적 형태를 화면 끝까지 선명하게 관찰할 수 있습니다.
              </div>
            </div>
          </div>

          {/* Section 4: Mach numbers */}
          <div>
            <h3 className="text-amber-300 font-semibold mb-2 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>3. 음벽과 초음속 마하 원뿔 (Mach Cone)</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-2">
              파원의 속도 $v_s$가 파동의 전파 속도 $v$와 같아지거나($M=1$) 더 빨라지면($M &gt; 1$) 독특한 현상이 일어납니다:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
              <li>
                <strong className="text-slate-200">음속 장벽 ($M = 1$):</strong> 파면들이 파원 바로 앞에 겹쳐져 거대한 압력 장벽(충격 전선)을 형성합니다.
              </li>
              <li>
                <strong className="text-slate-200">초음속 마하 원뿔 ($M &gt; 1$):</strong> 파원이 파동보다 앞서 나가며 뒤쪽으로 V자형의 마하 원뿔(Mach Cone) 충격파면이 생성됩니다.
                충격파 원뿔의 반각 $\mu$는 $\sin \mu = 1 / M$을 만족합니다.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            확인 및 시뮬레이션 시작
          </button>
        </div>
      </div>
    </div>
  );
};
