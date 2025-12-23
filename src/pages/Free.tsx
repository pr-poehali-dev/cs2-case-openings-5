import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Free() {
  const [claimed, setClaimed] = useState(false);

  const claimBonus = () => {
    setClaimed(true);
    setTimeout(() => setClaimed(false), 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
        Халява
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 bg-gradient-to-br from-game-orange/20 to-game-pink/20 border-2 border-game-orange">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4 animate-float">🎁</div>
            <h2 className="text-2xl font-bold mb-2">Ежедневный бонус</h2>
            <p className="text-muted-foreground">Получай бесплатные монеты каждый день</p>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Icon name="Coins" size={32} className="text-game-orange" />
            <span className="text-4xl font-bold text-game-orange">+100</span>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple"
            size="lg"
            onClick={claimBonus}
            disabled={claimed}
          >
            {claimed ? 'Получено! ✓' : 'Забрать бонус'}
          </Button>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-game-purple/20 to-game-pink/20 border-2 border-game-purple">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4 animate-float">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Реферальная система</h2>
            <p className="text-muted-foreground">Приглашай друзей и получай бонусы</p>
          </div>
          <div className="bg-muted rounded-lg p-4 mb-4 font-mono text-center">
            <p className="text-sm text-muted-foreground mb-2">Твоя реферальная ссылка:</p>
            <p className="text-primary font-semibold">cs2cases.ru/ref/12345</p>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-game-purple to-game-pink hover:from-game-pink hover:to-game-purple"
            size="lg"
          >
            <Icon name="Copy" size={20} className="mr-2" />
            Скопировать ссылку
          </Button>
        </Card>

        <Card className="p-8 bg-gradient-to-br from-game-pink/20 to-game-purple/20 border-2 border-game-pink md:col-span-2">
          <div className="text-center mb-6">
            <div className="text-7xl mb-4">🎰</div>
            <h2 className="text-2xl font-bold mb-2">Колесо фортуны</h2>
            <p className="text-muted-foreground">Крути колесо и выигрывай призы!</p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="aspect-square bg-gradient-to-br from-game-orange via-game-pink to-game-purple rounded-full mb-6 flex items-center justify-center text-9xl animate-pulse">
              🎡
            </div>
            <Button 
              className="w-full bg-gradient-to-r from-game-pink to-game-purple hover:from-game-purple hover:to-game-orange"
              size="lg"
            >
              Крутить колесо (50 монет)
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
