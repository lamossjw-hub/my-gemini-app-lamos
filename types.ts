
export type ImageResolution = 
  | "1024x1024" 
  | "1080x1920" 
  | "2160x2160" 
  | "1080x1350" 
  | "1958x745";

export interface GenerationResult {
  id: string;
  url: string;
  isLoading: boolean;
  error?: string;
}

export interface AppState {
  originalImage: string | null;
  referenceImages: (string | null)[];
  prompt: string;
  resolution: ImageResolution;
  quantity: number;
  results: GenerationResult[];
  isProcessing: boolean;
}
