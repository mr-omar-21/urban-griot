import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleEnter = () => {
    onEnter();
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
            className="text-5xl md:text-8xl font-black font-display tracking-tighter mb-8"
          >
            URBAN GRIOTs
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

