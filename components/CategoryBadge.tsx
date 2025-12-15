import { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'lg';
}

const categoryStyles: Record<Category, { bg: string; text: string; icon: string }> = {
  Recycle: { bg: 'bg-green-500', text: 'text-white', icon: '♻️' },
  Landfill: { bg: 'bg-gray-500', text: 'text-white', icon: '🗑️' },
  Compost: { bg: 'bg-amber-600', text: 'text-white', icon: '🌱' },
  Special: { bg: 'bg-orange-500', text: 'text-white', icon: '⚠️' },
};

export default function CategoryBadge({ category, size = 'lg' }: CategoryBadgeProps) {
  const style = categoryStyles[category];
  const sizeClasses = size === 'lg' 
    ? 'px-8 py-4 text-2xl rounded-xl' 
    : 'px-3 py-1 text-sm rounded-lg';

  return (
    <span className={`inline-flex items-center gap-2 font-bold ${style.bg} ${style.text} ${sizeClasses}`}>
      <span>{style.icon}</span>
      <span>{category}</span>
    </span>
  );
}
