import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  ArrowRight, 
  MapPin, 
  ShoppingBag, 
  Tag as TagIcon, 
  Archive, 
  Settings, 
  HelpCircle,
  MessageCircle,
  Send,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { collection, query, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Product, VaultEntry, ChatMessage } from './types';
import { MOCK_PRODUCTS, MOCK_VAULT } from './constants';
import { GoogleGenAI } from "@google/genai";

// --- Components ---

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 glass z-50 flex items-center justify-between px-6 md:px-12">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-display font-black tracking-tighter italic">URBAN GRIOT</h1>
      </div>
      
      <div className="hidden md:flex items-center gap-12 font-display text-sm tracking-widest font-bold">
        <a href="#shop" className="hover:text-primary transition-colors border-b-2 border-primary">SHOP</a>
        <a href="#archive" className="hover:text-primary transition-colors">ARCHIVE</a>
        <a href="#stories" className="hover:text-primary transition-colors">STORIES</a>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative group">
          <ShoppingCart className="w-6 h-6 group-hover:text-primary transition-colors" />
          <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold px-1.5 py-0.5">2</span>
        </button>
        <button>
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
    { name: 'TOTES', icon: <Archive className="w-4 h-4" /> },
    { name: 'ARCHIVE', icon: <Archive className="w-4 h-4" /> },
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
        <button className="btn-primary w-full text-xs">NEW DROPS</button>
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
              <button onClick={() => setIsOpen(false)}><X className="text-black w-4 h-4" /></button>
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
              <button onClick={handleSend} className="bg-primary p-2 text-black hover:bg-primary-dim transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-black flex items-center justify-center hover:bg-primary-dim transition-all active:scale-90 shadow-[0_0_20px_rgba(255,144,105,0.4)]"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [vault, setVault] = useState<VaultEntry[]>(MOCK_VAULT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt real-time fetch from Firebase
    const qProducts = query(collection(db, 'products'), orderBy('sku'));
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      if (!snapshot.empty) {
        setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      }
      setLoading(false);
    }, (error) => {
      console.warn("Firestore not populated yet, using mock data", error);
      setLoading(false);
    });

    const qVault = query(collection(db, 'vault'));
    const unsubscribeVault = onSnapshot(qVault, (snapshot) => {
      if (!snapshot.empty) {
        setVault(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VaultEntry)));
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeVault();
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface selection:bg-primary selection:text-black">
      <Navbar />
      <Sidebar />
      
      <main className="lg:pl-64 pt-20">
        {/* HERO SECTION */}
        <section className="relative h-[80vh] flex items-center px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <img 
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/urbanhero/1920/1080?grayscale" 
              className="w-full h-full object-cover"
              alt="Urban Context"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/40 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-4 inline-block bg-tertiary px-3 py-1 text-[10px] font-black tracking-widest text-black"
            >
              NEW DROP: KITENGE X GRAFFITI
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-7xl md:text-9xl font-black mb-4 leading-[0.85]"
            >
              URBAN <br/>
              <span className="text-transparent border-text stroke-primary" style={{ WebkitTextStroke: '2px #ff9069' }}>GRIOT</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/60 mb-8 border-l-4 border-secondary pl-6 max-w-md"
            >
              Rewriting the Tanzanian narrative through the lens of concrete, kitenge, and the culture of the streets.
            </motion.p>
            <div className="flex gap-4">
              <button className="btn-primary">EXPLORE COLLECTION</button>
              <button className="btn-outline">THE ARCHIVE</button>
            </div>
          </div>

          <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 hidden xl:block">
            <p className="text-[120px] font-black opacity-5 select-none leading-none tracking-tighter">LIMITED EDITION DROP 04</p>
          </div>
        </section>

        {/* SHOP SECTION */}
        <section id="shop" className="py-24 px-6 md:px-12 bg-black">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <p className="text-secondary text-[10px] font-bold tracking-[0.3em] mb-4">SEASON 04</p>
              <h2 className="text-5xl md:text-7xl">THE DROP</h2>
            </div>
            <div className="flex gap-4 font-display text-[10px] font-black tracking-widest">
              <span>UTILITY</span> / <span>STREET</span> / <span>ART</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 border-t border-l border-white/5">
            {products.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border-r border-b border-white/5 card-brutal p-8 hover:bg-surface-low transition-all"
              >
                <div className="relative aspect-[4/5] mb-8 overflow-hidden">
                  <img 
                    referrerPolicy="no-referrer"
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                  {product.stockStatus === 'SOLD_OUT' && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                      <p className="font-display font-black text-6xl -rotate-12 opacity-50 tracking-tighter">SOLD OUT</p>
                    </div>
                  )}
                  {product.isLimited && (
                    <div className="absolute top-0 right-0 p-4">
                      <span className="bg-tertiary text-black text-[10px] font-black px-2 py-1 rotate-90 transform origin-right">DROP_04</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl max-w-[70%]">{product.name}</h3>
                  <p className="text-primary text-xl font-display font-black">${product.price}</p>
                </div>
                <p className="text-[10px] text-white/40 mb-6 font-mono tracking-widest">SKU: {product.sku}</p>
                
                <button className="flex items-center justify-center w-12 h-12 bg-white text-black hover:bg-primary transition-colors ml-auto group">
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110" />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MANIFESTO SECTION */}
        <section className="py-32 px-6 md:px-12 bg-surface flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <img referrerPolicy="no-referrer" src="https://picsum.photos/seed/m1/600/600?grayscale" className="w-full h-full object-cover grayscale opacity-60" />
            <div className="space-y-4">
              <img referrerPolicy="no-referrer" src="https://picsum.photos/seed/m2/600/300?grayscale" className="w-full h-[40%] object-cover grayscale opacity-40 translate-y-8" />
              <img referrerPolicy="no-referrer" src="https://picsum.photos/seed/m3/600/600?grayscale" className="w-full h-[60%] object-cover grayscale opacity-60" />
            </div>
          </div>
          
          <div className="flex-1 max-w-xl">
            <p className="text-tertiary text-[10px] font-bold tracking-[0.4em] mb-6 uppercase">MANIFESTO</p>
            <h2 className="text-6xl md:text-8xl mb-8 leading-[0.9]">THE FUSION OF <br/> <span className="text-secondary">CONCRETE & CLOTH</span></h2>
            <div className="space-y-6 text-white/60 leading-relax">
              <p>In the heart of Dar Es Salaam, the stories aren't just told—they are painted on the walls and woven into the fabric. Urban Griot is the nexus where ancestral Kitenge geometry meets the raw energy of street graffiti.</p>
              <p>We don't create fashion. We document the evolution of a city in motion.</p>
            </div>
            
            <div className="mt-12 p-8 bg-surface-high border-l-4 border-primary italic text-white/80">
              "We don't just sell clothes; we document the evolution of the city's spirit."
              <p className="mt-4 not-italic font-display text-primary text-sm font-bold">— MSANII X, Lead Designer</p>
            </div>
          </div>
        </section>

        {/* THE VAULT (Community Section) */}
        <section className="py-24 px-6 md:px-12 bg-black overflow-hidden">
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-5xl md:text-7xl">THE VAULT</h2>
            <span className="hidden md:inline-block bg-secondary text-black text-[10px] font-black px-3 py-1 tracking-widest">COMMUNITY AUTHENTICATED</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {vault.map((entry, i) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative group aspect-square overflow-hidden"
              >
                <img 
                  referrerPolicy="no-referrer"
                  src={entry.imageUrl} 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-125 transition-all duration-500"
                  alt="Vault Entry"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 bg-surface/80 backdrop-blur-md transition-transform flex items-center justify-between">
                  <span className="text-[10px] font-black font-display tracking-widest">{entry.handle}</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button className="border border-white/20 px-12 py-6 text-xl font-display font-black tracking-[0.3em] hover:bg-white hover:text-black transition-all">
              JOIN THE MOVEMENT
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-surface-low py-12 px-6 md:px-12 mt-20 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div>
              <h2 className="text-xl font-black mb-1">URBAN GRIOT</h2>
              <p className="text-[10px] text-white/40 tracking-widest">© 2024 URBAN GRIOT - DAR ES SALAAM</p>
            </div>
            
            <div className="flex gap-12 text-[10px] text-white/40 font-bold tracking-[0.2em]">
              <a href="#" className="hover:text-primary">PRIVACY</a>
              <a href="#" className="hover:text-primary">TERMS</a>
              <a href="#" className="hover:text-primary">SHIPPING</a>
              <a href="#" className="hover:text-primary">CONTACT</a>
            </div>

            <div className="flex gap-4">
              <span className="text-primary text-[10px] font-black tracking-widest">IG / TW / FB</span>
            </div>
          </div>
        </footer>
      </main>

      <ChatBot />
    </div>
  );
}
