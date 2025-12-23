import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const navItems = [
  { path: '/', label: 'Главная', icon: 'Home' },
  { path: '/cases', label: 'Кейсы', icon: 'Package' },
  { path: '/profile', label: 'Профиль', icon: 'User' },
  { path: '/inventory', label: 'Инвентарь', icon: 'Backpack' },
  { path: '/free', label: 'Халява', icon: 'Gift' },
  { path: '/admin', label: 'Админ', icon: 'Settings' },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🎮</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-game-orange via-game-pink to-game-purple bg-clip-text text-transparent">
              CS2 КЕЙСЫ
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className={
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple'
                      : ''
                  }
                >
                  <Icon name={item.icon as any} size={18} className="mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>

        <div className="md:hidden pb-4 flex gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant={location.pathname === item.path ? 'default' : 'outline'}
                size="sm"
                className={
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-game-orange to-game-pink hover:from-game-pink hover:to-game-purple whitespace-nowrap'
                    : 'whitespace-nowrap'
                }
              >
                <Icon name={item.icon as any} size={16} className="mr-2" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
