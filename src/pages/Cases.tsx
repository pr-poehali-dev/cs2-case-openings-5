import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Link } from 'react-router-dom';

export default function Cases() {
  const { cases, siteSettings } = useStore();

  return (
    <div className="container mx-auto px-4 py-8" style={{ fontFamily: siteSettings.font }}>
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
        Все кейсы
      </h1>
      
      {cases.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-xl text-muted-foreground">Пока нет доступных кейсов</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseItem) => (
            <Link key={caseItem.id} to={`/cases/${caseItem.id}`}>
              <Card className="bg-card border-2 border-border overflow-hidden hover:border-primary transition-all cursor-pointer group hover:scale-105 hover:shadow-xl">
                <div className="p-6">
                <div className="text-7xl text-center mb-4">
                  {caseItem.image.startsWith('data:') ? (
                    <img src={caseItem.image} alt={caseItem.name} className="w-28 h-28 mx-auto object-cover rounded-lg" />
                  ) : (
                    <span>{caseItem.image}</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-center mb-3">{caseItem.name}</h3>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Icon name="Coins" size={20} className="text-game-orange" />
                  <span className="text-xl font-semibold text-game-orange">{caseItem.price} ₽</span>
                </div>
                
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-muted-foreground">Содержит предметов:</span>
                    <Badge className="bg-gradient-to-r from-game-purple to-game-pink">
                      {caseItem.items.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {caseItem.items.slice(0, 5).map((item) => (
                      <div 
                        key={item.id}
                        className="aspect-square border-2 border-border rounded-lg flex items-center justify-center bg-gradient-to-br from-muted to-background overflow-hidden"
                      >
                        {item.image.startsWith('data:') ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{item.image}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button className="w-full mt-4 bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple">
                    Открыть кейс
                    <Icon name="ChevronRight" size={20} className="ml-2" />
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}