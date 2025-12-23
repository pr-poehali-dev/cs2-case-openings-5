import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { getAllOpenings } from '@/lib/api';
import CurrencyIcon from '@/components/CurrencyIcon';
import Icon from '@/components/ui/icon';

interface Opening {
  id: number;
  case_id: string;
  item_id: string;
  case_name: string;
  item_name: string;
  image: string;
  price: number;
  rarity: string;
  opened_at: string;
  user_session: string;
}

export default function History() {
  const { siteSettings } = useStore();
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOpenings();
  }, []);

  const loadOpenings = async () => {
    try {
      setIsLoading(true);
      const data = await getAllOpenings(50);
      setOpenings(data);
    } catch (error) {
      console.error('Failed to load openings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      case 'rare':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'Легендарный';
      case 'rare':
        return 'Редкий';
      default:
        return 'Обычный';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (minutes > 0) return `${minutes} мин. назад`;
    return 'Только что';
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent mb-2">
            История открытий
          </h1>
          <p className="text-muted-foreground">
            Последние 50 выигрышей из кейсов
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" size={48} className="animate-spin text-game-orange" />
          </div>
        ) : openings.length === 0 ? (
          <Card className="p-12 text-center bg-card border-2 border-border">
            <Icon name="Package" size={64} className="mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Пока нет открытий</h3>
            <p className="text-muted-foreground">
              Открой первый кейс и стань первым в истории!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {openings.map((opening) => (
              <Card 
                key={opening.id}
                className="p-4 bg-card border-2 border-border hover:border-game-orange transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-lg bg-gradient-to-br ${getRarityColor(opening.rarity)} p-1 flex-shrink-0`}>
                    <div className="w-full h-full bg-card rounded flex items-center justify-center">
                      {opening.image.startsWith('data:image') ? (
                        <img src={opening.image} alt={opening.item_name} className="w-14 h-14 object-contain" />
                      ) : (
                        <span className="text-4xl">{opening.image}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold bg-gradient-to-r ${getRarityColor(opening.rarity)} text-white`}>
                        {getRarityLabel(opening.rarity)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(opening.opened_at)}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg truncate">{opening.item_name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      из кейса "{opening.case_name}"
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-game-orange flex items-center justify-end gap-1">
                      {opening.price}
                      <CurrencyIcon icon={siteSettings.currencyIcon} />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
