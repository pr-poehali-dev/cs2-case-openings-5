import { useStore } from '@/lib/store';

interface CurrencyIconProps {
  size?: number;
  className?: string;
}

export default function CurrencyIcon({ size = 20, className = '' }: CurrencyIconProps) {
  const { siteSettings } = useStore();

  if (siteSettings.currencyIcon) {
    return (
      <img 
        src={siteSettings.currencyIcon} 
        alt="Валюта" 
        style={{ width: size, height: size }}
        className={`inline-block object-contain ${className}`}
      />
    );
  }

  return <span className={className}>₽</span>;
}
