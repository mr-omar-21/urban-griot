import { useState, useEffect, useRef } from 'react';
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
  Loader2
} from 'lucide-react';
import { ChatMessage } from './types';
import { GoogleGenAI } from "@google/genai";

import Home from './pages/Home';
import Archive from './pages/Archive';
import Stories from './pages/Stories';
import WelcomeScreen from './components/WelcomeScreen';

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
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/stories" element={<Stories />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <WelcomeScreen />
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
      </div>
    </Router>
  );
}
