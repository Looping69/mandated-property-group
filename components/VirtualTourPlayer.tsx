
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Film, Sparkles, X, Volume2, VolumeX, ChevronLeft, ChevronRight, Mic, Settings2, Command } from 'lucide-react';
import { Button } from './ui/button';
import { VirtualTour } from '../types';

// Augment the window interface for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export const VirtualTourPlayer: React.FC<{ tour: VirtualTour; onClose: () => void }> = ({ tour, onClose }) => {
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  // TTS (Speaking) State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number>(0);
  const [speaking, setSpeaking] = useState(false);
  
  // STT (Listening/Command) State
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const currentStop = tour.stops[currentStopIndex];
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const recognitionRef = useRef<any>(null);

  // Determine animation variant based on index to ensure variety
  const getAnimationClass = (index: number) => {
    const variants = [
      'animate-kenburns-tl-br', // Top-Left to Bottom-Right
      'animate-kenburns-tr-bl', // Top-Right to Bottom-Left
      'animate-kenburns-bl-tr', // Bottom-Left to Top-Right
      'animate-kenburns-br-tl', // Bottom-Right to Top-Left
    ];
    return variants[index % variants.length];
  };

  // 1. Initialize System Voices (TTS)
  useEffect(() => {
    const loadVoices = () => {
      // Filter for English voices to ensure compatibility
      const available = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'));
      setVoices(available);
      
      // Check if the tour has a preferred voice saved
      if (tour.voiceURI) {
        const preferredIndex = available.findIndex(v => v.voiceURI === tour.voiceURI);
        if (preferredIndex !== -1) {
            setSelectedVoiceIndex(preferredIndex);
            return;
        }
      }

      // Fallback: Try to find a high-quality "Google" or "Premium" voice
      const defaultIndex = available.findIndex(v => 
        v.name.includes('Google US English') || 
        v.name.includes('Samantha') || 
        v.name.includes('Premium')
      );
      if (defaultIndex !== -1) setSelectedVoiceIndex(defaultIndex);
    };

    loadVoices();
    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => { window.speechSynthesis.cancel(); };
  }, [tour.voiceURI]); // Added tour.voiceURI to dependency

  // 2. Initialize Voice Recognition (STT - "System Whisper")
  useEffect(() => {
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionClass = SpeechRecognition || webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        // Ignore benign errors to prevent console spam
        if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'not-allowed') {
            return;
        }
        console.error("Voice recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        // Auto-restart if we are supposed to be listening and it wasn't manually stopped
        if (isListening) {
            try {
                recognition.start();
            } catch (e) {
                // Ignore errors if already started
            }
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isListening]); 

  // Toggle Listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("Voice control not supported in this browser.");
        return;
    }

    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    } else {
        try {
            recognitionRef.current.start();
            setIsListening(true);
        } catch (e) {
            console.error("Recognition start failed", e);
        }
    }
  };

  // 3. Handle Voice Commands
  const handleVoiceCommand = (command: string) => {
    console.log("Heard command:", command);
    setLastCommand(command);
    
    // Clear visual feedback after 2s
    setTimeout(() => setLastCommand(null), 2000);

    if (command.includes('next') || command.includes('forward') || command.includes('go')) {
        handleManualNav(Math.min(tour.stops.length - 1, currentStopIndex + 1));
    } else if (command.includes('back') || command.includes('previous') || command.includes('behind')) {
        handleManualNav(Math.max(0, currentStopIndex - 1));
    } else if (command.includes('stop') || command.includes('pause') || command.includes('wait')) {
        setIsPlaying(false);
        window.speechSynthesis.pause();
    } else if (command.includes('play') || command.includes('resume') || command.includes('start')) {
        setIsPlaying(true);
        window.speechSynthesis.resume();
    } else if (command.includes('mute') || command.includes('quiet') || command.includes('silent')) {
        setIsMuted(true);
    } else if (command.includes('unmute') || command.includes('speak') || command.includes('loud')) {
        setIsMuted(false);
    } else if (command.includes('close') || command.includes('exit')) {
        onClose();
    }
  };

  // 4. Handle TTS Playback Logic
  useEffect(() => {
    // Robust cancellation
    window.speechSynthesis.cancel();
    
    if (!currentStop) return;

    if (isMuted || !isPlaying) {
        setSpeaking(false);
        return;
    }

    const text = currentStop.description;
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (voices[selectedVoiceIndex]) {
        utterance.voice = voices[selectedVoiceIndex];
    }
    
    utterance.rate = 1.0; 
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setSpeaking(true);
    
    utterance.onend = () => {
        setSpeaking(false);
        if (isPlaying) {
            setTimeout(() => {
                if (currentStopIndex < tour.stops.length - 1) {
                    setCurrentStopIndex(prev => prev + 1);
                } else {
                    setIsPlaying(false);
                }
            }, 2000); // 2s pause before next slide
        }
    };

    utterance.onerror = (e: any) => {
        // Ignore errors caused by canceling the speech (e.g. hitting Next quickly)
        if (e.error === 'interrupted' || e.error === 'canceled') {
            return;
        }
        console.error("Speech Error", e);
        setSpeaking(false);
    };

    utteranceRef.current = utterance;
    
    // Small timeout to ensure browser is ready (fixes some race conditions in Chrome)
    const timeoutId = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 50);

    return () => {
        clearTimeout(timeoutId);
        window.speechSynthesis.cancel();
    };
  }, [currentStopIndex, selectedVoiceIndex, isPlaying, isMuted, voices, currentStop]);

  // Handle manual navigation
  const handleManualNav = (newIndex: number) => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentStopIndex(newIndex);
  };

  if (!currentStop) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col animate-in fade-in duration-500 font-sans">
      <style>{`
        @keyframes kenburns-tl-br {
          0% { transform: scale(1.35) translate(5%, 5%); }
          100% { transform: scale(1.25) translate(-3%, -3%); }
        }
        @keyframes kenburns-tr-bl {
          0% { transform: scale(1.35) translate(-5%, 5%); }
          100% { transform: scale(1.25) translate(3%, -3%); }
        }
        @keyframes kenburns-bl-tr {
          0% { transform: scale(1.35) translate(5%, -5%); }
          100% { transform: scale(1.25) translate(-3%, 3%); }
        }
        @keyframes kenburns-br-tl {
          0% { transform: scale(1.35) translate(-5%, -5%); }
          100% { transform: scale(1.25) translate(3%, 3%); }
        }
        .animate-kenburns-tl-br { animation: kenburns-tl-br 20s ease-out forwards; }
        .animate-kenburns-tr-bl { animation: kenburns-tr-bl 20s ease-out forwards; }
        .animate-kenburns-bl-tr { animation: kenburns-bl-tr 20s ease-out forwards; }
        .animate-kenburns-br-tl { animation: kenburns-br-tl 20s ease-out forwards; }
      `}</style>

      {/* Background Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          key={`bg-${currentStop.id}`}
          src={currentStop.image} 
          className="w-full h-full object-cover opacity-60 blur-md scale-105"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-slate-900/80"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex justify-between items-center text-white border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center shadow-lg">
              <Film size={20} />
           </div>
           <div>
              <h2 className="font-serif text-xl font-bold">{tour.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-300 uppercase tracking-widest font-bold">
                 <Sparkles size={10} className="text-brand-green" /> Guided Experience
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Visual Command Feedback */}
            {lastCommand && (
                <div className="mr-4 px-3 py-1 bg-white/20 rounded-full text-xs font-bold animate-in fade-in slide-in-from-top-2">
                    Command: "{lastCommand}"
                </div>
            )}

            {/* Voice Selection Dropdown */}
            <div className="flex items-center gap-2 mr-4 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
                <Settings2 size={14} className="text-slate-400" />
                <select 
                    className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer w-32 truncate"
                    value={selectedVoiceIndex}
                    onChange={(e) => {
                        window.speechSynthesis.cancel();
                        setSelectedVoiceIndex(Number(e.target.value));
                    }}
                >
                    {voices.map((voice, idx) => (
                        <option key={`${voice.name}-${idx}`} value={idx} className="text-slate-900">
                            {voice.name.replace('Microsoft ', '').replace('Google ', '')}
                        </option>
                    ))}
                    {voices.length === 0 && <option value={0}>System Voice</option>}
                </select>
            </div>

            {/* Voice Control Toggle */}
            <button 
                onClick={toggleListening}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border ${isListening ? 'bg-brand-purple text-white border-brand-purple' : 'bg-white/10 text-slate-300 border-white/20'}`}
                title={isListening ? "Listening for commands..." : "Enable Voice Control"}
            >
                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`}></div>
                <Command size={14} />
            </button>

            <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full transition-colors border ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}`}
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <div className="w-px h-8 bg-white/20 mx-2"></div>

            <button 
                onClick={() => {
                    if (recognitionRef.current) {
                        // Remove listener to prevent auto-restart logic from firing during close
                        recognitionRef.current.onend = null;
                        recognitionRef.current.stop();
                    }
                    window.speechSynthesis.cancel();
                    onClose();
                }}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors border border-white/20"
            >
                <X size={20} />
            </button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center p-4 md:p-12 gap-8 overflow-hidden">
        {/* Large Visual */}
        <div className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-3xl ring-4 ring-white/5 relative group">
           <img 
             key={currentStop.id}
             src={currentStop.image} 
             className={`w-full h-full object-cover ${getAnimationClass(currentStopIndex)}`}
             alt={currentStop.title}
           />
           <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom-4 duration-700">
                 <h3 className="text-white font-serif text-2xl font-bold mb-2">{currentStop.title}</h3>
                 <div className="flex gap-1">
                    {tour.stops.map((_, idx) => (
                        <div key={idx} className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx === currentStopIndex ? 'bg-brand-green' : idx < currentStopIndex ? 'bg-white/40' : 'bg-white/10'}`}></div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Narrative Panel */}
        <div className="w-full md:w-96 flex flex-col gap-6">
           <div className="bg-white p-8 rounded-2xl shadow-2xl relative animate-in slide-in-from-right-4 duration-700">
              <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${speaking ? 'bg-brand-green animate-pulse' : 'bg-brand-purple'}`}>
                <Mic size={20} className="text-white" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex justify-between">
                  <span>Agent Commentary</span>
                  {speaking && <span className="text-brand-green animate-pulse">Speaking...</span>}
              </p>
              <p className="text-slate-800 text-xl font-medium leading-relaxed italic font-serif">
                "{currentStop.description}"
              </p>
              
              {isListening && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-brand-purple uppercase tracking-widest flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand-purple rounded-full animate-ping"></div>
                        Voice Control Active
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Try saying "Next", "Back", "Pause"</p>
                </div>
              )}
           </div>

           <div className="flex gap-4">
              <Button 
                variant="outline" 
                disabled={currentStopIndex === 0}
                onClick={() => handleManualNav(currentStopIndex - 1)}
                className="flex-1 py-6 bg-white/10 border-white/20 text-white hover:bg-white hover:text-slate-900 rounded-xl"
              >
                <ChevronLeft className="mr-2" /> Previous
              </Button>
              <Button 
                variant="brand" 
                disabled={currentStopIndex === tour.stops.length - 1}
                onClick={() => handleManualNav(currentStopIndex + 1)}
                className="flex-1 py-6 rounded-xl shadow-glow"
              >
                Next Scene <ChevronRight className="ml-2" />
              </Button>
           </div>
           
           <Button 
             variant="ghost" 
             onClick={() => setIsPlaying(!isPlaying)}
             className="text-white/60 hover:text-white"
           >
             {isPlaying ? "Pause Tour" : "Resume Tour"}
           </Button>
        </div>
      </div>

      {/* Thumbnails Bar */}
      <div className="relative z-10 h-24 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 flex items-center px-8 gap-4 overflow-x-auto custom-scrollbar">
         {tour.stops.map((stop, idx) => (
           <button 
             key={stop.id}
             onClick={() => handleManualNav(idx)}
             className={`h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${idx === currentStopIndex ? 'border-brand-green scale-110 shadow-glow z-10' : 'border-transparent opacity-50 hover:opacity-100'}`}
           >
             <img src={stop.image} className="w-full h-full object-cover" alt="" />
           </button>
         ))}
      </div>
    </div>
  );
};
