import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { workoutService } from '../services/api';
import type { WorkoutEntry } from '../types';
import { Dumbbell, Calendar, Target, Award } from 'lucide-react';

const COMMON_EXERCISES = [
  'Press de Banca',
  'Sentadilla',
  'Peso Muerto',
  'Press Militar',
  'Remo con Barra',
  'Dominadas',
  'Flexiones',
  'Plancha',
  'Curl de Bíceps',
  'Extensión de Tríceps',
  'Prensa de Piernas',
  'Peso Muerto Rumano',
];

export function WorkoutsPage() {
  const [formData, setFormData] = useState<WorkoutEntry>({
    date: new Date().toISOString().split('T')[0],
    exercise: '',
    weight: 0,
    reps: 0,
    sets: 1,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.weight <= 0 || formData.reps <= 0) {
      setMessage({ type: 'error', text: 'El peso y las repeticiones deben ser mayores a 0' });
      return;
    }

    if (!formData.exercise.trim()) {
      setMessage({ type: 'error', text: 'Debes seleccionar un ejercicio' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      const response = await workoutService.add(formData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Entrenamiento registrado correctamente' });
        // Limpiar formulario pero mantener el ejercicio
        setFormData(prev => ({
          ...prev,
          weight: 0,
          reps: 0,
          sets: 1,
          notes: '',
        }));
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al registrar entrenamiento' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WorkoutEntry, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const calculateOneRM = (weight: number, reps: number) => {
    // Fórmula de Epley: 1RM = peso * (1 + reps/30)
    return Math.round(weight * (1 + reps / 30));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Dumbbell className="h-8 w-8 mr-3" />
          Entrenamientos
        </h1>
        <p className="text-gray-600">Registra tus ejercicios y progreso</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Nuevo Ejercicio
            </CardTitle>
            <CardDescription>
              Registra peso, repeticiones y series
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
                <Label htmlFor="exercise">Ejercicio</Label>
                <select
                  id="exercise"
                  value={formData.exercise}
                  onChange={(e) => handleInputChange('exercise', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  required
                >
                  <option value="">Selecciona un ejercicio</option>
                  {COMMON_EXERCISES.map((exercise) => (
                    <option key={exercise} value={exercise}>
                      {exercise}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.5"
                    min="0"
                    value={formData.weight || ''}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                    placeholder="Ej: 80"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="reps">Repeticiones</Label>
                  <Input
                    id="reps"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.reps || ''}
                    onChange={(e) => handleInputChange('reps', parseInt(e.target.value) || 0)}
                    placeholder="Ej: 8"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="sets">Series</Label>
                <Input
                  id="sets"
                  type="number"
                  min="1"
                  max="20"
                  value={formData.sets || 1}
                  onChange={(e) => handleInputChange('sets', parseInt(e.target.value) || 1)}
                  placeholder="Ej: 3"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Input
                  id="notes"
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Ej: Muy pesado, necesito bajar peso"
                />
              </div>

              {/* Cálculo de 1RM */}
              {formData.weight > 0 && formData.reps > 0 && (
                <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      1RM Estimado: {calculateOneRM(formData.weight, formData.reps)} kg
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    Calculado con la fórmula de Epley
                  </p>
                </div>
              )}

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
                {loading ? 'Registrando...' : 'Registrar Ejercicio'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Consejos de Entrenamiento
            </CardTitle>
            <CardDescription>
              Recomendaciones para un mejor progreso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Progresión gradual</p>
                  <p className="text-sm text-gray-600">
                    Aumenta el peso cuando puedas hacer todas las repeticiones con buena forma
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Técnica primero</p>
                  <p className="text-sm text-gray-600">
                    Prioriza la forma correcta sobre el peso máximo
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Registra todo</p>
                  <p className="text-sm text-gray-600">
                    Incluye notas sobre cómo te sentiste durante el ejercicio
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">Fórmula de Epley</h4>
              <p className="text-sm text-gray-600">
                1RM = Peso × (1 + Repeticiones ÷ 30)
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Esta fórmula estima tu máximo de una repetición basado en el peso y repeticiones que puedes hacer.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

