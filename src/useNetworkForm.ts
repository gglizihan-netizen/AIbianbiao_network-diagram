import { useState, useCallback } from 'react';
import { GlobalInfo, Task, FormErrors } from './types';

const defaultGlobal: GlobalInfo = {
  font: 'Microsoft YaHei',
  fontSize: '14',
  rulerInterval: '100',
};

const defaultTasks: Task[] = [
  { id: '1', name: '需求调研分析', duration: '5', freeFloat: '2', successorId: ['2'], startDate: '2026-06-01', endDate: '2026-06-05', level: 0 },
  { id: '2', name: '系统架构设计', duration: '10', freeFloat: '0', successorId: ['3'], startDate: '2026-06-06', endDate: '2026-06-15', level: 0 },
  { id: '3', name: '前端页面开发', duration: '15', freeFloat: '2', successorId: [], startDate: '2026-06-16', endDate: '2026-06-30', level: 0 },
  { id: '4', name: '基础组件封装', duration: '5', freeFloat: '0', successorId: ['3'], startDate: '2026-06-16', endDate: '2026-06-20', level: 1 },
];

const addDays = (dateStr: string, days: number) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

export function useNetworkForm() {
  const [globalInfo, setGlobalInfo] = useState<GlobalInfo>(defaultGlobal);
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [errors, setErrors] = useState<FormErrors>({ global: {}, tasks: {} });

  const validate = useCallback((currentGlobal = globalInfo, currentTasks = tasks, isSubmit = false) => {
    let isValid = true;
    const newErrors: FormErrors = { global: {}, tasks: {} };

    // Validate global
    if (!currentGlobal.rulerInterval || isNaN(Number(currentGlobal.rulerInterval)) || Number(currentGlobal.rulerInterval) <= 0) {
      newErrors.global.rulerInterval = '必须为正数';
      isValid = false;
    }

    // Validate tasks
    currentTasks.forEach(task => {
      const taskErrors: Record<string, string> = {};
      if (!task.name.trim() && (!task.isNew || isSubmit)) taskErrors.name = '不能为空';
      
      if (task.duration === '' || isNaN(Number(task.duration)) || Number(task.duration) < 0) {
        taskErrors.duration = '必须≥0';
      }
      
      if (task.freeFloat === '' || isNaN(Number(task.freeFloat)) || Number(task.freeFloat) < 0) {
        taskErrors.freeFloat = '必须≥0';
      }
      
      if (!task.startDate) taskErrors.startDate = '必填';
      if (!task.endDate) taskErrors.endDate = '必填';
      
      if (task.startDate && task.endDate && new Date(task.startDate) > new Date(task.endDate)) {
        taskErrors.endDate = '须比开始晚';
      }

      if (Object.keys(taskErrors).length > 0) {
        newErrors.tasks[task.id] = taskErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [globalInfo, tasks]);

  // Validate only specific field on change for real-time feedback without blocking
  const updateGlobal = (key: keyof GlobalInfo, value: string) => {
    const next = { ...globalInfo, [key]: value };
    setGlobalInfo(next);
    setErrors(prev => {
      if (prev.global[key]) {
        const newErrors = { ...prev, global: { ...prev.global } };
        delete newErrors.global[key];
        return newErrors;
      }
      return prev;
    });
  };

  const updateTask = (id: string, key: keyof Task, value: any) => {
    const next = tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, [key]: value };
        if (updated.isNew && key === 'name') {
           updated.isNew = false;
        }
        const durationNum = parseInt(updated.duration) || 0;
        const freeFloatNum = parseInt(updated.freeFloat) || 0;
        const totalDays = durationNum + freeFloatNum;
        
        if ((key === 'duration' || key === 'freeFloat') && updated.startDate) {
          updated.endDate = addDays(updated.startDate, totalDays - 1);
        } else if (key === 'startDate') {
          updated.endDate = addDays(updated.startDate, totalDays - 1);
        } else if (key === 'endDate') {
          updated.startDate = addDays(updated.endDate, -(totalDays - 1));
        }
        return updated;
      }
      return t;
    });
    setTasks(next);
    setErrors(prev => {
      if (prev.tasks[id] && prev.tasks[id][key as string]) {
        const newErrors = { ...prev, tasks: { ...prev.tasks, [id]: { ...prev.tasks[id] } } };
        delete newErrors.tasks[id][key as string];
        return newErrors;
      }
      return prev;
    });
  };

  const addTaskSibling = (index: number, level: number) => {
    const prevTask = tasks[index];
    const startDate = prevTask && prevTask.endDate ? addDays(prevTask.endDate, 1) : '';
    const duration = '1';
    const endDate = startDate ? addDays(startDate, parseInt(duration) - 1) : '';

    const newTask: Task = {
      id: Date.now().toString(),
      name: '',
      duration,
      freeFloat: '0',
      successorId: [],
      startDate,
      endDate,
      level,
      isNew: true,
    };
    const next = [...tasks];
    let insertIndex = index + 1;
    while (insertIndex < next.length && next[insertIndex].level > level) {
      insertIndex++;
    }
    next.splice(insertIndex, 0, newTask);
    setTasks(next);
  };

  const addTaskChild = (index: number, parentLevel: number) => {
    const parentTask = tasks[index];
    const startDate = parentTask ? parentTask.startDate : '';
    const duration = '1';
    const endDate = startDate ? addDays(startDate, parseInt(duration) - 1) : '';

    const newTask: Task = {
      id: Date.now().toString(),
      name: '',
      duration,
      freeFloat: '0',
      successorId: [],
      startDate,
      endDate,
      level: parentLevel + 1,
      isNew: true,
    };
    const next = [...tasks];
    next.splice(index + 1, 0, newTask);
    setTasks(next);
  };

  const removeTask = (id: string) => {
    const next = tasks.filter(t => t.id !== id);
    const cleaned = next.map(t => ({
      ...t,
      successorId: Array.isArray(t.successorId) ? t.successorId.filter(sId => sId !== id) : t.successorId
    }));
    setTasks(cleaned);
    validate(globalInfo, cleaned);
  };

  const resetForm = () => {
    setGlobalInfo(defaultGlobal);
    setTasks(defaultTasks);
    setErrors({ global: {}, tasks: {} });
  };

  return {
    globalInfo,
    tasks,
    errors,
    updateGlobal,
    updateTask,
    addTaskSibling,
    addTaskChild,
    removeTask,
    resetForm,
    validate
  };
}
