import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useStore, CaseItem } from '@/lib/store';
import CurrencyIcon from '@/components/CurrencyIcon';

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cases, siteSettings, recordCaseOpening, loadCaseItems } = useStore();
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<CaseItem | null>(null);
  const [canOpen, setCanOpen] = useState(false);

  const caseData = cases.find((c) => c.id === id);

  // Загружаем items если они пустые
  useEffect(() => {
    if (caseData && caseData.items.length === 0) {
      loadCaseItems(caseData.id);
    }
  }, [caseData, loadCaseItems]);

  useEffect(() => {
    if (!caseData) {
      navigate('/cases');
      return;
    }

    const checkCanOpen = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');
      const openParam = urlParams.get('open');
      
      // Проверяем, открывал ли пользователь этот кейс с ЭТОЙ КОНКРЕТНОЙ промо-ссылкой
      const storageKey = refParam ? `opened_ref_${refParam}_case_${id}` : `opened_case_${id}`;
      const hasOpenedBefore = localStorage.getItem(storageKey) === 'true';
      
      // Разрешаем открыть только если есть ref/open параметр И еще не открывали с этим параметром
      if ((refParam || openParam) && !hasOpenedBefore) {
        setCanOpen(true);
      } else {
        setCanOpen(false);
      }
    };
    
    checkCanOpen();
    
    // Проверяем каждую секунду, не изменилось ли состояние
    const interval = setInterval(checkCanOpen, 1000);
    return () => clearInterval(interval);
  }, [caseData, navigate, id]);

  if (!caseData) {
    return null;
  }

  const openCase = async () => {
    if (!canOpen) {
      alert('Чтобы открыть кейс, перейдите по специальной ссылке!');
      return;
    }

    if (!caseData.items || caseData.items.length === 0) {
      alert('В этом кейсе нет предметов!');
      return;
    }

    setIsOpening(true);
    setWonItem(null);

    setTimeout(async () => {
      const randomItem = caseData.items[Math.floor(Math.random() * caseData.items.length)];
      setWonItem(randomItem);
      setIsOpening(false);
      
      // Сохраняем, что пользователь открыл кейс с ЭТОЙ КОНКРЕТНОЙ промо-ссылкой
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');
      const storageKey = refParam ? `opened_ref_${refParam}_case_${id}` : `opened_case_${id}`;
      localStorage.setItem(storageKey, 'true');
      
      // Блокируем повторное открытие по этой же ссылке
      setCanOpen(false);
      
      await recordCaseOpening(caseData.id, randomItem.id);
    }, 3000);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-game-orange to-game-pink';
      case 'rare':
        return 'from-game-purple to-game-pink';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'Легендарное';
      case 'rare':
        return 'Редкое';
      default:
        return 'Обычное';
    }
  };

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: siteSettings.font }}>
      <div className="container mx-auto px-4 py-8">
        <Link to="/cases">
          <Button variant="outline" className="mb-6">
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад к кейсам
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border-2 border-border sticky top-24">
              <div className="text-center">
                <div className="text-9xl mb-6">
                  {caseData.image.startsWith('data:') ? (
                    <img
                      src={caseData.image}
                      alt={caseData.name}
                      className="w-48 h-48 mx-auto object-cover rounded-lg"
                    />
                  ) : (
                    <span>{caseData.image}</span>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
                  {caseData.name}
                </h1>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <span className="text-3xl font-bold text-game-orange">{caseData.price}</span>
                  <CurrencyIcon size={24} className="text-game-orange" />
                </div>
                {!canOpen ? (
                  <div>
                    <Button
                      disabled
                      className="w-full bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed"
                      size="lg"
                    >
                      <Icon name="Lock" size={20} className="mr-2" />
                      Кейс заблокирован
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                      Для открытия кейса перейдите по специальной ссылке
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Пример: /cases/{id}?ref=promo или /cases/{id}?open=true
                    </p>
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={openCase}
                      disabled={isOpening || caseData.items.length === 0}
                      className="w-full bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple"
                      size="lg"
                    >
                      {isOpening ? 'Открытие...' : (
                        <span className="flex items-center justify-center gap-2">
                          Открыть за {caseData.price} <CurrencyIcon size={20} />
                        </span>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                      Содержит {caseData.items.length} {caseData.items.length === 1 ? 'предмет' : 'предметов'}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {isOpening && (
              <Card className="mb-8 overflow-hidden border-2 border-primary">
                <div className="relative h-64 bg-muted">
                  <div className="absolute inset-0 flex animate-spin-slow">
                    {[...caseData.items, ...caseData.items, ...caseData.items].map((item, idx) => (
                      <div
                        key={idx}
                        className={`min-w-[250px] h-full flex flex-col items-center justify-center border-r border-border bg-gradient-to-br ${getRarityColor(
                          item.rarity
                        )}`}
                      >
                        <div className="text-8xl mb-2">
                          {item.image.startsWith('data:') ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-32 h-32 object-cover rounded"
                            />
                          ) : (
                            <span>{item.image}</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                      </div>
                    ))}
                  </div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-game-orange z-10 shadow-lg shadow-game-orange"></div>
                </div>
                <div className="p-4 text-center">
                  <p className="text-xl font-semibold animate-pulse">Открытие кейса...</p>
                </div>
              </Card>
            )}

            {wonItem && (
              <Card className="mb-8 border-2 border-primary animate-glow">
                <div className={`p-8 text-center bg-gradient-to-br ${getRarityColor(wonItem.rarity)}`}>
                  <h2 className="text-3xl font-bold text-white mb-6">🎉 Вы выиграли!</h2>
                  <div className="text-9xl mb-4">
                    {wonItem.image.startsWith('data:') ? (
                      <img
                        src={wonItem.image}
                        alt={wonItem.name}
                        className="w-48 h-48 mx-auto object-cover rounded-lg"
                      />
                    ) : (
                      <span>{wonItem.image}</span>
                    )}
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{wonItem.name}</h3>
                  <p className="text-xl text-white/80 mb-4">{getRarityLabel(wonItem.rarity)}</p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Icon name="TrendingUp" size={28} className="text-white" />
                    <span className="text-3xl font-bold text-white">{wonItem.price}</span>
                    <CurrencyIcon size={28} className="text-white" />
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => {
                        setWonItem(null);
                        openCase();
                      }}
                      className="bg-white text-primary hover:bg-white/90"
                      size="lg"
                    >
                      Открыть еще раз
                    </Button>
                    <Button
                      onClick={() => setWonItem(null)}
                      variant="outline"
                      className="border-white text-white hover:bg-white/10"
                      size="lg"
                    >
                      Закрыть
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6 bg-card border-2 border-border">
              <h2 className="text-2xl font-bold mb-6">Содержимое кейса</h2>
              {caseData.items.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">В этом кейсе пока нет предметов</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {caseData.items.map((item) => (
                    <Card
                      key={item.id}
                      className={`p-4 bg-gradient-to-br ${getRarityColor(item.rarity)} border-2 border-white/20`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-6xl flex-shrink-0">
                          {item.image.startsWith('data:') ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ) : (
                            <span>{item.image}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white text-lg mb-1 truncate">{item.name}</h3>
                          <p className="text-sm text-white/80 mb-2">{getRarityLabel(item.rarity)}</p>
                          <div className="flex items-center gap-1 text-white">
                            <span className="font-semibold">{item.price}</span>
                            <CurrencyIcon size={16} className="text-white" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}