import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { weightService } from '../services/api';
import type { WeightEntry } from '../types';
import { Weight, Calendar, Target } from 'lucide-react';

export function WeightPage() {
  const [formData, setFormData] = useState<WeightEntry>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    bodyFat: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.weight <= 0) {
      setMessage({ type: 'error', text: 'El peso debe ser mayor a 0' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await weightService.add(formData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Peso registrado correctamente' });
        // Limpiar formulario
        setFormData({
          date: new Date().toISOString().split('T')[0],
          weight: 0,
          bodyFat: 0,
          notes: '',
        });
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al registrar peso' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WeightEntry, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Weight className="h-8 w-8 mr-3" />
          Registro de Peso
        </h1>
        <p className="text-gray-600">Registra tu peso y medidas corporales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Nuevo Registro
            </CardTitle>
            <CardDescription>
              Ingresa tu peso y medidas del día
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.weight || ''}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                  placeholder="Ej: 75.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="bodyFat">% Grasa Corporal (opcional)</Label>
                <Input
                  id="bodyFat"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.bodyFat || ''}
                  onChange={(e) => handleInputChange('bodyFat', parseFloat(e.target.value) || 0)}
                  placeholder="Ej: 15.2"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ej: Después del entrenamiento"
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
                {loading ? 'Registrando...' : 'Registrar Peso'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Consejos
            </CardTitle>
            <CardDescription>
              Recomendaciones para un mejor seguimiento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Pesarse siempre a la misma hora</p>
                  <p className="text-sm text-gray-600">
                    Preferiblemente en ayunas, después de ir al baño
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Usar la misma báscula</p>
                  <p className="text-sm text-gray-600">
                    Para mantener consistencia en las mediciones
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Registrar el % de grasa</p>
                  <p className="text-sm text-gray-600">
                    Si tienes acceso a una báscula con bioimpedancia
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

