import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const { toast } = useToast();
  
  const { cases, siteSettings, updateCase, deleteCase, addCase: storeAddCase, 
          addItemToCase, updateCaseItem, deleteCaseItem, setSiteSettings } = useStore();

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

  const handleUpdateCase = (id: string, field: string, value: string | number) => {
    updateCase(id, { [field]: value });
    toast({ title: 'Кейс обновлен', description: 'Изменения сохранены на всех страницах' });
  };

  const handleDeleteCase = (id: string) => {
    deleteCase(id);
    toast({ title: 'Кейс удален', description: 'Кейс удален со всех страниц' });
  };

  const handleAddCase = () => {
    const newCase = {
      id: String(Date.now()),
      name: 'Новый кейс',
      image: '📦',
      price: 100,
      items: [],
    };
    storeAddCase(newCase);
    toast({ title: 'Кейс добавлен', description: 'Новый кейс появился на всех страницах' });
  };

  const handleImageUpload = (id: string, type: 'case' | 'item', caseId?: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const imageUrl = reader.result as string;
          if (type === 'case') {
            handleUpdateCase(id, 'image', imageUrl);
          } else if (caseId) {
            updateCaseItem(caseId, id, { image: imageUrl });
            toast({ title: 'Изображение скина обновлено', description: 'Изменения видны везде' });
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAddItem = (caseId: string) => {
    const newItem = {
      id: `${caseId}-${Date.now()}`,
      name: 'Новый скин',
      image: '🔫',
      price: 1000,
      rarity: 'common',
    };
    addItemToCase(caseId, newItem);
    toast({ title: 'Скин добавлен', description: 'Новый скин добавлен в кейс' });
  };

  const handleUpdateItem = (caseId: string, itemId: string, field: string, value: string | number) => {
    updateCaseItem(caseId, itemId, { [field]: value });
    toast({ title: 'Скин обновлен', description: 'Изменения сохранены' });
  };

  const handleDeleteItem = (caseId: string, itemId: string) => {
    deleteCaseItem(caseId, itemId);
    toast({ title: 'Скин удален', description: 'Скин удален из кейса' });
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cases">Кейсы и скины</TabsTrigger>
          <TabsTrigger value="settings">Настройки сайта</TabsTrigger>
        </TabsList>

        <TabsContent value="cases" className="space-y-4">
          <Button onClick={handleAddCase} className="bg-gradient-to-r from-game-orange to-game-pink">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить кейс
          </Button>

          {cases.map((caseItem) => (
            <Card key={caseItem.id} className="p-6 bg-card border-2 border-border">
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  Кейс: {caseItem.name}
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCase(caseItem.id)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Название</Label>
                    <Input
                      value={caseItem.name}
                      onChange={(e) => handleUpdateCase(caseItem.id, 'name', e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Изображение</Label>
                    <div className="mt-2 flex gap-2">
                      <div className="w-16 h-16 border-2 border-border rounded-lg flex items-center justify-center overflow-hidden">
                        {caseItem.image.startsWith('data:') ? (
                          <img src={caseItem.image} alt={caseItem.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">{caseItem.image}</span>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleImageUpload(caseItem.id, 'case')}
                        >
                          <Icon name="Upload" size={16} className="mr-2" />
                          Загрузить
                        </Button>
                        <Input
                          placeholder="Или emoji"
                          value={caseItem.image.startsWith('data:') ? '' : caseItem.image}
                          onChange={(e) => handleUpdateCase(caseItem.id, 'image', e.target.value)}
                          className="w-24"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Цена</Label>
                    <Input
                      type="number"
                      value={caseItem.price}
                      onChange={(e) => handleUpdateCase(caseItem.id, 'price', Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">Скины в кейсе</h4>
                  <Button 
                    size="sm"
                    onClick={() => handleAddItem(caseItem.id)}
                    className="bg-gradient-to-r from-game-purple to-game-pink"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Добавить скин
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {caseItem.items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 bg-muted rounded-lg">
                      <div>
                        <Label className="text-xs">Название</Label>
                        <Input
                          value={item.name}
                          onChange={(e) => handleUpdateItem(caseItem.id, item.id, 'name', e.target.value)}
                          className="mt-1 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Изображение</Label>
                        <div className="mt-1 flex gap-2">
                          <div className="w-9 h-9 border border-border rounded flex items-center justify-center overflow-hidden">
                            {item.image.startsWith('data:') ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">{item.image}</span>
                            )}
                          </div>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleImageUpload(item.id, 'item', caseItem.id)}
                            className="h-9 px-2"
                          >
                            <Icon name="Upload" size={14} />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs">Цена</Label>
                        <Input
                          type="number"
                          value={item.price}
                          onChange={(e) => handleUpdateItem(caseItem.id, item.id, 'price', Number(e.target.value))}
                          className="mt-1 h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Редкость</Label>
                        <select
                          value={item.rarity}
                          onChange={(e) => handleUpdateItem(caseItem.id, item.id, 'rarity', e.target.value)}
                          className="mt-1 h-9 w-full px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="common">Обычное</option>
                          <option value="rare">Редкое</option>
                          <option value="legendary">Легендарное</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <Button 
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteItem(caseItem.id, item.id)}
                          className="w-full h-9"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
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
                  value={siteSettings.title}
                  onChange={(e) => setSiteSettings({ title: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Логотип сайта (emoji или текст)</Label>
                <Input
                  value={siteSettings.logo}
                  onChange={(e) => setSiteSettings({ logo: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Шрифт сайта</Label>
                <select
                  value={siteSettings.font}
                  onChange={(e) => setSiteSettings({ font: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background"
                >
                  <option value="Rubik">Rubik (по умолчанию)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Oswald">Oswald</option>
                  <option value="Open Sans">Open Sans</option>
                </select>
              </div>
              <Button 
                className="bg-gradient-to-r from-game-orange to-game-pink"
                onClick={() => toast({ title: 'Настройки сохранены', description: 'Изменения применены на всех страницах' })}
              >
                Сохранить изменения
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card border-2 border-border">
            <h3 className="text-xl font-bold mb-4">Предпросмотр</h3>
            <div className="text-center p-8 bg-background rounded-lg" style={{ fontFamily: siteSettings.font }}>
              <div className="text-6xl mb-4">{siteSettings.logo}</div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-game-orange via-game-pink to-game-purple bg-clip-text text-transparent">
                {siteSettings.title}
              </h2>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
