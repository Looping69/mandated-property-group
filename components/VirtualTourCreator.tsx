
"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Save, Trash2, Mic, Play, Aperture, Check, Video, Sparkles, Upload, Film, User, Volume2 } from 'lucide-react';
import { analyzeTourImage } from '../services/geminiService';
import { TourStop, VirtualTour, VoicePreset } from '../types';
import { useData } from '../contexts/DataContext';
import { Button } from './ui/button';
import { VOICE_OPTIONS, synthesizeSpeech, createAudioFromBase64 } from '../services/ttsService';

export const VirtualTourCreator: React.FC = () => {
  const { addTour, listings } = useData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tourStops, setTourStops] = useState<TourStop[]>([]);
  const [contextInput, setContextInput] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<{ title: string, script: string } | null>(null);
  const [tourTitle, setTourTitle] = useState("");
  const [selectedListingId, setSelectedListingId] = useState<string>("");

  // Voice State - Now using Google Cloud TTS presets
  const [selectedVoice, setSelectedVoice] = useState<VoicePreset>('OLIVIA');
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);

  // Preview voice
  const previewVoice = async (voice: VoicePreset) => {
    if (isPreviewPlaying) return;
    setIsPreviewPlaying(true);
    try {
      const response = await synthesizeSpeech(
        `Hello, I'm ${VOICE_OPTIONS[voice].displayName}. I'll be your guide through this exquisite property.`,
        voice
      );
      const audio = createAudioFromBase64(response.audioContent);
      audio.onended = () => setIsPreviewPlaying(false);
      await audio.play();
    } catch (error) {
      console.error('Preview failed:', error);
      setIsPreviewPlaying(false);
    }
  };

  // Initialize Camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "environment"
        }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCapturedImage(reader.result);
          const base64Data = reader.result.split(',')[1];
          handleAnalysis(base64Data);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(dataUrl);
        const base64Data = dataUrl.split(',')[1];
        handleAnalysis(base64Data);
      }
    }
  };

  const handleAnalysis = async (base64Data: string) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);
    try {
      const result = await analyzeTourImage(base64Data, contextInput || "A room in a luxury home");
      setCurrentAnalysis(result);
    } catch (error) {
      console.error(error);
      alert("AI analysis failed. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addToTour = () => {
    if (capturedImage && currentAnalysis) {
      const newStop: TourStop = {
        id: Date.now().toString(),
        title: currentAnalysis.title,
        description: currentAnalysis.script,
        image: capturedImage,
        timestamp: Date.now()
      };
      setTourStops([...tourStops, newStop]);
      resetCapture();
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setCurrentAnalysis(null);
    setContextInput("");
  };

  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublishTour = async () => {
    if (tourStops.length === 0) return;

    setIsPublishing(true);

    try {
      // Pre-generate audio for all tour stops
      const stopsWithAudio = await Promise.all(
        tourStops.map(async (stop) => {
          try {
            const response = await synthesizeSpeech(stop.description, selectedVoice);
            return {
              ...stop,
              audioUrl: `data:audio/mp3;base64,${response.audioContent}`,
            };
          } catch (error) {
            console.error(`Failed to generate audio for stop ${stop.id}:`, error);
            // Continue without audio if TTS fails
            return stop;
          }
        })
      );

      const listing = listings.find(l => l.id === selectedListingId);
      const finalTitle = tourTitle || (listing ? `Tour: ${listing.title}` : `Virtual Tour ${new Date().toLocaleDateString()}`);

      const newTour: VirtualTour = {
        id: `vt${Date.now()}`,
        title: finalTitle,
        agentId: 'a1',
        listingId: selectedListingId,
        stops: stopsWithAudio,
        date: new Date().toISOString(),
        status: 'published',
        voicePreset: selectedVoice // Premium Google Cloud TTS voice
      };

      addTour(newTour);
      alert("Virtual Tour Published with premium voice narration! You can now view it linked to the property listing.");
      setTourStops([]);
      setTourTitle("");
      setSelectedListingId("");
    } catch (error) {
      console.error("Failed to publish tour:", error);
      alert("Failed to publish tour. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-brand-purple text-white rounded-lg shadow-lg">
              <Aperture size={28} />
            </div>
            <h2 className="font-serif text-4xl text-slate-900 font-bold">AI Tour Studio</h2>
          </div>
          <p className="text-slate-500 font-medium">
            Document luxury spaces with AI-assisted spatial analysis and agent narration.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <div className="flex flex-col items-end px-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Status</span>
            <span className="text-xs font-bold text-brand-green flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse"></div> Gemini Vision Active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Viewfinder & Analysis */}
        <div className="lg:col-span-8 space-y-6">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10 group">

            {/* Viewfinder UI */}
            <div className="absolute top-6 left-6 z-20 pointer-events-none">
              <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded text-[10px] font-mono text-white/90 flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> 1080P • 60FPS
              </div>
            </div>

            <div className="absolute inset-0 z-10 pointer-events-none border-[20px] border-transparent group-hover:border-white/5 transition-all">
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white/30 rounded-tl-xl"></div>
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-xl"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white/30 rounded-bl-xl"></div>
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white/30 rounded-br-xl"></div>
            </div>

            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isCameraActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
                />
                {!isCameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 bg-slate-900">
                    <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green animate-pulse">
                      <Camera size={40} />
                    </div>
                    <div className="text-center">
                      <h3 className="text-white font-serif text-xl mb-4">Start Recording Space</h3>
                      <div className="flex gap-3 justify-center">
                        <Button
                          variant="brand"
                          onClick={startCamera}
                          className="px-8 py-6 rounded-xl font-bold text-lg shadow-glow hover:scale-105 transition-transform"
                        >
                          <Camera className="mr-2" /> Start Camera
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-8 py-6 rounded-xl font-bold text-lg border-white/20 text-white hover:bg-white/10"
                        >
                          <Upload className="mr-2" /> Upload Photo
                        </Button>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </div>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </>
            ) : (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover animate-in fade-in duration-500" />
            )}

            {/* Capture Controls */}
            {isCameraActive && !capturedImage && (
              <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-6 z-20">
                <div className="bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl flex items-center w-[350px]">
                  <Sparkles size={18} className="text-brand-green ml-3" />
                  <input
                    type="text"
                    placeholder="Add focus points (e.g. 'imported marble')"
                    className="bg-transparent text-white px-4 py-2 flex-1 outline-none placeholder-white/40 font-medium text-sm"
                    value={contextInput}
                    onChange={(e) => setContextInput(e.target.value)}
                  />
                </div>

                <button
                  onClick={captureImage}
                  className="w-20 h-20 bg-white/10 rounded-full border-4 border-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 hover:bg-white/20 shadow-2xl"
                >
                  <div className="w-14 h-14 bg-white rounded-full shadow-inner border-2 border-slate-200"></div>
                </button>
              </div>
            )}
          </div>

          {/* AI Workbench */}
          {isAnalyzing && (
            <div className="bg-white p-12 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <RefreshCw className="animate-spin text-brand-purple" size={48} />
                <Sparkles className="absolute -top-1 -right-1 text-gold-500 animate-bounce" size={20} />
              </div>
              <div className="text-center">
                <p className="text-slate-800 font-serif text-xl font-bold">Spatial Intelligence Engine</p>
                <p className="text-slate-500 text-sm">Drafting luxury commentary for this scene...</p>
              </div>
            </div>
          )}

          {currentAnalysis && (
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
              <div className="absolute top-0 left-0 w-2 h-full bg-brand-green"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-serif text-3xl font-bold text-slate-900 mb-1">{currentAnalysis.title}</h3>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Sparkles size={12} /> AI Script Finalized
                  </p>
                </div>
              </div>

              <div className="bg-brand-purpleLight/50 p-6 rounded-xl border border-brand-purple/5 mb-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-brand-purple">
                    <Mic size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2 tracking-widest">Agent Voice-Over Script</p>
                    <p className="text-slate-800 text-lg italic font-medium leading-relaxed">
                      "{currentAnalysis.script}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={addToTour}
                  variant="brand"
                  className="flex-1 py-7 rounded-xl text-lg shadow-glow"
                >
                  <Check size={20} className="mr-2" /> Add Scene to Tour
                </Button>
                <Button
                  onClick={resetCapture}
                  variant="outline"
                  className="px-10 py-7 rounded-xl text-lg text-red-500 hover:bg-red-50 border-red-100"
                >
                  Retake
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Tour Manager */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col h-[700px] sticky top-24">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-widest">Link to Listing</label>
                <select
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-brand-green shadow-sm"
                  value={selectedListingId}
                  onChange={(e) => setSelectedListingId(e.target.value)}
                >
                  <option value="">Select Property...</option>
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>{l.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-widest">Custom Tour Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sunset Walkthrough"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-brand-green shadow-sm"
                  value={tourTitle}
                  onChange={(e) => setTourTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest flex items-center gap-1">
                  <Mic size={10} /> Premium Voice Guide
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(VOICE_OPTIONS) as VoicePreset[]).map((voiceKey) => {
                    const voice = VOICE_OPTIONS[voiceKey];
                    const isSelected = selectedVoice === voiceKey;
                    return (
                      <div
                        key={voiceKey}
                        onClick={() => setSelectedVoice(voiceKey)}
                        className={`relative p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${isSelected
                          ? 'border-brand-green bg-brand-green/5 shadow-md'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${voice.ssmlGender === 'FEMALE'
                            ? 'bg-pink-100 text-pink-600'
                            : 'bg-blue-100 text-blue-600'
                            }`}>
                            <User size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900">{voice.displayName}</p>
                            <p className="text-[10px] text-slate-500">{voice.ssmlGender === 'FEMALE' ? 'Female' : 'Male'}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{voice.description}</p>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-brand-green rounded-full flex items-center justify-center">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); previewVoice(voiceKey); }}
                          disabled={isPreviewPlaying}
                          className="mt-2 w-full py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 rounded-md flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                        >
                          <Volume2 size={10} /> {isPreviewPlaying ? 'Playing...' : 'Preview'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <h3 className="font-serif text-xl text-slate-900 font-bold">Sequence</h3>
                <div className="flex items-center gap-1.5 bg-brand-green/10 text-brand-green px-3 py-1 rounded-full text-xs font-bold">
                  <Video size={12} /> {tourStops.length} Scenes
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/20">
              {tourStops.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 opacity-50">
                    <Film size={32} />
                  </div>
                  <p className="font-bold text-slate-500">Storyboard Empty</p>
                  <p className="text-[11px] mt-2 leading-relaxed">Capture rooms using the camera viewfinder to build your AI-powered tour sequence.</p>
                </div>
              ) : (
                tourStops.map((stop, index) => (
                  <div key={stop.id} className="group relative bg-white p-3 rounded-xl border border-slate-200 hover:border-brand-purple transition-all shadow-sm hover:shadow-md animate-in slide-in-from-right-4 duration-300">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 flex-shrink-0 bg-slate-200 rounded-lg overflow-hidden relative shadow-inner">
                        <img src={stop.image} alt={stop.title} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-brand-green text-white text-[10px] w-6 h-6 flex items-center justify-center rounded-full font-bold shadow-md">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-center">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{stop.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">"{stop.description}"</p>
                      </div>
                      <div className="flex flex-col justify-between items-end pb-1">
                        <button
                          onClick={() => setTourStops(tourStops.filter(s => s.id !== stop.id))}
                          className="text-slate-300 hover:text-red-500 transition-colors p-1"
                          title="Delete Scene"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="bg-brand-purple/5 p-1 rounded-md">
                          <Play size={14} className="text-brand-purple opacity-50" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-white rounded-b-2xl">
              <Button
                onClick={handlePublishTour}
                disabled={tourStops.length === 0 || isPublishing}
                variant="brand"
                className="w-full py-7 rounded-xl text-lg font-bold shadow-xl"
              >
                {isPublishing ? (
                  <>
                    <RefreshCw size={20} className="mr-2 animate-spin" /> Generating Voice Narration...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-2" /> Publish AI Experience
                  </>
                )}
              </Button>
              <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">
                {isPublishing ? 'Creating premium voice for each scene...' : 'Secure Cloud Publishing Enabled'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
