import { Card } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function Free() {
  const { banners, sections } = useStore();
  
  const freeBanners = banners.filter(b => b.isVisible && b.link === '/free');
  const freeSections = sections.filter(s => s.isVisible);

  const isEmpty = freeBanners.length === 0 && freeSections.length === 0;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
          Халява
        </h1>
        
        <Card className="p-16 text-center bg-card/50">
          <div className="text-8xl mb-6 opacity-50">🎁</div>
          <h2 className="text-2xl font-bold mb-4 text-muted-foreground">
            Здесь пока ничего нет
          </h2>
          <p className="text-muted-foreground mb-8">
            Раздел халявы пустой. Добавьте контент через админ-панель.
          </p>
          <div className="max-w-md mx-auto text-left bg-muted/50 rounded-lg p-6">
            <p className="font-semibold mb-3">📝 Как добавить контент:</p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Зайдите в админ-панель (раздел /admin)</li>
              <li>Перейдите в "Баннеры" и создайте баннер с ссылкой <code className="bg-muted px-2 py-1 rounded text-xs">/free</code></li>
              <li>Или создайте раздел с предметами в "Разделы"</li>
              <li>Включите видимость и сохраните изменения</li>
            </ol>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
        Халява
      </h1>

      {freeBanners.length > 0 && (
        <div className="space-y-4 mb-8">
          {freeBanners.map((banner) => (
            <Card 
              key={banner.id} 
              className="overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <div className="relative h-48 md:h-64">
                {banner.image.startsWith('data:') ? (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-9xl bg-gradient-to-br from-game-orange/20 to-game-pink/20">
                    {banner.image}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">{banner.title}</h2>
                  <p className="text-white/90 mb-4">{banner.description}</p>
                  <Button
                    className="w-fit bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple"
                  >
                    {banner.buttonText || 'Забрать'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {freeSections.length > 0 && (
        <div className="space-y-8">
          {freeSections.map((section) => (
            <div key={section.id}>
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.items.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="text-6xl mb-2 text-center">
                      {item.image.startsWith('data:') ? (
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-32 object-cover rounded"
                        />
                      ) : (
                        <span>{item.image}</span>
                      )}
                    </div>
                    <p className="text-center font-semibold">{item.label}</p>
                    {item.link && (
                      <Button
                        className="w-full mt-2 bg-gradient-to-r from-game-orange to-game-pink"
                        size="sm"
                      >
                        Получить
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}