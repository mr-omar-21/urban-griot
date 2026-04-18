import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { StoryEntry } from '../types';

export default function Stories() {
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stories')
      .then(res => res.json())
      .then(data => {
        setStories(data);
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
        <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter">STORIES</h1>
        <p className="text-secondary text-[10px] font-bold tracking-[0.3em] mb-16 uppercase">CULTURE & CONTEXT</p>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-32">
            {stories.map((story, index) => (
              <motion.article 
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="overflow-hidden mb-6 aspect-video relative">
                  <img 
                    src={story.imageUrl} 
                    alt={story.title} 
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                </div>
                <div className="space-y-4">
                  <p className="text-primary text-[10px] font-black tracking-widest">{story.date}</p>
                  <h2 className="text-3xl font-black group-hover:text-primary transition-colors">{story.title}</h2>
                  <p className="text-white/60 leading-relaxed line-clamp-3">{story.excerpt}</p>
                  <button className="text-[10px] font-bold tracking-widest border-b border-primary text-primary pb-1 group-hover:text-white group-hover:border-white transition-colors">
                    READ MORE
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
