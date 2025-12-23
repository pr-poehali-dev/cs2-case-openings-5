import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CaseItem {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: string;
}

interface CaseData {
  id: string;
  name: string;
  image: string;
  price: number;
  items: CaseItem[];
}

const mockCases: CaseData[] = [
  {
    id: '1',
    name: 'Легендарный кейс',
    image: '🔥',
    price: 500,
    items: [
      { id: '1-1', name: 'AWP | Dragon Lore', price: 10000, image: '🔫', rarity: 'legendary' },
      { id: '1-2', name: 'AK-47 | Fire Serpent', price: 5000, image: '🔫', rarity: 'rare' },
      { id: '1-3', name: 'M4A4 | Howl', price: 8000, image: '🔫', rarity: 'legendary' },
      { id: '1-4', name: 'Butterfly Knife', price: 15000, image: '🔪', rarity: 'legendary' },
      { id: '1-5', name: 'Glock | Fade', price: 2000, image: '🔫', rarity: 'common' },
    ]
  },
  {
    id: '2',
    name: 'Эпический кейс',
    image: '⚡',
    price: 300,
    items: [
      { id: '2-1', name: 'Desert Eagle | Blaze', price: 3000, image: '🔫', rarity: 'rare' },
      { id: '2-2', name: 'USP-S | Kill Confirmed', price: 2500, image: '🔫', rarity: 'rare' },
      { id: '2-3', name: 'MP9 | Bulldozer', price: 100, image: '🔫', rarity: 'common' },
      { id: '2-4', name: 'P250 | Asiimov', price: 500, image: '🔫', rarity: 'common' },
      { id: '2-5', name: 'Karambit | Fade', price: 12000, image: '🔪', rarity: 'legendary' },
    ]
  },
  {
    id: '3',
    name: 'Стартовый кейс',
    image: '💎',
    price: 100,
    items: [
      { id: '3-1', name: 'FAMAS | Djinn', price: 800, image: '🔫', rarity: 'common' },
      { id: '3-2', name: 'Galil | Chatterbox', price: 600, image: '🔫', rarity: 'common' },
      { id: '3-3', name: 'MAC-10 | Neon Rider', price: 400, image: '🔫', rarity: 'common' },
      { id: '3-4', name: 'Five-SeveN | Monkey', price: 200, image: '🔫', rarity: 'common' },
      { id: '3-5', name: 'M4A1-S | Cyrex', price: 1500, image: '🔫', rarity: 'rare' },
    ]
  },
];

export default function Home() {
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);

  const openCase = (caseData: CaseData) => {
    setSelectedCase(caseData);
    setIsOpening(true);
    setWonItem(null);

    setTimeout(() => {
      const randomItem = caseData.items[Math.floor(Math.random() * caseData.items.length)];
      setWonItem(randomItem);
      setIsOpening(false);
    }, 3000);
  };

  const closeModal = () => {
    setSelectedCase(null);
    setWonItem(null);
    setIsOpening(false);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-game-orange to-game-pink';
      case 'rare': return 'from-game-purple to-game-pink';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-game-orange via-game-pink to-game-purple bg-clip-text text-transparent animate-float">
            CS2 КЕЙСЫ
          </h1>
          <p className="text-xl text-muted-foreground">Открывай кейсы и выигрывай легендарные скины!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCases.map((caseItem) => (
            <Card 
              key={caseItem.id}
              className="bg-card border-2 border-border hover:border-primary transition-all cursor-pointer group hover:animate-glow overflow-hidden"
              onClick={() => openCase(caseItem)}
            >
              <div className="p-6">
                <div className="text-8xl text-center mb-4 group-hover:scale-110 transition-transform">
                  {caseItem.image}
                </div>
                <h3 className="text-2xl font-bold text-center mb-2">{caseItem.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Icon name="Coins" size={20} className="text-game-orange" />
                  <span className="text-xl font-semibold text-game-orange">{caseItem.price} ₽</span>
                </div>
                <Button className="w-full bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple">
                  Открыть кейс
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedCase && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-card border-2 border-primary max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">{selectedCase.name}</h2>
                <Button variant="ghost" onClick={closeModal}>
                  <Icon name="X" size={24} />
                </Button>
              </div>

              {isOpening && (
                <div className="mb-8">
                  <div className="relative h-48 bg-muted rounded-lg overflow-hidden border-2 border-primary">
                    <div className="absolute inset-0 flex animate-spin-slow">
                      {[...selectedCase.items, ...selectedCase.items, ...selectedCase.items].map((item, idx) => (
                        <div 
                          key={idx}
                          className={`min-w-[200px] h-full flex items-center justify-center border-r border-border bg-gradient-to-br ${getRarityColor(item.rarity)}`}
                        >
                          <div className="text-6xl">{item.image}</div>
                        </div>
                      ))}
                    </div>
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-game-orange z-10 shadow-lg shadow-game-orange"></div>
                  </div>
                  <p className="text-center text-xl font-semibold mt-4 animate-pulse">Открытие...</p>
                </div>
              )}

              {wonItem && (
                <div className="mb-8 text-center">
                  <div className={`inline-block p-8 rounded-lg bg-gradient-to-br ${getRarityColor(wonItem.rarity)} animate-glow`}>
                    <div className="text-9xl mb-4">{wonItem.image}</div>
                    <h3 className="text-3xl font-bold text-white mb-2">{wonItem.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <Icon name="TrendingUp" size={24} className="text-white" />
                      <span className="text-2xl font-bold text-white">{wonItem.price} ₽</span>
                    </div>
                  </div>
                  <Button 
                    className="mt-6 bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple"
                    size="lg"
                    onClick={closeModal}
                  >
                    Отлично!
                  </Button>
                </div>
              )}

              {!isOpening && !wonItem && (
                <>
                  <h3 className="text-xl font-semibold mb-4">Содержимое кейса:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    {selectedCase.items.map((item) => (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-lg bg-gradient-to-br ${getRarityColor(item.rarity)} border border-white/20`}
                      >
                        <div className="text-5xl text-center mb-2">{item.image}</div>
                        <p className="text-sm font-semibold text-white text-center">{item.name}</p>
                        <p className="text-xs text-white/80 text-center">{item.price} ₽</p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple"
                    size="lg"
                    onClick={() => openCase(selectedCase)}
                  >
                    Открыть за {selectedCase.price} ₽
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
