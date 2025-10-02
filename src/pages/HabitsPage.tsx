import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { habitService } from '../services/api';
import type { HabitEntry } from '../types';
import { CheckSquare, Calendar, Target, Moon, Droplets, Heart } from 'lucide-react';

export function HabitsPage() {
  const [formData, setFormData] = useState<HabitEntry>({
    date: new Date().toISOString().split('T')[0],
    sleep: false,
    water: false,
    cardio: false,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      const response = await habitService.update(formData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Hábitos registrados correctamente' });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al registrar hábitos' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleHabitChange = (habit: keyof Pick<HabitEntry, 'sleep' | 'water' | 'cardio'>) => {
    setFormData(prev => ({
      ...prev,
      [habit]: !prev[habit],
    }));
  };

  const handleInputChange = (field: keyof HabitEntry, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const getCompletedCount = () => {
    return [formData.sleep, formData.water, formData.cardio].filter(Boolean).length;
  };

  const getCompletionPercentage = () => {
    return Math.round((getCompletedCount() / 3) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <CheckSquare className="h-8 w-8 mr-3" />
          Hábitos Diarios
        </h1>
        <p className="text-gray-600">Mantén el control de tus hábitos saludables</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Registro Diario
            </CardTitle>
            <CardDescription>
              Marca los hábitos que cumpliste hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="date">Fecha</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>

              {/* Hábitos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hábitos del día</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleHabitChange('sleep')}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        formData.sleep 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {formData.sleep && <CheckSquare className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      <Moon className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Dormir 7-8 horas</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleHabitChange('water')}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        formData.water 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {formData.water && <CheckSquare className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">Beber 2+ litros de agua</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <button
                      type="button"
                      onClick={() => handleHabitChange('cardio')}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        formData.cardio 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {formData.cardio && <CheckSquare className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="font-medium">Hacer cardio (30+ min)</span>
                    </div>
                  </div>
                </div>

                {/* Progreso del día */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progreso del día</span>
                    <span className="text-sm text-gray-600">
                      {getCompletedCount()}/3 hábitos
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {getCompletionPercentage()}% completado
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas del día (opcional)</Label>
                <Input
                  id="notes"
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ej: Día muy productivo, me sentí con mucha energía"
                />
              </div>

              {message && (
                <div className={`p-3 rounded-md ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Guardando...' : 'Guardar Hábitos'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Beneficios de los Hábitos
            </CardTitle>
            <CardDescription>
              Por qué estos hábitos son importantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Moon className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium">Sueño de calidad</p>
                  <p className="text-sm text-gray-600">
                    Mejora la recuperación muscular, el rendimiento y la regulación hormonal.
                    Esencial para el crecimiento muscular y la pérdida de grasa.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Droplets className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="font-medium">Hidratación adecuada</p>
                  <p className="text-sm text-gray-600">
                    Mantiene el rendimiento físico, ayuda en la digestión y 
                    contribuye a la salud de la piel y órganos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-red-500 mt-1" />
                <div>
                  <p className="font-medium">Ejercicio cardiovascular</p>
                  <p className="text-sm text-gray-600">
                    Mejora la salud del corazón, aumenta la resistencia y 
                    ayuda a quemar calorías adicionales.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium text-blue-900 mb-2">Consejo</h4>
              <p className="text-sm text-blue-800">
                La consistencia es clave. Es mejor cumplir parcialmente todos los días 
                que cumplir perfectamente solo algunos días.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

