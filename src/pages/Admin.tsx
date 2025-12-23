import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CaseData {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface SkinData {
  id: string;
  name: string;
  image: string;
  price: number;
  rarity: string;
  caseId: string;
}

const initialCases: CaseData[] = [
  { id: '1', name: 'Легендарный кейс', image: '🔥', price: 500 },
  { id: '2', name: 'Эпический кейс', image: '⚡', price: 300 },
  { id: '3', name: 'Стартовый кейс', image: '💎', price: 100 },
];

const initialSkins: SkinData[] = [
  { id: '1', name: 'AWP | Dragon Lore', image: '🔫', price: 10000, rarity: 'legendary', caseId: '1' },
  { id: '2', name: 'Karambit | Fade', image: '🔪', price: 12000, rarity: 'legendary', caseId: '1' },
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [cases, setCases] = useState<CaseData[]>(initialCases);
  const [skins, setSkins] = useState<SkinData[]>(initialSkins);
  const [siteTitle, setSiteTitle] = useState('CS2 КЕЙСЫ');
  const [siteLogo, setSiteLogo] = useState('🎮');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === '2o_off' && loginForm.password === 'Gosha2012') {
      setIsAuthenticated(true);
      toast({
        title: 'Вход выполнен',
        description: 'Добро пожаловать в админ-панель!',
      });
    } else {
      toast({
        title: 'Ошибка входа',
        description: 'Неверный логин или пароль',
        variant: 'destructive',
      });
    }
  };

  const updateCase = (id: string, field: keyof CaseData, value: string | number) => {
    setCases(cases.map(c => c.id === id ? { ...c, [field]: value } : c));
    toast({ title: 'Кейс обновлен', description: 'Изменения сохранены' });
  };

  const deleteCase = (id: string) => {
    setCases(cases.filter(c => c.id !== id));
    toast({ title: 'Кейс удален', description: 'Кейс успешно удален' });
  };

  const addCase = () => {
    const newCase: CaseData = {
      id: String(Date.now()),
      name: 'Новый кейс',
      image: '📦',
      price: 100,
    };
    setCases([...cases, newCase]);
    toast({ title: 'Кейс добавлен', description: 'Новый кейс создан' });
  };

  const updateSkin = (id: string, field: keyof SkinData, value: string | number) => {
    setSkins(skins.map(s => s.id === id ? { ...s, [field]: value } : s));
    toast({ title: 'Скин обновлен', description: 'Изменения сохранены' });
  };

  const deleteSkin = (id: string) => {
    setSkins(skins.filter(s => s.id !== id));
    toast({ title: 'Скин удален', description: 'Скин успешно удален' });
  };

  const addSkin = () => {
    const newSkin: SkinData = {
      id: String(Date.now()),
      name: 'Новый скин',
      image: '🔫',
      price: 1000,
      rarity: 'common',
      caseId: '1',
    };
    setSkins([...skins, newSkin]);
    toast({ title: 'Скин добавлен', description: 'Новый скин создан' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md p-8 bg-card border-2 border-border">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">Вход для администраторов</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username">Логин</Label>
              <Input
                id="username"
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="mt-2"
                placeholder="Введите логин"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="mt-2"
                placeholder="Введите пароль"
              />
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple"
              size="lg"
            >
              Войти
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
          Админ-панель
        </h1>
        <Button 
          variant="outline"
          onClick={() => setIsAuthenticated(false)}
        >
          <Icon name="LogOut" size={20} className="mr-2" />
          Выйти
        </Button>
      </div>

      <Tabs defaultValue="cases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cases">Кейсы</TabsTrigger>
          <TabsTrigger value="skins">Скины</TabsTrigger>
          <TabsTrigger value="settings">Настройки сайта</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <Button onClick={addCase} className="bg-gradient-to-r from-game-orange to-game-pink">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить кейс
          </Button>

          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="p-6 bg-card border-2 border-border">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={caseItem.name}
                    onChange={(e) => updateCase(caseItem.id, 'name', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Иконка (emoji)</Label>
                  <Input
                    value={caseItem.image}
                    onChange={(e) => updateCase(caseItem.id, 'image', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Цена</Label>
                  <Input
                    type="number"
                    value={caseItem.price}
                    onChange={(e) => updateCase(caseItem.id, 'price', Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="destructive"
                    onClick={() => deleteCase(caseItem.id)}
                    className="w-full"
                  >
                    <Icon name="Trash2" size={20} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="skins" className="space-y-4">
          <Button onClick={addSkin} className="bg-gradient-to-r from-game-purple to-game-pink">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить скин
          </Button>

          {skins.map((skin) => (
            <Card key={skin.id} className="p-6 bg-card border-2 border-border">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={skin.name}
                    onChange={(e) => updateSkin(skin.id, 'name', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Иконка (emoji)</Label>
                  <Input
                    value={skin.image}
                    onChange={(e) => updateSkin(skin.id, 'image', e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Цена</Label>
                  <Input
                    type="number"
                    value={skin.price}
                    onChange={(e) => updateSkin(skin.id, 'price', Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Редкость</Label>
                  <select
                    value={skin.rarity}
                    onChange={(e) => updateSkin(skin.id, 'rarity', e.target.value)}
                    className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option value="common">Обычное</option>
                    <option value="rare">Редкое</option>
                    <option value="legendary">Легендарное</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    variant="destructive"
                    onClick={() => deleteSkin(skin.id)}
                    className="w-full"
                  >
                    <Icon name="Trash2" size={20} className="mr-2" />
                    Удалить
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6 bg-card border-2 border-border">
            <h3 className="text-xl font-bold mb-4">Настройки сайта</h3>
            <div className="space-y-4">
              <div>
                <Label>Название сайта</Label>
                <Input
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Логотип сайта (emoji)</Label>
                <Input
                  value={siteLogo}
                  onChange={(e) => setSiteLogo(e.target.value)}
                  className="mt-2"
                />
              </div>
              <Button className="bg-gradient-to-r from-game-orange to-game-pink">
                Сохранить изменения
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card border-2 border-border">
            <h3 className="text-xl font-bold mb-4">Предпросмотр</h3>
            <div className="text-center p-8 bg-background rounded-lg">
              <div className="text-6xl mb-4">{siteLogo}</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-game-orange via-game-pink to-game-purple bg-clip-text text-transparent">
                {siteTitle}
              </h2>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
