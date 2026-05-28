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

const fonts = ['宋体', '仿宋', '仿宋体', '微软雅黑', '黑体', '楷体'];
const fontSizes = ['初号', '小初', '一号', '小一', '二号', '小二', '三号', '小三', '四号', '小四', '五号', '小五', '六号', '小六'];

export const GlobalInfoArea: React.FC<Props> = ({ globalInfo, errors, onChange, onBlur, layout = 'horizontal' }) => {
  const containerClass = layout === 'horizontal' 
    ? 'grid grid-cols-3 gap-[50px]' 
    : 'flex flex-col gap-3';

  const wrapperClass = layout === 'horizontal' ? 'flex items-center gap-3' : 'flex flex-col gap-1.5';

  return (
    <div className={`p-4 bg-[#F4F6F8] rounded-lg border border-[#f2f3f5] ${containerClass}`}>
      <div className={wrapperClass}>
        <Label className={layout === 'horizontal' ? 'mb-0 whitespace-nowrap shrink-0' : ''}>字体</Label>
        <Select 
          value={globalInfo.font} 
          onChange={(e) => onChange('font', e.target.value)}
          onBlur={onBlur}
        >
          {fonts.map(f => <option key={f} value={f}>{f}</option>)}
        </Select>
      </div>

      <div className={wrapperClass}>
        <Label className={layout === 'horizontal' ? 'mb-0 whitespace-nowrap shrink-0' : ''}>字号</Label>
        <Select 
          value={globalInfo.fontSize} 
          onChange={(e) => onChange('fontSize', e.target.value)}
          onBlur={onBlur}
        >
          {fontSizes.map(size => <option key={size} value={size}>{size}</option>)}
        </Select>
      </div>

      <div className={wrapperClass}>
        <Label className={layout === 'horizontal' ? 'mb-0 whitespace-nowrap shrink-0' : ''}>标尺间隔（天）</Label>
        <Input 
          type="text" 
          value={globalInfo.rulerInterval}
          onChange={(e) => onChange('rulerInterval', e.target.value)}
          onBlur={onBlur}
          error={errors?.rulerInterval}
          placeholder="请输入标尺间隔"
        />
      </div>
    </div>
  );
};
