import React, { useState } from 'react';
import { NetworkConfigModal } from './components/NetworkConfigModal';
import { GanttConfigModal } from './components/GanttConfigModal';
import { Button } from './components/UI';

export default function App() {
  const [activeModal, setActiveModal] = useState<'network' | 'gantt' | null>('gantt');

  const closeModal = () => setActiveModal(null);

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1d2129] font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col items-center justify-center p-6">
      <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1d2129]">
            工程图表工作台
          </h1>
          <p className="text-sm text-[#666666] max-w-xl mx-auto tracking-wide leading-relaxed">
            修改网络图或横道图全局信息与任务节点
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => setActiveModal('network')} variant="primary" className="px-6 py-2 h-auto text-[14px] shadow-[rgba(45,127,249,0.28)_0px_1px_3px]">
            修改网络图信息
          </Button>
          <Button onClick={() => setActiveModal('gantt')} variant="primary" className="px-6 py-2 h-auto text-[14px] shadow-[rgba(45,127,249,0.28)_0px_1px_3px]">
            修改横道图信息
          </Button>
        </div>
      </div>

      {activeModal === 'network' && <NetworkConfigModal onClose={closeModal} />}
      {activeModal === 'gantt' && <GanttConfigModal onClose={closeModal} />}
    </div>
  );
}
