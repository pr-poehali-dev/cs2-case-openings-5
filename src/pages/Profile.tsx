import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

export default function Profile() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
        Профиль
      </h1>
      
      <Card className="p-8 bg-card border-2 border-border">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="w-24 h-24 border-4 border-game-orange">
            <AvatarFallback className="text-4xl bg-gradient-to-br from-game-orange to-game-pink">👤</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-3xl font-bold mb-2">Игрок #12345</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon name="Star" size={20} className="text-game-orange" />
              <span>Уровень: 15</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-game-orange/10 to-game-pink/10 border-game-orange">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Package" size={24} className="text-game-orange" />
              <span className="text-sm text-muted-foreground">Открыто кейсов</span>
            </div>
            <p className="text-3xl font-bold">47</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-game-purple/10 to-game-pink/10 border-game-purple">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="TrendingUp" size={24} className="text-game-purple" />
              <span className="text-sm text-muted-foreground">Выиграно</span>
            </div>
            <p className="text-3xl font-bold">125,000 ₽</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-game-pink/10 to-game-purple/10 border-game-pink">
            <div className="flex items-center gap-3 mb-2">
              <Icon name="Trophy" size={24} className="text-game-pink" />
              <span className="text-sm text-muted-foreground">Лучший дроп</span>
            </div>
            <p className="text-3xl font-bold">AWP 🔫</p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
