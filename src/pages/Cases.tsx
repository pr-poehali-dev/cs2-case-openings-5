import { Card } from '@/components/ui/card';

export default function Cases() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-game-orange to-game-pink bg-clip-text text-transparent">
        Все кейсы
      </h1>
      <Card className="p-8 text-center">
        <p className="text-xl text-muted-foreground">Здесь будут все доступные кейсы</p>
      </Card>
    </div>
  );
}
