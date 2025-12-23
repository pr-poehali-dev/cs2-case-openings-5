import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const mockInventory = [
  { id: '1', name: 'AWP | Dragon Lore', image: '🔫', rarity: 'legendary', price: 10000 },
  { id: '2', name: 'Karambit | Fade', image: '🔪', rarity: 'legendary', price: 12000 },
  { id: '3', name: 'AK-47 | Fire Serpent', image: '🔫', rarity: 'rare', price: 5000 },
  { id: '4', name: 'Desert Eagle | Blaze', image: '🔫', rarity: 'rare', price: 3000 },
  { id: '5', name: 'M4A1-S | Cyrex', image: '🔫', rarity: 'common', price: 1500 },
  { id: '6', name: 'Glock | Fade', image: '🔫', rarity: 'common', price: 2000 },
];

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'from-game-orange to-game-pink';
    case 'rare': return 'from-game-purple to-game-pink';
    default: return 'from-blue-500 to-cyan-500';
  }
};

const getRarityLabel = (rarity: string) => {
  switch (rarity) {
    case 'legendary': return 'Легендарное';
    case 'rare': return 'Редкое';
    default: return 'Обычное';
  }
};

export default function Inventory() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
        Инвентарь
      </h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mockInventory.map((item) => (
          <Card 
            key={item.id}
            className={`p-4 bg-gradient-to-br ${getRarityColor(item.rarity)} border-2 border-white/20 hover:scale-105 transition-transform cursor-pointer`}
          >
            <div className="text-6xl text-center mb-3">{item.image}</div>
            <Badge className="mb-2 bg-black/50 text-white border-0">{getRarityLabel(item.rarity)}</Badge>
            <p className="text-sm font-semibold text-white mb-1">{item.name}</p>
            <p className="text-lg font-bold text-white">{item.price} ₽</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
