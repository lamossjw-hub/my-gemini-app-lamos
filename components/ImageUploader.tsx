
import React, { useRef } from 'react';

interface Props {
  onUpload: (image: string) => void;
  currentImage: string | null;
  label: string;
  height?: string;
}

const ImageUploader: React.FC<Props> = ({ onUpload, currentImage, label, height = "min-h-[200px]" }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-slate-400">{label}</span>
      <div 
        onClick={triggerUpload}
        className={`
          relative cursor-pointer overflow-hidden rounded-lg border-2 border-dashed transition-all duration-300 ${height} flex flex-col items-center justify-center
          ${currentImage ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-[#2d3139] bg-[#1a1d24] hover:border-indigo-500/50 hover:bg-[#1e222a]'}
        `}
      >
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
        
        {currentImage ? (
          <div className="relative w-full h-full flex items-center justify-center p-2">
            <img src={currentImage} alt={label} className="max-w-full max-h-full object-contain rounded" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium px-3 py-1 bg-indigo-600 rounded">Thay đổi</span>
            </div>
          </div>
        ) : (
          <div className="text-center p-4">
            <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-500 mb-2"></i>
            <p className="text-xs text-slate-500">Drag & drop or click to upload</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
