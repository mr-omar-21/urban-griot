import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function WelcomeScreen() {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnter = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 1.5);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {
      console.warn("Audio not supported or blocked", e);
    }

    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1 } }}
          className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
        >
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-black font-display tracking-tighter mb-8"
          >
            URBAN GRIOT
          </motion.h1>
          <motion.button 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onClick={handleEnter}
            className="border border-primary text-primary px-12 py-4 text-xl tracking-[0.3em] font-display font-black hover:bg-primary hover:text-black transition-all duration-300"
          >
            ENTER THE STREETS
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
