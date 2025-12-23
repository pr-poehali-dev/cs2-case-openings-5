import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import CurrencyIcon from '@/components/CurrencyIcon';

export default function Home() {
  const { cases, siteSettings } = useStore();

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: siteSettings.font }}>
      <div className="container mx-auto px-4 py-8">
        {siteSettings.banners?.filter(b => b.isActive).map((banner) => (
          <Card key={banner.id} className="mb-8 overflow-hidden border-2 border-primary">
            <div className="relative">
              {banner.image && (
                <div className="w-full h-48 overflow-hidden">
                  <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
                  {banner.title}
                </h2>
                <p className="text-lg text-muted-foreground">{banner.description}</p>
                {banner.link && (
                  <Button className="mt-4 bg-gradient-to-r from-game-orange to-game-pink" asChild>
                    <a href={banner.link} target="_blank" rel="noopener noreferrer">Подробнее</a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}

        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-game-orange via-game-pink to-game-purple bg-clip-text text-transparent animate-float">
            {siteSettings.title}
          </h1>
          <p className="text-xl text-muted-foreground">Открывай кейсы и выигрывай легендарные скины!</p>
        </div>

        {siteSettings.sections?.filter(s => s.isVisible).sort((a, b) => a.order - b.order).map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-game-purple to-game-pink bg-clip-text text-transparent">
              {section.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">{section.content}</p>
          </div>
        ))}

        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
            Доступные кейсы
          </h2>
          {cases.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-xl text-muted-foreground">Пока нет доступных кейсов. Добавьте их в админ-панели!</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <Link key={caseItem.id} to={`/cases/${caseItem.id}`}>
                  <Card 
                    className="bg-card border-2 border-border hover:border-primary transition-all cursor-pointer group hover:animate-glow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="text-8xl text-center mb-4 group-hover:scale-110 transition-transform overflow-hidden">
                        {caseItem.image.startsWith('data:') ? (
                          <img src={caseItem.image} alt={caseItem.name} className="w-32 h-32 mx-auto object-cover rounded-lg" />
                        ) : (
                          <span>{caseItem.image}</span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-center mb-2">{caseItem.name}</h3>
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="text-xl font-semibold text-game-orange">{caseItem.price}</span>
                        <CurrencyIcon size={24} className="text-game-orange" />
                      </div>
                      <Button className="w-full bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple">
                        Открыть кейс
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}