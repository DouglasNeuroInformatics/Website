import type { CollectionEntry } from 'astro:content';
import clsx from 'clsx';

type TestimonialCardProps = {
  format: 'expanded' | 'concise';
  person: CollectionEntry<'testimonials'>['data'];
  onClick: () => void;
};

const TestimonialCard = ({
  format,
  person: { fullName, image, suffix, position, quote },
  onClick
}: TestimonialCardProps) => {
  return (
    <button
      className={clsx(
        'grid grid-cols-3 gap-8 text-left',
        format === 'concise' && 'transition-transform duration-300 hover:scale-105'
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        <img alt={fullName} className="rounded-lg object-cover shadow-lg" src={image.src} />
      </div>
      <div className="col-span-2 space-y-1 text-lg font-medium leading-relaxed">
        <h3>{`${fullName}${suffix ? `, ${suffix}` : ''}`}</h3>
        <span className="text-sky-700 dark:text-sky-400">{position}</span>
        <p className="mt-1 line-clamp-3 text-base font-normal leading-tight text-slate-600 dark:text-slate-300">
          {quote}
        </p>
      </div>
    </button>
  );
};

export default TestimonialCard;
