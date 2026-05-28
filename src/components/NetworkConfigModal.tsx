import React, { useState } from 'react';
import { useNetworkForm } from '../useNetworkForm';
import { GlobalInfoArea } from './GlobalInfoArea';
import { TaskListArea } from './TaskListArea';
import { Button, IconButton } from './UI';
import { X, Save, RotateCcw } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const NetworkConfigModal: React.FC<Props> = ({ onClose }) => {
  const { globalInfo, tasks, errors, updateGlobal, updateTask, addTaskSibling, addTaskChild, removeTask, resetForm, validate } = useNetworkForm();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsAnimating(true);
      setIsExpanded(false);
    } else {
      setIsAnimating(true);
      setIsExpanded(true);
    }
  };

  const handleSave = () => {
    if (validate(globalInfo, tasks, true)) {
      alert('保存成功！');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-[1100px] h-[660px] rounded-xl shadow-md border border-[#e5e6eb] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-4 px-6">
          <div className="flex items-center gap-2">
            <h2 className="text-[16px] leading-[24px] font-bold tracking-tight text-[#1d2129]">网络图信息修改</h2>
          </div>
          <IconButton onClick={onClose}><X className="w-5 h-5 text-[#666666]" /></IconButton>
        </div>

        <div className={`flex-1 flex flex-col px-6 pb-2 overflow-hidden bg-white ${isExpanded ? 'gap-2' : 'gap-4'}`}>
          
          <section className="shrink-0 flex flex-col">
            <h3 className={`text-[14px] leading-[22px] font-bold text-[#1d2129] tracking-wide transition-all duration-300 ${isExpanded ? 'mb-0' : 'mb-2'}`}>全局设定</h3>
            <div 
              className={`transition-all duration-300 ease-in-out origin-top ${isExpanded ? 'max-h-0 opacity-0 mb-0 overflow-hidden' : `max-h-[200px] opacity-100 mb-2 ${isAnimating ? 'overflow-hidden' : 'overflow-visible'}`}`}
              onTransitionEnd={() => setIsAnimating(false)}
            >
              <GlobalInfoArea globalInfo={globalInfo} errors={errors.global} onChange={updateGlobal} onBlur={() => validate()} layout="horizontal" />
            </div>
          </section>

          <section className="flex-1 flex flex-col gap-2 min-h-0">
            <h3 className="text-[14px] leading-[22px] font-bold text-[#1d2129] tracking-wide flex justify-between items-center">
              <span>任务数据编排列表</span>
              <span className="text-[12px] font-normal leading-[18px] text-[#666666] bg-slate-100 px-2 py-0.5 rounded mb-1">共 {tasks.length} 条任务</span>
            </h3>
            <div className="flex-1 overflow-hidden">
               <TaskListArea 
                 tasks={tasks} errors={errors.tasks} 
                 onUpdate={updateTask} onAddSibling={addTaskSibling} onAddChild={addTaskChild} onRemove={removeTask} 
                 isExpanded={isExpanded} onToggleExpand={handleToggleExpand}
                 onBlur={() => validate()}
               />
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between px-6 h-[80px] border-t border-[#e5e6eb] bg-white shrink-0">
          <Button variant="ghost" onClick={resetForm} className="text-[#666666] hover:text-[#333333] text-[14px] leading-[22px] p-0 font-normal">
            <RotateCcw className="w-4 h-4 mr-1" />
            重置初始数据
          </Button>
          <div className="flex gap-2 items-center">
            <Button onClick={onClose} variant="outline-primary" className="w-[64px] h-[32px] text-[14px] leading-[22px] font-normal p-0">取消</Button>
            <Button onClick={handleSave} variant="primary" className="w-[88px] h-[32px] text-[14px] leading-[22px] font-normal p-0">
              确认修改
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
