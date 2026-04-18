import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArchiveEntry } from '../types';

export default function Archive() {
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/archive')
      .then(res => res.json())
      .then(data => {
        setArchives(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-32 px-6 md:px-12 bg-surface"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter">THE ARCHIVE</h1>
        <p className="text-secondary text-[10px] font-bold tracking-[0.3em] mb-16 uppercase">PAST DROPS & CONCEPTS</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-32 pb-32">
            {archives.map((entry, index) => (
              <motion.div 
                key={entry.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="flex-1 overflow-hidden group">
                  <img 
                    src={entry.imageUrl} 
                    alt={entry.title} 
                    className="w-full h-[60vh] object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 space-y-6">
                  <p className="text-tertiary text-[10px] font-black tracking-widest">{entry.season}</p>
                  <h2 className="text-4xl md:text-6xl font-black">{entry.title}</h2>
                  <p className="text-white/60 text-lg leading-relaxed max-w-md">{entry.description}</p>
                  <button className="btn-outline mt-8 hover:scale-105 transition-transform active:scale-95">VIEW LOOKBOOK</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
