import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, error, className, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const initialDate = value && !isNaN(new Date(value).getTime()) ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(new Date(initialDate));
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      setViewDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((event.target as Element).closest('.custom-datepicker-portal')) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const updateRect = () => {
      if (containerRef.current) {
        setRect(containerRef.current.getBoundingClientRect());
      }
    };

    if (isOpen) {
      updateRect();
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updateRect, true);
      window.addEventListener('resize', updateRect);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateRect, true);
      window.removeEventListener('resize', updateRect);
    };
  }, [isOpen]);

  const handleSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const yyyy = newDate.getFullYear();
    const mm = String(newDate.getMonth() + 1).padStart(2, '0');
    const dd = String(newDate.getDate()).padStart(2, '0');
    onChange({ target: { value: `${yyyy}-${mm}-${dd}` } });
    setIsOpen(false);
  };

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let firstDay = new Date(year, month, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;
  
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month - 1, 1));
  };
  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year, month + 1, 1));
  };
  const prevYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year - 1, month, 1));
  };
  const nextYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(year + 1, month, 1));
  };

  return (
    <div className={`relative w-full ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className || ''}`} ref={containerRef}>
      <div
        className={`w-full h-[32px] px-2 text-[14px] leading-[22px] font-normal border rounded-sm outline-none transition-all box-border cursor-pointer flex items-center justify-between
        ${error ? 'border-red-400 focus:border-red-500 shadow-[0_0_0_2px_rgba(245,63,63,0.2)]' : (isOpen && !disabled ? 'border-[#1F63D1] shadow-[0_0_0_2px_rgba(31,99,209,0.2)]' : `border-[#e5e6eb] ${!disabled ? 'hover:border-[#1F63D1]' : ''}`)} 
        bg-white ${value ? 'text-[#1d2129]' : 'text-[#C7C7C7]'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
      >
        <span>{value || '选择日期'}</span>
        <CalendarIcon className="w-4 h-4 text-[#86909c]" />
      </div>

      {isOpen && rect && document.body && createPortal(
        <div 
          className="custom-datepicker-portal fixed w-[240px] bg-white border border-[#e5e6eb] rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-[99999] p-3 select-none"
          style={{
            top: rect.bottom + 4,
            left: rect.left,
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex gap-1">
              <div onClick={prevYear} className="p-1 cursor-pointer hover:bg-slate-100 rounded-sm text-[#4e5969]"><ChevronsLeft className="w-4 h-4" /></div>
              <div onClick={prevMonth} className="p-1 cursor-pointer hover:bg-slate-100 rounded-sm text-[#4e5969]"><ChevronLeft className="w-4 h-4" /></div>
            </div>
            <div className="text-[14px] font-medium text-[#1d2129]">
              {year}年{String(month + 1).padStart(2, '0')}月
            </div>
            <div className="flex gap-1">
              <div onClick={nextMonth} className="p-1 cursor-pointer hover:bg-slate-100 rounded-sm text-[#4e5969]"><ChevronRight className="w-4 h-4" /></div>
              <div onClick={nextYear} className="p-1 cursor-pointer hover:bg-slate-100 rounded-sm text-[#4e5969]"><ChevronsRight className="w-4 h-4" /></div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['一', '二', '三', '四', '五', '六', '日'].map(d => (
              <div key={d} className="text-[12px] text-[#86909c] py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {days.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} />;
              
              const currentDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = value === currentDateStr;
              
              const isToday = new Date().toISOString().split('T')[0] === currentDateStr;

              return (
                <div 
                  key={day}
                  onClick={(e) => { e.stopPropagation(); handleSelect(day); }}
                  className={`text-[14px] h-7 flex items-center justify-center rounded-sm cursor-pointer transition-colors
                    ${isSelected ? 'bg-[#1F63D1] text-white font-medium hover:bg-[#1a55b5]' : 'text-[#1d2129] hover:bg-slate-100'}
                    ${isToday && !isSelected ? 'text-[#1F63D1] font-bold' : ''}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>,
        document.body
      )}
      {error && (
        <span className="absolute -bottom-3.5 left-1 text-[12px] leading-[18px] text-red-500 whitespace-nowrap z-10">
          {error}
        </span>
      )}
    </div>
  );
};
