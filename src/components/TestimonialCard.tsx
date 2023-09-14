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
      <div>
        <p>{fullName}</p>
        <p>{quote}</p>
        <p>{position}</p>
        <p>{suffix}</p>
        <img alt={fullName} className="rounded-lg object-cover shadow-lg" src={image.src} />
      </div>
    </button>
  );
};

export default TestimonialCard;
