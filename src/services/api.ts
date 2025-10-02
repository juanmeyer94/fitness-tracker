import type { ApiResponse, WeightEntry, WorkoutEntry, HabitEntry, ProgressPhoto, DashboardData } from '../types';

// Configuración de la API
const APP_SCRIPT_URL = import.meta.env.VITE_APP_SCRIPT_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

if (!APP_SCRIPT_URL || !API_KEY) {
  console.error('Faltan variables de entorno: VITE_APP_SCRIPT_URL y VITE_API_KEY');
}

/**
 * Función genérica para hacer peticiones GET a Google Sheets
 */
export async function getData<T>(path: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${APP_SCRIPT_URL}?path=${path}&api_key=${API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en getData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Función genérica para hacer peticiones POST a Google Sheets
 */
export async function postData<T>(path: string, body: any): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${APP_SCRIPT_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        api_key: API_KEY,
        data: body,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en postData:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// Servicios específicos para cada tipo de dato

/**
 * Servicios para peso y medidas
 */
export const weightService = {
  // Obtener todos los registros de peso
  getAll: () => getData<WeightEntry[]>('weight'),
  
  // Obtener el peso actual
  getCurrent: () => getData<WeightEntry>('weight/current'),
  
  // Agregar nuevo registro de peso
  add: (entry: WeightEntry) => postData<WeightEntry>('weight', entry),
  
  // Obtener datos del dashboard
  getDashboard: () => getData<DashboardData>('dashboard'),
};

/**
 * Servicios para entrenamientos
 */
export const workoutService = {
  // Obtener todos los entrenamientos
  getAll: () => getData<WorkoutEntry[]>('workouts'),
  
  // Obtener entrenamientos por ejercicio
  getByExercise: (exercise: string) => getData<WorkoutEntry[]>(`workouts/${exercise}`),
  
  // Agregar nuevo entrenamiento
  add: (entry: WorkoutEntry) => postData<WorkoutEntry>('workouts', entry),
  
  // Obtener PRs y 1RM
  getPersonalRecords: () => getData<any>('workouts/prs'),
};

/**
 * Servicios para hábitos
 */
export const habitService = {
  // Obtener todos los hábitos
  getAll: () => getData<HabitEntry[]>('habits'),
  
  // Obtener hábitos de una fecha específica
  getByDate: (date: string) => getData<HabitEntry>(`habits/${date}`),
  
  // Agregar/actualizar hábitos del día
  update: (entry: HabitEntry) => postData<HabitEntry>('habits', entry),
  
  // Obtener cumplimiento semanal
  getWeeklyCompliance: () => getData<number>('habits/compliance'),
};

/**
 * Servicios para fotos de progreso
 */
export const photoService = {
  // Obtener todas las fotos
  getAll: () => getData<ProgressPhoto[]>('photos'),
  
  // Obtener fotos recientes
  getRecent: (limit: number = 5) => getData<ProgressPhoto[]>(`photos/recent?limit=${limit}`),
  
  // Agregar nueva foto
  add: (photo: ProgressPhoto) => postData<ProgressPhoto>('photos', photo),
};

/**
 * Servicio para Cloudinary
 */
export const cloudinaryService = {
  // Subir imagen a Cloudinary
  uploadImage: async (file: File): Promise<string> => {
    const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudinaryName || !uploadPreset) {
      throw new Error('Faltan variables de entorno de Cloudinary');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir imagen a Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
  },
};

