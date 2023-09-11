import { useEffect, useRef, useState } from 'react';

import { motion } from 'framer-motion';

type ScrollFadeItemProps = {
  children: React.ReactNode;
};

const ScrollFadeItem = ({ children }: ScrollFadeItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length !== 1) {
          console.error('Unexpected length of entries ' + entries.length);
          return;
        }
        setIsVisible(entries[0].isIntersecting);
      },
      {
        threshold: 0.25
      }
    );
    if (!ref.current) {
      console.error('Target element is null!');
      return;
    }
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-48px)]" ref={ref}>
      <motion.div
        animate={{ opacity: isVisible ? 1 : 0.2, y: isVisible ? 0 : 50 }}
        className="flex-grow"
        transition={{ duration: 0.7 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ScrollFadeItem;
