import React, { InputHTMLAttributes, SelectHTMLAttributes, ButtonHTMLAttributes, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: React.FC<InputProps> = ({ error, className, onClick, onKeyDown, ...props }) => {
  return (
    <div className="relative w-full">
      <input
        className={`w-full h-[32px] px-2 text-[14px] leading-[22px] font-normal border rounded-sm outline-none transition-all box-border
        ${error ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_2px_rgba(245,63,63,0.2)]' : 'border-[#e5e6eb] focus:border-[#1F63D1] hover:border-[#1F63D1] focus:shadow-[0_0_0_2px_rgba(31,99,209,0.2)]'} 
        bg-white text-[#1d2129] ${className || ''}`}
        onClick={onClick}
        onKeyDown={onKeyDown}
        {...props}
      />
      {error && (
        <span className="absolute -bottom-3.5 left-1 text-[12px] leading-[18px] text-red-500 whitespace-nowrap z-10">
          {error}
        </span>
      )}
    </div>
  );
};

export const Select: React.FC<InputProps & SelectHTMLAttributes<HTMLSelectElement> & { multiple?: boolean }> = ({ error, className, children, value, onChange, multiple, disabled, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const options = React.Children.toArray(children).map(child => {
    if (React.isValidElement(child) && child.type === 'option') {
      return {
        value: child.props.value,
        label: child.props.children
      };
    }
    return null;
  }).filter(Boolean) as { value: string | number | readonly string[] | undefined, label: React.ReactNode }[];

  const isSelected = (optValue: any) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optValue);
    }
    return optValue === value;
  };

  const selectedOptions = options.filter(opt => isSelected(opt.value));
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Allow clicks inside the portal
      if ((event.target as Element).closest('.custom-dropdown-portal')) {
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

  const handleSelect = (val: any) => {
    if (multiple) {
      if (val === '') return;
      const currentValues = Array.isArray(value) ? [...value] : [];
      let newValues;
      if (currentValues.includes(val)) {
        newValues = currentValues.filter(v => v !== val);
      } else {
        newValues = [...currentValues, val];
      }
      if (onChange) {
        onChange({ target: { value: newValues } } as any);
      }
    } else {
      setIsOpen(false);
      if (onChange) {
        onChange({ target: { value: val } } as any);
      }
    }
  };

  const removeValue = (e: React.MouseEvent, val: any) => {
    e.stopPropagation();
    if (multiple) {
      const currentValues = Array.isArray(value) ? [...value] : [];
      const newValues = currentValues.filter(v => v !== val);
      if (onChange) {
        onChange({ target: { value: newValues } } as any);
      }
    }
  };

  return (
    <div className={`relative w-full ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className || ''}`} ref={containerRef}>
      <div 
        className={`w-full min-h-[32px] px-2 py-1 flex items-center justify-between text-[14px] leading-[20px] font-normal border rounded-sm outline-none transition-all box-border ${disabled ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer bg-white'}
        ${error ? 'border-red-400 focus:border-red-500 shadow-[0_0_0_2px_rgba(245,63,63,0.2)]' : (isOpen && !disabled ? 'border-[#1F63D1] shadow-[0_0_0_2px_rgba(31,99,209,0.2)]' : `border-[#e5e6eb] ${!disabled ? 'hover:border-[#1F63D1]' : ''}`)} 
        ${selectedOptions.length > 0 ? 'text-[#1d2129]' : 'text-[#86909c]'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0 pr-2">
          {selectedOptions.length > 0 ? (
            multiple ? (
              selectedOptions.map((opt, idx) => (
                <span 
                  key={String(opt.value) + idx} 
                  className="inline-flex items-center gap-1 bg-[#f2f3f5] text-[#1d2129] px-1.5 py-0.5 rounded-sm text-[12px] whitespace-nowrap"
                  title={typeof opt.label === 'string' ? opt.label : ''}
                >
                  <span className="truncate max-w-[80px]">{opt.label}</span>
                  <button 
                    onClick={(e) => !disabled && removeValue(e, opt.value)}
                    className={`rounded-sm p-0.5 text-[#86909c] ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#e5e6eb] hover:text-[#4e5969]'}`}
                    disabled={disabled}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            ) : (
              <span className="truncate block">{selectedOptions[0]?.label}</span>
            )
          ) : (
            <span>请选择内容</span>
          )}
        </div>
        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#1F63D1]' : 'text-[#86909c]'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>

      {isOpen && rect && document.body && createPortal(
        <div 
          className="custom-dropdown-portal fixed bg-white border border-[#e5e6eb] rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-[99999] py-1 max-h-64 overflow-y-auto"
          style={{
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width,
          }}
        >
          {options.map((opt, idx) => (
            opt.value === '' && multiple ? null : (
              <div 
                key={String(opt.value) + idx}
                className={`px-3 py-1.5 text-[14px] leading-[22px] cursor-pointer flex items-center ${isSelected(opt.value) && !multiple ? 'text-[#1F63D1] bg-[#f0f5ff]' : 'text-[#1d2129] hover:bg-[#f2f3f5]'}`}
                onClick={() => handleSelect(opt.value)}
              >
                {multiple && (
                  <div className="mr-2 flex items-center justify-center shrink-0">
                    {isSelected(opt.value) ? (
                       <div className="w-3.5 h-3.5 border border-[#1F63D1] bg-[#1F63D1] rounded-sm flex items-center justify-center transition-colors">
                         <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                         </svg>
                       </div>
                    ) : (
                       <div className="w-3.5 h-3.5 border border-[#e5e6eb] rounded-sm bg-white hover:border-[#1F63D1] transition-colors"></div>
                    )}
                  </div>
                )}
                {!multiple && isSelected(opt.value) && (
                  <div className="mr-2 flex items-center justify-center shrink-0">
                     <svg className="w-3.5 h-3.5 text-[#1F63D1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                     </svg>
                  </div>
                )}
                <span className="truncate">{opt.label}</span>
              </div>
            )
          ))}
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

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline-primary';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'secondary', className, children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center transition-all outline-none font-normal rounded-sm box-border cursor-pointer";
  const variants: Record<string, string> = {
    primary: "bg-[#1F63D1] text-white hover:bg-[#1a55b5] active:bg-[#154696] border border-transparent shadow-sm shadow-blue-200",
    secondary: "bg-white border border-[#e5e6eb] text-[#1d2129] hover:bg-slate-50 active:bg-gray-100",
    "outline-primary": "bg-white border border-[#1F63D1] text-[#1F63D1] hover:bg-[#f0f5ff] active:bg-[#e6efff]",
    ghost: "bg-transparent text-[#666666] hover:bg-slate-100 hover:text-[#1d2129] border border-transparent",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent hover:border-red-200",
  };
  const defaultSize = className?.includes('w-') || className?.includes('h-') ? "" : "h-[32px] px-3 text-[14px] leading-[22px]";

  return (
    <button className={`${baseStyles} ${variants[variant]} ${defaultSize} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export const IconButton: React.FC<ButtonProps> = ({ variant = 'ghost', className, children, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center p-1 rounded-sm transition-all outline-none cursor-pointer";
  const variants: Record<string, string> = {
    primary: "text-[#1F63D1] hover:bg-[#f0f5ff]",
    secondary: "text-[#666666] hover:bg-slate-100 text-[#1d2129]",
    ghost: "bg-transparent text-[#666666] hover:text-[#1d2129] hover:bg-slate-100",
    danger: "text-[#666666] hover:text-red-600 hover:bg-red-50",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className || ''}`} {...props}>
      {children}
    </button>
  );
};

export const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <label className={`block text-[14px] leading-[22px] text-[#666666] mb-1 font-normal ${className || ''}`}>{children}</label>
);

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-[1px]">
      <div className="bg-white rounded-lg shadow-xl border border-gray-100 w-[320px] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
          <h3 className="text-sm font-medium text-slate-800">{title}</h3>
          <IconButton onClick={onCancel}><X className="w-4 h-4" /></IconButton>
        </div>
        <div className="px-4 py-6 text-sm text-slate-600">
          {message}
        </div>
        <div className="flex justify-end gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100">
          <Button onClick={onCancel} variant="secondary">取消</Button>
          <Button onClick={onConfirm} variant="danger" className="border border-red-200">确认删除</Button>
        </div>
      </div>
    </div>
  );
}
