import { useEffect, useState } from 'react';

import type { CollectionEntry } from 'astro:content';
import { AnimatePresence, motion } from 'framer-motion';

import TeamMemberCard from './TeamMemberCard';

type TeamPageContentProps = {
  team: CollectionEntry<'team'>[];
};

const TeamPageContent = ({ team }: TeamPageContentProps) => {
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const isModalOpen = modalIndex !== null;

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
  }, [modalIndex]);

  const closeOverlay = (event: React.MouseEvent) => {
    event.preventDefault();

    const data = (event.target as HTMLElement).getAttribute('data-value');
    if (data === 'parent') {
      setModalIndex(null);
    }
  };

  return (
    <div className="relative">
      <motion.div
        animate={
          isModalOpen
            ? { backgroundColor: 'rgb(0 0 0 / 0.7)', zIndex: 20 }
            : { backgroundColor: 'rgb(0 0 0 / 0)', transitionEnd: { zIndex: -10 } }
        }
        className="fixed inset-0 flex h-screen w-screen cursor-default items-center justify-center"
        data-value="parent"
        initial={false}
        role="button"
        tabIndex={0}
        transition={{ duration: 0.5 }}
        onClick={closeOverlay}
      >
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              animate={{ scale: 1 }}
              className="max-w-5xl rounded-lg border bg-slate-100 p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800"
              exit={{ scale: 0 }}
              initial={{ scale: 0 }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.23 }}
            >
              <div className="right-0 top-0 h-1/2 text-end text-3xl">
                <span
                  className="bg-slate-100 hover:opacity-25 dark:border-slate-700 dark:bg-slate-800"
                  data-value="parent"
                >
                  &times;
                </span>
              </div>
              <TeamMemberCard
                format="expanded"
                person={team[modalIndex].data}
                onClick={() => {
                  closeOverlay;
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <h2 className="pb-12 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">Meet Our Team</h2>
      <ul className="grid gap-8 lg:grid-cols-2">
        {team.map(({ data, id }, i) => {
          return (
            <motion.li
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 6 }}
              key={id}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <TeamMemberCard
                format="concise"
                person={data}
                onClick={() => {
                  setModalIndex(i);
                }}
              />
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
};

export default TeamPageContent;
