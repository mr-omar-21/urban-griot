import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, VaultEntry } from '../types';
import { MOCK_PRODUCTS, MOCK_VAULT } from '../constants';
import { Link } from 'react-router-dom';

export default function Home() {
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
            className="text-8xl md:text-9xl font-black mb-4 leading-[0.85]"
          >
            URBAN <br />
            <span className="text-transparent border-text stroke-primary" style={{ WebkitTextStroke: '2px #ff9069' }}>GRIOTS</span>
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
            <button className="btn-primary hover:scale-105 transition-transform">EXPLORE COLLECTION</button>
            <Link to="/archive" className="btn-outline hover:scale-105 transition-transform inline-block">THE ARCHIVE</Link>
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
                  className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-105 transition-all duration-700"
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

              <button className="flex items-center justify-center w-12 h-12 bg-white text-black hover:bg-primary transition-colors ml-auto group hover:scale-110 active:scale-95">
                <ShoppingCart className="w-5 h-5 group-hover:scale-110" />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <section className="py-32 px-6 md:px-12 bg-surface flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} referrerPolicy="no-referrer" src="https://picsum.photos/seed/m1/600/600?grayscale" className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0" />
          <div className="space-y-4">
            <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} referrerPolicy="no-referrer" src="https://picsum.photos/seed/m2/600/300?grayscale" className="w-full h-[40%] object-cover grayscale opacity-40 translate-y-8 hover:opacity-100 hover:grayscale-0" />
            <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} referrerPolicy="no-referrer" src="https://picsum.photos/seed/m3/600/600?grayscale" className="w-full h-[60%] object-cover grayscale opacity-60 hover:opacity-100 hover:grayscale-0" />
          </div>
        </div>

        <div className="flex-1 max-w-xl">
          <p className="text-tertiary text-[10px] font-bold tracking-[0.4em] mb-6 uppercase">MANIFESTO</p>
          <h2 className="text-6xl md:text-8xl mb-8 leading-[0.9]">THE FUSION OF <br /> <span className="text-secondary">CONCRETE & CLOTH</span></h2>
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
                className="w-full h-full object-cover grayscale hover:grayscale-0 contrast-125 transition-all duration-500 hover:scale-110"
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
          <button className="border border-white/20 px-12 py-6 text-xl font-display font-black tracking-[0.3em] hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95">
            JOIN THE MOVEMENT
          </button>
        </div>
      </section>
    </motion.div>
  );
}
