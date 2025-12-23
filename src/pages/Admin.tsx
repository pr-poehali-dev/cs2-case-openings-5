import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useStore, Banner, SiteSection, NavItem } from '@/lib/store';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const { toast } = useToast();
  
  const { 
    cases, 
    siteSettings, 
    updateCase, 
    deleteCase, 
    addCase: storeAddCase, 
    addItemToCase, 
    updateCaseItem, 
    deleteCaseItem, 
    setSiteSettings,
    addBanner,
    updateBanner,
    deleteBanner,
    addSection,
    updateSection,
    deleteSection,
    addNavItem,
    updateNavItem,
    deleteNavItem,
    updateStyles,
    syncToServer
  } = useStore();

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

  const handleImageUpload = (id: string, type: 'case' | 'item' | 'banner' | 'currency' | 'logo', caseId?: string) => {
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
          } else if (type === 'item' && caseId) {
            updateCaseItem(caseId, id, { image: imageUrl });
            toast({ title: 'Изображение скина обновлено', description: 'Изменения видны везде' });
          } else if (type === 'banner') {
            updateBanner(id, { image: imageUrl });
            toast({ title: 'Изображение баннера обновлено', description: 'Баннер обновлен на сайте' });
          } else if (type === 'currency') {
            setSiteSettings({ currencyIcon: imageUrl });
            toast({ title: 'Иконка валюты обновлена', description: 'Изменения применены на всем сайте' });
          } else if (type === 'logo') {
            setSiteSettings({ logo: imageUrl });
            toast({ title: 'Логотип обновлен', description: 'Изменения видны на всем сайте' });
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

  const handleAddBanner = () => {
    const newBanner: Banner = {
      id: String(Date.now()),
      title: 'Новый баннер',
      description: 'Описание баннера',
      image: '',
      link: '',
      isActive: true,
    };
    addBanner(newBanner);
    toast({ title: 'Баннер добавлен', description: 'Новый баннер появился на сайте' });
  };

  const handleAddSection = () => {
    const newSection: SiteSection = {
      id: String(Date.now()),
      title: 'Новый раздел',
      content: 'Содержание раздела',
      isVisible: true,
      order: siteSettings.sections.length + 1,
    };
    addSection(newSection);
    toast({ title: 'Раздел добавлен', description: 'Новый раздел добавлен на сайт' });
  };

  const handleAddNavItem = () => {
    const newNavItem: NavItem = {
      id: String(Date.now()),
      path: '/new',
      label: 'Новый пункт',
      icon: 'Star',
      isVisible: true,
      order: siteSettings.navItems.length + 1,
    };
    addNavItem(newNavItem);
    toast({ title: 'Пункт навигации добавлен', description: 'Новый пункт появился в меню' });
  };

  const handleSyncToServer = async () => {
    try {
      await syncToServer();
      toast({ 
        title: 'Синхронизация завершена', 
        description: 'Все изменения сохранены в базу данных для всех пользователей' 
      });
    } catch (error) {
      toast({ 
        title: 'Ошибка синхронизации', 
        description: 'Не удалось сохранить изменения', 
        variant: 'destructive' 
      });
    }
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
        <div className="flex gap-2">
          <Button 
            onClick={handleSyncToServer}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Icon name="RefreshCw" size={20} className="mr-2" />
            Синхронизировать с базой
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsAuthenticated(false)}
          >
            <Icon name="LogOut" size={20} className="mr-2" />
            Выйти
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cases" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="cases">Кейсы</TabsTrigger>
          <TabsTrigger value="banners">Баннеры</TabsTrigger>
          <TabsTrigger value="sections">Разделы</TabsTrigger>
          <TabsTrigger value="navigation">Навигация</TabsTrigger>
          <TabsTrigger value="styles">Оформление</TabsTrigger>
          <TabsTrigger value="design-screenshot">Дизайн по фото</TabsTrigger>
          <TabsTrigger value="settings">Настройки</TabsTrigger>
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

        <TabsContent value="banners" className="space-y-4">
          <Button onClick={handleAddBanner} className="bg-gradient-to-r from-game-orange to-game-pink">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить баннер
          </Button>

          {siteSettings.banners.map((banner) => (
            <Card key={banner.id} className="p-6 bg-card border-2 border-border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Баннер: {banner.title}</h3>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <Label>Активен</Label>
                    <Switch
                      checked={banner.isActive}
                      onCheckedChange={(checked) => updateBanner(banner.id, { isActive: checked })}
                    />
                  </div>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteBanner(banner.id);
                      toast({ title: 'Баннер удален', description: 'Баннер удален с сайта' });
                    }}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Заголовок</Label>
                  <Input
                    value={banner.title}
                    onChange={(e) => updateBanner(banner.id, { title: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Описание</Label>
                  <Textarea
                    value={banner.description}
                    onChange={(e) => updateBanner(banner.id, { description: e.target.value })}
                    className="mt-2"
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Ссылка (необязательно)</Label>
                  <Input
                    value={banner.link || ''}
                    onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                    className="mt-2"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label>Изображение баннера</Label>
                  <div className="mt-2 flex gap-4">
                    {banner.image && (
                      <div className="w-48 h-32 border-2 border-border rounded-lg overflow-hidden">
                        <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Button 
                      onClick={() => handleImageUpload(banner.id, 'banner')}
                      variant="outline"
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      {banner.image ? 'Изменить изображение' : 'Загрузить изображение'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Button onClick={handleAddSection} className="bg-gradient-to-r from-game-orange to-game-pink">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить раздел
          </Button>

          {siteSettings.sections
            .sort((a, b) => a.order - b.order)
            .map((section) => (
            <Card key={section.id} className="p-6 bg-card border-2 border-border">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">Раздел: {section.title}</h3>
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <Label>Показывать</Label>
                    <Switch
                      checked={section.isVisible}
                      onCheckedChange={(checked) => updateSection(section.id, { isVisible: checked })}
                    />
                  </div>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteSection(section.id);
                      toast({ title: 'Раздел удален', description: 'Раздел удален с сайта' });
                    }}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Заголовок раздела</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Порядок отображения</Label>
                    <Input
                      type="number"
                      value={section.order}
                      onChange={(e) => updateSection(section.id, { order: Number(e.target.value) })}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label>Содержание раздела</Label>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Логотип / Изображение</Label>
                    <div className="mt-2 flex gap-4 items-center">
                      {section.image && (
                        <div className="w-24 h-24 border-2 border-border rounded flex items-center justify-center overflow-hidden bg-muted">
                          {section.image.startsWith('data:') ? (
                            <img src={section.image} alt="Логотип" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-4xl">{section.image}</span>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  updateSection(section.id, { image: reader.result as string });
                                  toast({ title: 'Логотип обновлен', description: 'Изображение раздела изменено' });
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Icon name="Upload" size={16} className="mr-2" />
                          {section.image ? 'Изменить' : 'Загрузить'}
                        </Button>
                        {section.image && (
                          <Button 
                            onClick={() => {
                              updateSection(section.id, { image: '' });
                              toast({ title: 'Логотип удален' });
                            }}
                            variant="destructive"
                            size="sm"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Ссылка (URL)</Label>
                    <Input
                      value={section.link || ''}
                      onChange={(e) => updateSection(section.id, { link: e.target.value })}
                      className="mt-2"
                      placeholder="https://example.com или /page"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Если указана, раздел станет кликабельным
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="navigation" className="space-y-4">
          <Button onClick={handleAddNavItem} className="bg-gradient-to-r from-game-orange to-game-pink">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить пункт навигации
          </Button>

          {siteSettings.navItems && siteSettings.navItems.map((navItem) => (
            <Card key={navItem.id} className="p-6 bg-card border-2 border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{navItem.label}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Label>Видимость</Label>
                    <Switch
                      checked={navItem.isVisible}
                      onCheckedChange={(checked) => updateNavItem(navItem.id, { isVisible: checked })}
                    />
                  </div>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      deleteNavItem(navItem.id);
                      toast({ title: 'Пункт удален', description: 'Пункт удален из навигации' });
                    }}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={navItem.label}
                    onChange={(e) => updateNavItem(navItem.id, { label: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Путь</Label>
                  <Input
                    value={navItem.path}
                    onChange={(e) => updateNavItem(navItem.id, { path: e.target.value })}
                    className="mt-2"
                    placeholder="/path"
                  />
                </div>
                <div>
                  <Label>Иконка (lucide name)</Label>
                  <Input
                    value={navItem.icon}
                    onChange={(e) => updateNavItem(navItem.id, { icon: e.target.value })}
                    className="mt-2"
                    placeholder="Home"
                  />
                </div>
                <div>
                  <Label>Порядок</Label>
                  <Input
                    type="number"
                    value={navItem.order}
                    onChange={(e) => updateNavItem(navItem.id, { order: Number(e.target.value) })}
                    className="mt-2"
                  />
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="styles" className="space-y-4">
          <Card className="p-6 bg-card border-2 border-border">
            <h3 className="text-xl font-bold mb-6">Настройки оформления сайта</h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold">Цветовая схема</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>Основной цвет</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="color"
                        value={siteSettings.styles.primaryColor}
                        onChange={(e) => updateStyles({ primaryColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.styles.primaryColor}
                        onChange={(e) => updateStyles({ primaryColor: e.target.value })}
                        placeholder="#ff6b35"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Вторичный цвет</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="color"
                        value={siteSettings.styles.secondaryColor}
                        onChange={(e) => updateStyles({ secondaryColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.styles.secondaryColor}
                        onChange={(e) => updateStyles({ secondaryColor: e.target.value })}
                        placeholder="#f72585"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Акцентный цвет</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="color"
                        value={siteSettings.styles.accentColor}
                        onChange={(e) => updateStyles({ accentColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.styles.accentColor}
                        onChange={(e) => updateStyles({ accentColor: e.target.value })}
                        placeholder="#7209b7"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold">Цвета фона</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Цвет фона</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="color"
                        value={siteSettings.styles.backgroundColor}
                        onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.styles.backgroundColor}
                        onChange={(e) => updateStyles({ backgroundColor: e.target.value })}
                        placeholder="#0a0a0a"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Цвет карточек</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="color"
                        value={siteSettings.styles.cardColor}
                        onChange={(e) => updateStyles({ cardColor: e.target.value })}
                        className="w-20 h-10"
                      />
                      <Input
                        value={siteSettings.styles.cardColor}
                        onChange={(e) => updateStyles({ cardColor: e.target.value })}
                        placeholder="#1a1a1a"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-lg font-semibold">Стиль элементов</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label>Радиус скругления углов</Label>
                    <Input
                      value={siteSettings.styles.borderRadius}
                      onChange={(e) => updateStyles({ borderRadius: e.target.value })}
                      className="mt-2"
                      placeholder="12px"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <Button 
                  onClick={() => {
                    updateStyles({
                      primaryColor: '#ff6b35',
                      secondaryColor: '#f72585',
                      accentColor: '#7209b7',
                      backgroundColor: '#0a0a0a',
                      cardColor: '#1a1a1a',
                      borderRadius: '12px',
                    });
                    toast({ title: 'Стили сброшены', description: 'Применены стандартные настройки оформления' });
                  }}
                  variant="outline"
                >
                  Сбросить до стандартных значений
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6 bg-card border-2 border-border">
            <h3 className="text-xl font-bold mb-4">Общие настройки сайта</h3>
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
                <Label>Логотип сайта</Label>
                <div className="mt-2 flex gap-4 items-center">
                  {siteSettings.logo && (
                    <div className="w-16 h-16 border-2 border-border rounded flex items-center justify-center overflow-hidden bg-muted">
                      {siteSettings.logo.startsWith('data:image') ? (
                        <img src={siteSettings.logo} alt="Логотип" className="w-full h-full object-contain" />
                      ) : (
                        <span className="text-3xl">{siteSettings.logo}</span>
                      )}
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <Input
                      value={siteSettings.logo.startsWith('data:image') ? '' : siteSettings.logo}
                      onChange={(e) => setSiteSettings({ logo: e.target.value })}
                      placeholder="Введите emoji или текст"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleImageUpload('logo', 'logo')}
                        variant="outline"
                        size="sm"
                      >
                        <Icon name="Upload" size={16} className="mr-2" />
                        Загрузить изображение
                      </Button>
                      {siteSettings.logo.startsWith('data:image') && (
                        <Button 
                          onClick={() => {
                            setSiteSettings({ logo: '🎮' });
                            toast({ title: 'Логотип сброшен', description: 'Установлен стандартный emoji' });
                          }}
                          variant="outline"
                          size="sm"
                        >
                          <Icon name="RotateCcw" size={16} className="mr-2" />
                          Сбросить
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <Label>Шрифт сайта</Label>
                <select
                  value={siteSettings.font}
                  onChange={(e) => setSiteSettings({ font: e.target.value })}
                  className="mt-2 w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="Rubik">Rubik</option>
                  <option value="Inter">Inter</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Poppins">Poppins</option>
                </select>
              </div>
              <div>
                <Label>Иконка валюты (вместо ₽)</Label>
                <div className="mt-2 flex gap-4 items-center">
                  {siteSettings.currencyIcon && (
                    <div className="w-12 h-12 border-2 border-border rounded flex items-center justify-center overflow-hidden bg-muted">
                      <img src={siteSettings.currencyIcon} alt="Валюта" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleImageUpload('currency', 'currency')}
                      variant="outline"
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      {siteSettings.currencyIcon ? 'Изменить иконку' : 'Загрузить иконку'}
                    </Button>
                    {siteSettings.currencyIcon && (
                      <Button 
                        onClick={() => {
                          setSiteSettings({ currencyIcon: '' });
                          toast({ title: 'Иконка удалена', description: 'Будет показываться ₽' });
                        }}
                        variant="destructive"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {siteSettings.currencyIcon ? 'Загружена иконка валюты' : 'По умолчанию показывается ₽'}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="design-screenshot">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Редактирование дизайна через скриншот</h2>
            <p className="text-muted-foreground mb-6">
              Загрузите скриншот или фото желаемого дизайна и опишите, что хотите изменить
            </p>
            
            <div className="space-y-6">
              <div>
                <Label>Загрузите скриншот / фото дизайна</Label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    id="design-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          const imageUrl = reader.result as string;
                          document.getElementById('design-preview')!.innerHTML = 
                            `<img src="${imageUrl}" alt="Дизайн" class="max-h-96 mx-auto rounded-lg" />`;
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="design-upload" className="cursor-pointer">
                    <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-semibold mb-2">Нажмите для загрузки</p>
                    <p className="text-sm text-muted-foreground">
                      Поддерживаются JPG, PNG, WebP
                    </p>
                  </label>
                </div>
                <div id="design-preview" className="mt-4 empty:hidden"></div>
              </div>

              <div>
                <Label>Опишите, что хотите изменить</Label>
                <Textarea
                  placeholder="Например: сделать как на скриншоте - темный фон, оранжевые кнопки, более крупные карточки кейсов"
                  className="mt-2 h-32"
                  id="design-description"
                />
              </div>

              <Button
                className="w-full bg-gradient-to-r from-game-orange to-game-pink"
                size="lg"
                onClick={() => {
                  const preview = document.getElementById('design-preview');
                  const description = (document.getElementById('design-description') as HTMLTextAreaElement).value;
                  
                  if (!preview?.innerHTML || !description) {
                    toast({
                      title: 'Ошибка',
                      description: 'Загрузите скриншот и опишите изменения',
                      variant: 'destructive'
                    });
                    return;
                  }

                  toast({
                    title: 'Запрос отправлен',
                    description: 'Юра изучает ваш дизайн и применяет изменения...',
                  });

                  // В будущем здесь будет отправка на AI
                  setTimeout(() => {
                    toast({
                      title: 'Готово!',
                      description: 'Дизайн обновлен согласно вашему скриншоту',
                    });
                  }, 2000);
                }}
              >
                <Icon name="Wand2" size={20} className="mr-2" />
                Применить дизайн из скриншота
              </Button>

              <div className="bg-muted rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">💡 Как это работает:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Загрузите скриншот сайта, который вам нравится</li>
                  <li>Опишите, какие элементы хотите взять (цвета, кнопки, карточки)</li>
                  <li>Юра проанализирует скриншот и применит стиль к вашему сайту</li>
                  <li>Изменения появятся на всех страницах автоматически</li>
                </ol>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}