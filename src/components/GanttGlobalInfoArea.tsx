import React from 'react';
import { GlobalInfo } from '../types';
import { Switch, Label } from './UI';

interface Props {
  globalInfo: GlobalInfo;
  onChange: (key: keyof GlobalInfo, value: any) => void;
  onBlur?: () => void;
  layout?: 'horizontal' | 'vertical';
}

export const GanttGlobalInfoArea: React.FC<Props> = ({ globalInfo, onChange, onBlur, layout = 'horizontal' }) => {
  const containerClass = layout === 'horizontal' 
    ? 'flex gap-4' 
    : 'flex flex-col gap-3';
    
  const wrapperClass = layout === 'horizontal'
    ? 'flex items-center gap-3'
    : 'flex flex-col gap-1.5';

  return (
    <div className={`p-4 bg-[#F4F6F8] rounded-lg border border-[#f2f3f5] ${containerClass}`}>
      <div className={wrapperClass}>
        <Label className="mb-0 whitespace-nowrap">显示网格线</Label>
        <Switch 
          checked={!!globalInfo.showGridLines}
          onChange={(checked) => { onChange('showGridLines', checked); if (onBlur) onBlur(); }}
        />
      </div>
    </div>
  );
};
