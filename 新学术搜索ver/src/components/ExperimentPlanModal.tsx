import React, { useState } from 'react';
import { X, Coins, FileEdit } from 'lucide-react';

interface ExperimentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (plan: string) => void;
  initialPlan: string;
  title?: string;
  subtitle?: string;
}

export function ExperimentPlanModal({
  isOpen,
  onClose,
  onConfirm,
  initialPlan,
  title = '实验计划确认',
  subtitle = '自定义实验计划可能导致复现失败，请仔细审阅。',
}: ExperimentPlanModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState(initialPlan);
  const [isModified, setIsModified] = useState(false);
  const [estimatedCredits, setEstimatedCredits] = useState(10000);

  // Reset state when initialPlan changes
  React.useEffect(() => {
    setEditedPlan(initialPlan);
    setIsModified(false);
    setEstimatedCredits(10000);
    setIsEditing(false);
  }, [initialPlan]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg text-gray-900" style={{ fontWeight: 600 }}>{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Plan */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {isEditing ? (
              <textarea
                value={editedPlan}
                onChange={(e) => {
                  const newPlan = e.target.value;
                  setEditedPlan(newPlan);
                  setIsModified(newPlan !== initialPlan);
                  const baseCredits = 10000;
                  const extraCredits = Math.floor(newPlan.length / 100) * 500;
                  setEstimatedCredits(baseCredits + extraCredits);
                }}
                className="w-full min-h-[400px] px-4 py-3 text-sm text-gray-800 font-mono leading-relaxed border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-white"
                spellCheck={false}
              />
            ) : (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                {editedPlan}
              </pre>
            )}
          </div>
        </div>

        {/* Modal Footer - Credits & Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Coins className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-sm text-gray-900" style={{ fontWeight: 600 }}>预计消耗:</span>
                  <span className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{estimatedCredits.toLocaleString()}</span>
                  <span className="text-sm text-gray-600">Credits</span>
                  {isModified && (
                    <span className="text-xs text-orange-600" style={{ fontWeight: 500 }}>
                      (已修改 +{(estimatedCredits - 10000).toLocaleString()})
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">当前余额: 45,230 Credits</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditedPlan(initialPlan);
                    setIsModified(false);
                    setEstimatedCredits(10000);
                    setIsEditing(false);
                  }}
                  className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  取消编辑
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  保存修改
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-5 py-2.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  style={{ fontWeight: 500 }}
                >
                  <FileEdit className="w-4 h-4" />
                  修改配置
                </button>
                <button
                  onClick={() => onConfirm(editedPlan)}
                  className="px-6 py-2.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  style={{ fontWeight: 500 }}
                >
                  <Coins className="w-4 h-4" />
                  确认计划并开始运行
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
