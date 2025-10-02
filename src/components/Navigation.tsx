import { Home, Weight, Dumbbell, CheckSquare, Camera, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'weight', label: 'Peso', icon: Weight },
  { id: 'workouts', label: 'Entrenamientos', icon: Dumbbell },
  { id: 'habits', label: 'Hábitos', icon: CheckSquare },
  { id: 'photos', label: 'Fotos', icon: Camera },
];

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Fitness Tracker
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2",
                    currentPage === item.id && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

