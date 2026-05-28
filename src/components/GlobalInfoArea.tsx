import React from 'react';
import { GlobalInfo } from '../types';
import { Input, Select, Label } from './UI';

interface Props {
  globalInfo: GlobalInfo;
  errors?: Record<string, string>;
  onChange: (key: keyof GlobalInfo, value: string) => void;
  onBlur?: () => void;
  layout?: 'horizontal' | 'vertical';
}

const fonts = ['SimSun', 'Microsoft YaHei', 'FangSong', 'KaiTi', 'PingFang SC', 'Arial'];
const fontSizes = ['12', '13', '14', '16', '18', '20', '24'];

export const GlobalInfoArea: React.FC<Props> = ({ globalInfo, errors, onChange, onBlur, layout = 'horizontal' }) => {
  const containerClass = layout === 'horizontal' 
    ? 'grid grid-cols-3 gap-4' 
    : 'flex flex-col gap-3';

  const wrapperClass = layout === 'horizontal' ? 'flex flex-col gap-1' : 'space-y-1';

  return (
    <div className={`p-4 bg-[#F4F6F8] rounded-lg border border-[#f2f3f5] ${containerClass}`}>
      <div className={wrapperClass}>
        <Label>渲染字体</Label>
        <Select 
          value={globalInfo.font} 
          onChange={(e) => onChange('font', e.target.value)}
          onBlur={onBlur}
        >
          {fonts.map(f => <option key={f} value={f}>{f}</option>)}
        </Select>
      </div>

      <div className={wrapperClass}>
        <Label>全局字号</Label>
        <Select 
          value={globalInfo.fontSize} 
          onChange={(e) => onChange('fontSize', e.target.value)}
          onBlur={onBlur}
        >
          {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
        </Select>
      </div>

      <div className={wrapperClass}>
        <Label>标尺单位 (px)</Label>
        <Input 
          type="text" 
          value={globalInfo.rulerInterval}
          onChange={(e) => onChange('rulerInterval', e.target.value)}
          onBlur={onBlur}
          error={errors?.rulerInterval}
          placeholder="数字"
        />
      </div>
    </div>
  );
};
