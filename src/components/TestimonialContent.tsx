import type { CollectionEntry } from 'astro:content';
import { motion } from 'framer-motion';

import TestimonialCard from './TestimonialCard';

type TestimonialContentProps = {
  testimonials: CollectionEntry<'testimonials'>[];
};
const tester = 0;
const TestimonialContent = ({ testimonials }: TestimonialContentProps) => {
  return (
    <div>
      <h2 className="pb-12 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
        Heres what others had to say
      </h2>
      <ul className="grid gap-8 lg:grid-cols-2">
        {testimonials.map(({ data, id }, i) => {
          return (
            <motion.li
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 6 }}
              key={id}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <TestimonialCard
                format="concise"
                person={data}
                onClick={() => {
                  tester = tester + 1;
                }}
              />
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default TestimonialContent;
