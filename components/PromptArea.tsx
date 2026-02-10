
import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  onProcess: () => void;
  disabled: boolean;
  isProcessing: boolean;
}

const PromptArea: React.FC<Props> = ({ value, onChange, onProcess, disabled, isProcessing }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ví dụ: Đổi màu áo sang màu đỏ rực rỡ..."
          className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none bg-slate-50"
          disabled={isProcessing}
        />
        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
          {value.length} ký tự
        </div>
      </div>

      <button
        onClick={onProcess}
        disabled={disabled}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-95
          ${disabled 
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300'}
        `}
      >
        {isProcessing ? (
          <>
            <i className="fa-solid fa-circle-notch animate-spin"></i>
            Đang xử lý...
          </>
        ) : (
          <>
            <i className="fa-solid fa-bolt-lightning"></i>
            Bắt đầu sửa ảnh
          </>
        )}
      </button>
    </div>
  );
};

export default PromptArea;
