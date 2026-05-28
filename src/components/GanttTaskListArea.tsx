import React from 'react';
import { Task } from '../types';
import { Input, IconButton } from './UI';
import { DatePicker } from './DatePicker';
import { Trash2, CornerDownRight, Plus, Maximize2, Minimize2 } from 'lucide-react';

interface GanttTaskListProps {
  tasks: Task[];
  errors: Record<string, Record<string, string>>;
  onUpdate: (id: string, key: keyof Task, value: string) => void;
  onAddSibling: (index: number, level: number) => void;
  onAddChild: (index: number, parentLevel: number) => void;
  onRemove: (id: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onBlur?: () => void;
}

const gridPattern = "grid-cols-[60px_2.5fr_1.2fr_1.2fr_1fr_1fr_120px]";

export const GanttTaskListArea: React.FC<GanttTaskListProps> = ({
  tasks, errors, onUpdate, onAddSibling, onAddChild, onRemove, isExpanded, onToggleExpand, onBlur
}) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-[#f2f3f5] overflow-hidden shadow-sm">
      <div className={`relative grid ${gridPattern} gap-2 px-3 py-2 bg-[#F4F6F8] border-b border-[#f2f3f5] text-[14px] font-normal leading-[22px] text-[#666666]`}>
        <div className="text-center">序号</div>
        <div>分部分项工程名称</div>
        <div>开始施工日期</div>
        <div>结束施工日期</div>
        <div>工期 (天)</div>
        <div>计划劳动力</div>
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
          
          return (
            <div key={task.id} className={`grid ${gridPattern} gap-2 items-center px-3 py-1.5 border-b border-[#f2f3f5] hover:bg-blue-50/50 group transition-colors`}>
              <div className="text-center text-[#666666] font-mono text-sm leading-8">{index + 1}</div>
              
              <div className="flex items-center gap-2" style={{ paddingLeft: `${task.level * 1.5}rem` }}>
                {task.level > 0 && <span className="text-[#666666] shrink-0 border-l-2 border-b-2 w-3 h-3 inline-block rounded-bl" />}
                <Input 
                  value={task.name} 
                  onChange={e => onUpdate(task.id, 'name', e.target.value)} 
                  onBlur={onBlur}
                  error={taskErrors.name}
                  placeholder="请输入分部分项工程名称"
                  autoFocus={task.isNew}
                />
              </div>

              <div>
                <DatePicker 
                  value={task.startDate} 
                  onChange={e => { onUpdate(task.id, 'startDate', e.target.value); if (onBlur) onBlur(); }} 
                  error={taskErrors.startDate}
                />
              </div>

              <div>
                <DatePicker 
                  value={task.endDate} 
                  onChange={e => { onUpdate(task.id, 'endDate', e.target.value); if (onBlur) onBlur(); }} 
                  error={taskErrors.endDate}
                />
              </div>

              <div>
                <Input 
                  type="text" 
                  value={task.duration} 
                  onChange={e => onUpdate(task.id, 'duration', e.target.value)} 
                  onBlur={onBlur}
                  error={taskErrors.duration}
                  className="font-mono text-center"
                />
              </div>

              <div>
                <Input 
                  type="text" 
                  value={task.plannedLabor || ''} 
                  onChange={e => onUpdate(task.id, 'plannedLabor', e.target.value)} 
                  onBlur={onBlur}
                  error={taskErrors.plannedLabor}
                  className="font-mono text-center"
                />
              </div>

              <div className="flex items-center justify-center gap-1">
                <IconButton onClick={() => onAddSibling(index, task.level)} title="增加同级任务" variant="primary">
                  <Plus className="w-3.5 h-3.5" />
                </IconButton>
                <IconButton onClick={() => onAddChild(index, task.level)} title="增加次级任务" variant="primary">
                  <CornerDownRight className="w-3.5 h-3.5" />
                </IconButton>
                <IconButton onClick={() => onRemove(task.id)} title="删除" variant="danger">
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
    </div>
  );
};
