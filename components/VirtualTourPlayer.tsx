
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Film, Sparkles, X, Volume2, VolumeX, ChevronLeft, ChevronRight, Mic, Settings2, Command, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { VirtualTour, VoicePreset } from '../types';
import {
  synthesizeSpeech,
  VOICE_OPTIONS,
  getCachedAudio,
  setCachedAudio,
  createAudioFromBase64
} from '../services/ttsService';

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
  const [selectedVoice, setSelectedVoice] = useState<VoicePreset>(tour.voicePreset || 'OLIVIA');
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);

  // STT (Listening/Command) State
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);

  const currentStop = tour.stops[currentStopIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  // Initialize Voice Recognition (STT - "System Whisper")
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

  // Handle Voice Commands
  const handleVoiceCommand = useCallback((command: string) => {
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
      if (audioRef.current) audioRef.current.pause();
    } else if (command.includes('play') || command.includes('resume') || command.includes('start')) {
      setIsPlaying(true);
      if (audioRef.current) audioRef.current.play();
    } else if (command.includes('mute') || command.includes('quiet') || command.includes('silent')) {
      setIsMuted(true);
    } else if (command.includes('unmute') || command.includes('speak') || command.includes('loud')) {
      setIsMuted(false);
    } else if (command.includes('james') || command.includes('male')) {
      setSelectedVoice('JAMES');
    } else if (command.includes('olivia') || command.includes('female')) {
      setSelectedVoice('OLIVIA');
    } else if (command.includes('close') || command.includes('exit')) {
      onClose();
    }
  }, [currentStopIndex, tour.stops.length, onClose]);

  // Handle TTS Playback - prioritize pre-stored audio
  useEffect(() => {
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!currentStop) return;
    if (isMuted || !isPlaying) {
      setSpeaking(false);
      return;
    }

    const playTTS = async () => {
      setLoading(true);
      setSpeaking(false);

      try {
        let audio: HTMLAudioElement;

        // Priority 1: Use pre-generated audio stored with the tour stop
        if (currentStop.audioUrl) {
          audio = new Audio(currentStop.audioUrl);
        }
        // Priority 2: Check in-memory cache (for voice changes during playback)
        else {
          const text = currentStop.description;
          let audioBase64 = getCachedAudio(text, selectedVoice);

          if (!audioBase64) {
            // Priority 3: Fetch from Google Cloud TTS (only if no pre-stored audio)
            const response = await synthesizeSpeech(text, selectedVoice);
            audioBase64 = response.audioContent;
            setCachedAudio(text, selectedVoice, audioBase64);
          }

          audio = createAudioFromBase64(audioBase64);
        }

        audioRef.current = audio;

        audio.onplay = () => {
          setLoading(false);
          setSpeaking(true);
        };

        audio.onended = () => {
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

        audio.onerror = (e) => {
          console.error("Audio playback error", e);
          setLoading(false);
          setSpeaking(false);
          // Try browser TTS as last resort
          fallbackToBrowserTTS(currentStop.description);
        };

        await audio.play();
      } catch (error) {
        console.error("TTS playback failed, falling back to browser TTS", error);
        setLoading(false);
        fallbackToBrowserTTS(currentStop.description);
      }
    };

    playTTS();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentStopIndex, selectedVoice, isPlaying, isMuted, currentStop, tour.stops.length]);

  // Fallback browser TTS
  const fallbackToBrowserTTS = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.95;

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
        }, 2000);
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle manual navigation
  const handleManualNav = (newIndex: number) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentStopIndex(newIndex);
  };

  if (!currentStop) return null;

  const voiceInfo = VOICE_OPTIONS[selectedVoice];

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
              <Sparkles size={10} className="text-brand-green" /> Premium Voice Experience
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

          {/* Voice Selection Dropdown - Now with Premium Voices */}
          <div className="flex items-center gap-2 mr-4 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
            <Settings2 size={14} className="text-slate-400" />
            <select
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer w-40 truncate"
              value={selectedVoice}
              onChange={(e) => {
                if (audioRef.current) audioRef.current.pause();
                setSelectedVoice(e.target.value as VoicePreset);
              }}
            >
              <option value="OLIVIA" className="text-slate-900">
                🎙️ Olivia (Warm Female)
              </option>
              <option value="JAMES" className="text-slate-900">
                🎙️ James (Warm Male)
              </option>
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
              if (audioRef.current) audioRef.current.pause();
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
            <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors ${loading ? 'bg-amber-500 animate-pulse' : speaking ? 'bg-brand-green animate-pulse' : 'bg-brand-purple'}`}>
              {loading ? <Loader2 size={20} className="text-white animate-spin" /> : <Mic size={20} className="text-white" />}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex justify-between">
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${selectedVoice === 'OLIVIA' ? 'bg-pink-400' : 'bg-blue-400'}`}></span>
                {voiceInfo.displayName} • {voiceInfo.description}
              </span>
              {loading && <span className="text-amber-500 animate-pulse">Loading...</span>}
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
                <p className="text-xs text-slate-500 mt-1">Try: "Next", "Back", "Pause", "James", "Olivia"</p>
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
