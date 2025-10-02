import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { weightService } from '../services/api';
import type { DashboardData } from '../types';
import { TrendingUp, Target, Award, Calendar } from 'lucide-react';

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await weightService.getDashboard();
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Error al cargar datos');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu progreso fitness</p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Actual</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.currentWeight} kg</div>
            {data.currentBodyFat && (
              <p className="text-xs text-muted-foreground">
                {data.currentBodyFat}% grasa corporal
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IMC</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.bmi.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Progreso: {data.progressPercentage.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meta</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.targetWeight} kg</div>
            <p className="text-xs text-muted-foreground">
              Faltan {data.currentWeight - data.targetWeight} kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hábitos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.habitsCompliance.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">
              Cumplimiento semanal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 1RM y PRs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Máximos (1RM)
            </CardTitle>
            <CardDescription>
              Cálculo estimado con fórmula de Epley
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Press de Banca</span>
                <span className="text-lg font-bold">{data.oneRepMax.bench} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Sentadilla</span>
                <span className="text-lg font-bold">{data.oneRepMax.squat} kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Peso Muerto</span>
                <span className="text-lg font-bold">{data.oneRepMax.deadlift} kg</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Records Personales
            </CardTitle>
            <CardDescription>
              Mejores marcas por ejercicio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.personalRecords.slice(0, 5).map((pr, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{pr.exercise}</span>
                    <p className="text-sm text-muted-foreground">
                      {pr.weight} kg × {pr.reps} reps
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(pr.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos embebidos desde Google Sheets */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución del Peso</CardTitle>
          <CardDescription>
            Gráfico generado automáticamente en Google Sheets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Aquí se mostrará el gráfico embebido desde Google Sheets
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

