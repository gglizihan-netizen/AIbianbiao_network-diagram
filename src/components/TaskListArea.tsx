import React, { useState } from 'react';
import { Task } from '../types';
import { Input, Select, IconButton, ConfirmModal } from './UI';
import { DatePicker } from './DatePicker';
import { Trash2, CornerDownRight, Plus, Maximize2, Minimize2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  errors: Record<string, Record<string, string>>;
  onUpdate: (id: string, key: keyof Task, value: string) => void;
  onAddSibling: (index: number, level: number) => void;
  onAddChild: (index: number, parentLevel: number) => void;
  onRemove: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const gridPattern = "grid-cols-[2fr_2fr_0.8fr_0.8fr_1.2fr_1.2fr_120px]";

export const TaskListArea: React.FC<TaskListProps> = ({
  tasks, errors, onUpdate, onAddSibling, onAddChild, onRemove, isExpanded, onToggleExpand
}) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteId) onRemove(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-[#f2f3f5] overflow-hidden shadow-sm">
      <div className={`relative grid ${gridPattern} gap-2 px-3 py-2 bg-[#F4F6F8] border-b border-[#f2f3f5] text-[14px] font-normal leading-[22px] text-[#666666]`}>
        <div>工作名称</div>
        <div>紧后工作</div>
        <div>工期 (天)</div>
        <div>自由时差</div>
        <div>计划开始</div>
        <div>计划结束</div>
        <div className="text-center">操作</div>
        {onToggleExpand && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <IconButton onClick={onToggleExpand} className="p-0.5 bg-white hover:bg-slate-100 rounded border border-[#e5e6eb] shadow-sm" title={isExpanded ? "收起全局设定" : "展开列表"}>
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5 text-[#666]" /> : <Maximize2 className="w-3.5 h-3.5 text-[#666]" />}
            </IconButton>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-0 relative text-[14px] font-normal leading-[22px]">
        {tasks.map((task, index) => {
          const taskErrors = errors[task.id] || {};
          const successorOptions = tasks.slice(index + 1).filter(t => t.level === 0);
          
          return (
            <div key={task.id} className={`grid ${gridPattern} gap-2 items-center px-3 py-1.5 border-b border-[#f2f3f5] hover:bg-blue-50/50 group transition-colors`}>
              <div className="flex items-center gap-2" style={{ paddingLeft: `${task.level * 1.5}rem` }}>
                {task.level > 0 && <span className="text-[#666666] shrink-0 border-l-2 border-b-2 w-3 h-3 inline-block rounded-bl" />}
                <Input 
                  value={task.name} 
                  onChange={e => onUpdate(task.id, 'name', e.target.value)} 
                  error={taskErrors.name}
                  placeholder="工作名称"
                  className={task.level > 0 ? "text-[#666666]" : ""}
                  autoFocus={task.isNew}
                />
              </div>

              <div>
                <Select 
                  multiple={true}
                  value={task.successorId} 
                  onChange={e => onUpdate(task.id, 'successorId', e.target.value)}
                  disabled={successorOptions.length === 0}
                >
                  {successorOptions.map(t => (
                    <option key={t.id} value={t.id}>{t.name || '未命名'}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Input 
                  type="text" 
                  value={task.duration} 
                  onChange={e => onUpdate(task.id, 'duration', e.target.value)} 
                  error={taskErrors.duration}
                  className="font-mono text-center"
                />
              </div>

              <div>
                <Input 
                  type="text" 
                  value={task.freeFloat} 
                  onChange={e => onUpdate(task.id, 'freeFloat', e.target.value)} 
                  error={taskErrors.freeFloat}
                  className="font-mono text-center"
                />
              </div>

              <div>
                <DatePicker 
                  value={task.startDate} 
                  onChange={e => onUpdate(task.id, 'startDate', e.target.value)} 
                  error={taskErrors.startDate}
                />
              </div>

              <div>
                <DatePicker 
                  value={task.endDate} 
                  onChange={e => onUpdate(task.id, 'endDate', e.target.value)} 
                  error={taskErrors.endDate}
                />
              </div>

              <div className="flex items-center justify-center gap-1">
                <IconButton onClick={() => onAddSibling(index, task.level)} title="增加同级任务" variant="primary">
                  <Plus className="w-3.5 h-3.5" />
                </IconButton>
                <IconButton onClick={() => onAddChild(index, task.level)} title="增加次级任务" variant="primary">
                  <CornerDownRight className="w-3.5 h-3.5" />
                </IconButton>
                <IconButton onClick={() => setDeleteId(task.id)} title="删除" variant="danger">
                  <Trash2 className="w-3.5 h-3.5" />
                </IconButton>
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-400">暂无任务数据，请添加</div>
        )}
      </div>

      <ConfirmModal 
        isOpen={!!deleteId} 
        title="删除单条任务" 
        message="确认删除当前选中的任务记录吗？此操作不可撤销。" 
        onConfirm={handleDeleteConfirm} 
        onCancel={() => setDeleteId(null)} 
      />
    </div>
  );
};
