import React, { useState } from 'react';
import { AppState, ImageResolution, GenerationResult } from './types';
import { generateImageWithGemini } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ResultGrid from './components/ResultGrid';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    referenceImages: [null, null, null, null],
    prompt: '',
    resolution: "1024x1024",
    quantity: 1,
    results: [],
    isProcessing: false,
  });

  const handleOriginalUpload = (image: string) => {
    setState(prev => ({ ...prev, originalImage: image }));
  };

  const handleRefUpload = (index: number, image: string | null) => {
    const newRefs = [...state.referenceImages];
    newRefs[index] = image;
    setState(prev => ({ ...prev, referenceImages: newRefs }));
  };

  const handleProcess = async () => {
    if (!state.prompt) return;

    // Fix: If 2K resolution is selected, we need to ensure an API key has been selected.
    // Use type assertion (window as any).aistudio to avoid conflicts with pre-defined platform types in the environment.
    if (state.resolution === "2160x2160") {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await (window as any).aistudio.openSelectKey();
      }
    }

    const initialResults = Array.from({ length: state.quantity }, (_, i) => ({
      id: `res-${Date.now()}-${i}`,
      url: '',
      isLoading: true
    }));

    setState(prev => ({ 
      ...prev, 
      isProcessing: true,
      results: initialResults
    }));

    const tasks = initialResults.map(async (res, i) => {
      try {
        const url = await generateImageWithGemini(
          state.originalImage,
          state.referenceImages,
          state.prompt,
          state.resolution
        );
        setState(prev => ({
          ...prev,
          results: prev.results.map((r) => r.id === res.id ? { ...r, url, isLoading: false } : r)
        }));
      } catch (err: any) {
        // Fix: If the request fails with an API_KEY_ERROR, reset key selection state and prompt the user to select a key again via openSelectKey().
        if (err?.message === "API_KEY_ERROR") {
           await (window as any).aistudio.openSelectKey();
        }
        setState(prev => ({
          ...prev,
          results: prev.results.map((r) => r.id === res.id ? { ...r, isLoading: false, error: 'Lỗi tạo ảnh' } : r)
        }));
      }
    });

    await Promise.all(tasks);
    setState(prev => ({ ...prev, isProcessing: false }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen flex flex-col items-center">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#60a5fa] via-[#818cf8] to-[#a78bfa]">
          Gemini Image Editor
        </h1>
        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Craft stunning images by combining an original, references, and your creative prompts.
        </p>
      </div>

      <div className="w-full space-y-8">
        {/* Upper Section: Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Subject */}
          <div className="md:col-span-1">
            <ImageUploader 
              label="ori A" 
              onUpload={handleOriginalUpload} 
              currentImage={state.originalImage}
              height="h-[400px]"
            />
          </div>

          {/* References Grid */}
          <div className="grid grid-cols-2 gap-4">
            {state.referenceImages.map((img, i) => (
              <ImageUploader 
                key={i}
                label={`ref ${String.fromCharCode(97 + i)}`}
                onUpload={(data) => handleRefUpload(i, data)}
                currentImage={img}
                height="h-[188px]"
              />
            ))}
          </div>
        </div>

        {/* Control Panel Section */}
        <div className="bg-[#161920] rounded-2xl border border-[#2d3139] p-6 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prompt Column */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              <label className="text-[#00c2ff] text-xs font-bold uppercase tracking-[0.2em]">Prompt</label>
              <textarea
                value={state.prompt}
                onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                placeholder="e.g., Make ori A look like a watercolor painting, using the color palette from ref a."
                className="w-full h-24 bg-black/40 border border-[#2d3139] rounded-xl p-4 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none text-sm"
              />
            </div>

            {/* Controls Column */}
            <div className="flex flex-col gap-4 justify-between">
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#00c2ff] text-xs font-bold uppercase tracking-[0.2em]">Image Size</label>
                  <select 
                    value={state.resolution}
                    onChange={(e) => setState(prev => ({ ...prev, resolution: e.target.value as ImageResolution }))}
                    className="w-full bg-black/40 border border-[#2d3139] rounded-xl p-3 text-slate-100 focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-colors text-sm"
                  >
                    <option value="1024x1024">1024x1024 (Square)</option>
                    <option value="1080x1920">1080x1920 (Portrait 9:16)</option>
                    <option value="2160x2160">2160x2160 (High-res Square)</option>
                    <option value="1080x1350">1080x1350 (Portrait 4:5)</option>
                    <option value="1958x745">1958x745 (Landscape)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[#00c2ff] text-xs font-bold uppercase tracking-[0.2em]">Number of Images</label>
                  <select 
                    value={state.quantity}
                    onChange={(e) => setState(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                    className="w-full bg-black/40 border border-[#2d3139] rounded-xl p-3 text-slate-100 focus:outline-none appearance-none cursor-pointer hover:bg-black/60 transition-colors text-sm"
                  >
                    {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleProcess}
            disabled={state.isProcessing || !state.prompt}
            className={`
              w-full mt-6 py-4 rounded-xl font-bold text-slate-100 transition-all transform active:scale-[0.99]
              bg-gradient-to-r from-[#217d8f] via-[#48408f] to-[#7f268f]
              disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:brightness-110
            `}
          >
            {state.isProcessing ? (
              <span className="flex items-center justify-center gap-3">
                <i className="fa-solid fa-circle-notch animate-spin"></i>
                Generating...
              </span>
            ) : (
              "Generate Image"
            )}
          </button>
        </div>

        {/* Results / Placeholder Section */}
        <div className="pt-4">
          {state.results.length === 0 ? (
            <div className="bg-[#161920] border border-[#2d3139] rounded-2xl h-[240px] flex items-center justify-center shadow-inner">
              <p className="text-slate-600 text-lg font-medium select-none">
                Your generated image will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#00c2ff] border-b border-[#2d3139] pb-4">
                Generated Results
              </h2>
              <ResultGrid results={state.results} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;