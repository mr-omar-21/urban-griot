import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  X, 
  ShoppingBag, 
  Tag as TagIcon, 
  Archive as ArchiveIcon, 
  Settings, 
  HelpCircle,
  MessageCircle,
  Send,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ChatMessage } from './types';
import { GoogleGenAI } from "@google/genai";

import Home from './pages/Home';
import Archive from './pages/Archive';
import Stories from './pages/Stories';
import WelcomeScreen from './components/WelcomeScreen';

const drakeSong = new URL('../Drake - Whisper My Name.mp3', import.meta.url).href;



// --- Components ---

function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-8">
        <Link to="/">
          <h1 className="text-2xl font-display font-black tracking-tighter italic">URBAN GRIOT</h1>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-12 font-display text-sm tracking-widest font-bold">
        <Link to="/" className={`transition-colors hover:text-primary ${isActive('/') ? 'text-primary border-b-2 border-primary' : ''}`}>SHOP</Link>
        <Link to="/archive" className={`transition-colors hover:text-primary ${isActive('/archive') ? 'text-primary border-b-2 border-primary' : ''}`}>ARCHIVE</Link>
        <Link to="/stories" className={`transition-colors hover:text-primary ${isActive('/stories') ? 'text-primary border-b-2 border-primary' : ''}`}>STORIES</Link>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative group hover:scale-110 transition-transform">
          <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
          <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5">2</span>
        </button>
        <button className="hover:scale-110 transition-transform">
          <User className="w-6 h-6 hover:text-secondary transition-colors" />
        </button>
      </div>
    </nav>
  );
}

function Sidebar() {
  const categories = [
    { name: 'TEES', icon: <TagIcon className="w-4 h-4" /> },
    { name: 'HOODIES', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'TOTES', icon: <ArchiveIcon className="w-4 h-4" /> },
    { name: 'ARCHIVE', icon: <ArchiveIcon className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-20 bottom-0 w-64 bg-surface-low border-r border-white/5 p-8 z-40">
      <div className="mb-12">
        <p className="text-primary text-[10px] font-bold tracking-widest mb-4">STREET UTILITY</p>
        <h2 className="text-xl mb-8">CATEGORIES</h2>
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li key={cat.name} className={`flex items-center gap-4 cursor-pointer hover:text-primary transition-colors group ${cat.name === 'TEES' ? 'text-primary' : 'text-white/60'}`}>
              <span className="group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="font-display font-bold text-sm tracking-wide">{cat.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto space-y-6">
        <button className="btn-primary w-full text-xs hover:scale-105 transition-transform active:scale-95">NEW DROPS</button>
        <div className="flex gap-4 text-[10px] text-white/40 font-bold tracking-widest">
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <Settings className="w-3 h-3" /> SETTINGS
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <HelpCircle className="w-3 h-3" /> HELP
          </button>
        </div>
      </div>
    </aside>
  );
}

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Mambo! I'm the Griot AI. Ask me about our latest drops or the culture of Dar Es Salaam." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', content: userMsg }].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are 'The Griot', an AI assistant for Urban Griot, a street utility fashion brand from Dar Es Salaam, Tanzania. You are raw, brutalist, and deeply connected to Tanzanian urban culture. Use some Swahili words like 'Mambo', 'Poa', 'Sema', 'Street utility'. Be concise, edgy, and helpful."
        }
      });
      
      const aiResponse = response.text || "Something went wrong. The vibes are off.";
      setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "My connection to the streets is weak right now. Try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 md:w-96 glass border-white/10 flex flex-col overflow-hidden"
          >
            <div className="bg-primary p-4 flex justify-between items-center">
              <h3 className="text-black font-display font-black text-sm tracking-widest">GRIOT AI_v1.0</h3>
              <button onClick={() => setIsOpen(false)}><X className="text-black w-4 h-4 hover:scale-110 transition-transform" /></button>
            </div>
            
            <div ref={scrollRef} className="h-96 overflow-y-auto p-4 space-y-4 bg-black/40">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-secondary text-black' : 'bg-surface-high border border-white/10'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-surface-high p-3 text-xs flex items-center gap-2 border border-white/10">
                    <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-surface-low border-t border-white/5 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Talk to the Griot..."
                className="flex-1 bg-black/40 border-b border-white/20 px-3 py-2 text-[10px] focus:outline-none focus:border-primary transition-colors"
              />
              <button onClick={handleSend} className="bg-primary p-2 text-black hover:bg-primary-dim transition-colors hover:scale-105 active:scale-95">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-black flex items-center justify-center hover:bg-primary-dim transition-all active:scale-90 shadow-[0_0_20px_rgba(255,144,105,0.4)] hover:scale-110"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/stories" element={<Stories />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}


interface AudioPlayerProps {
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

function AudioPlayer({ 
  isPlaying, 
  isMuted, 
  togglePlay, 
  toggleMute, 
  currentTime, 
  duration,
  onSeek
}: AudioPlayerProps) {
  const progressBarRef = useRef<HTMLDivElement>(null);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercentage = clickX / width;
    const targetTime = clickPercentage * duration;
    onSeek(targetTime);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-8 left-8 lg:left-72 z-[90] glass border border-white/10 p-4 flex flex-col gap-2 w-72 md:w-80 shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4">
        {/* Equalizer Visualizer & Info */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-end gap-[3px] h-6 w-8 shrink-0">
            <span className={`w-[3px] bg-primary rounded-t-sm ${isPlaying ? 'animate-eq-1' : 'h-1'}`} style={{ transformOrigin: 'bottom' }} />
            <span className={`w-[3px] bg-primary rounded-t-sm ${isPlaying ? 'animate-eq-2' : 'h-2'}`} style={{ transformOrigin: 'bottom' }} />
            <span className={`w-[3px] bg-primary rounded-t-sm ${isPlaying ? 'animate-eq-3' : 'h-1.5'}`} style={{ transformOrigin: 'bottom' }} />
            <span className={`w-[3px] bg-primary rounded-t-sm ${isPlaying ? 'animate-eq-4' : 'h-2.5'}`} style={{ transformOrigin: 'bottom' }} />
            <span className={`w-[3px] bg-primary rounded-t-sm ${isPlaying ? 'animate-eq-5' : 'h-1'}`} style={{ transformOrigin: 'bottom' }} />
          </div>
          
          <div className="flex flex-col overflow-hidden">
            <span className="text-[9px] text-white/40 tracking-widest font-black uppercase font-display leading-none mb-1">STREET RADIO_v1</span>
            <div className="relative w-36 md:w-40 overflow-hidden h-4">
              <span className="absolute whitespace-nowrap text-xs font-display font-bold tracking-widest text-primary animate-[marquee_10s_linear_infinite]">
                DRAKE - WHISPER MY NAME &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; DRAKE - WHISPER MY NAME
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={toggleMute}
            className="p-2 hover:bg-white/5 text-white/70 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-secondary" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          <button 
            onClick={togglePlay}
            className="p-2.5 bg-primary text-black hover:bg-primary-dim transition-colors cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress & Time */}
      <div className="flex items-center justify-between text-[9px] font-bold text-white/40 tracking-wider mt-1 select-none">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Progress Bar Container */}
      <div 
        ref={progressBarRef}
        onClick={handleProgressBarClick}
        className="relative w-full h-[4px] bg-white/10 mt-1 cursor-pointer group"
      >
        <div 
          className="h-full bg-primary relative transition-all duration-100 ease-out" 
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        >
          {/* Glowing cursor dot on hover */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio play failed: ", err);
      });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio play failed: ", err);
      });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSeek = (targetTime: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <Router>
      <WelcomeScreen onEnter={handleEnter} />
      <audio ref={audioRef} src={drakeSong} preload="auto" loop />
      <div className="min-h-screen bg-surface selection:bg-primary selection:text-black">
        <Navbar />
        <Sidebar />
        
        <main className="lg:pl-64 pt-20">
          <AnimatedRoutes />
          
          {/* FOOTER */}
          <footer className="bg-surface-low py-12 px-6 md:px-12 mt-20 border-t border-white/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div>
                <h2 className="text-xl font-black mb-1">URBAN GRIOT</h2>
                <p className="text-[10px] text-white/40 tracking-widest">© 2024 URBAN GRIOT - DAR ES SALAAM</p>
              </div>
              
              <div className="flex gap-12 text-[10px] text-white/40 font-bold tracking-[0.2em]">
                <a href="#" className="hover:text-primary transition-colors">PRIVACY</a>
                <a href="#" className="hover:text-primary transition-colors">TERMS</a>
                <a href="#" className="hover:text-primary transition-colors">SHIPPING</a>
                <a href="#" className="hover:text-primary transition-colors">CONTACT</a>
              </div>

              <div className="flex gap-4">
                <span className="text-primary text-[10px] font-black tracking-widest cursor-pointer hover:text-white transition-colors">IG / TW / FB</span>
              </div>
            </div>
          </footer>
        </main>

        <ChatBot />

        {/* Dynamic global audio player shown after entering */}
        <AnimatePresence>
          {hasEntered && (
            <AudioPlayer 
              isPlaying={isPlaying}
              isMuted={isMuted}
              togglePlay={togglePlay}
              toggleMute={toggleMute}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

