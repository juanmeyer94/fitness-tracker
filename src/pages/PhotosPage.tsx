import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { photoService, cloudinaryService } from '../services/api';
import type { ProgressPhoto } from '../types';
import { Camera, Upload, Calendar, Image as ImageIcon, Trash2 } from 'lucide-react';

export function PhotosPage() {
  const [formData, setFormData] = useState<Omit<ProgressPhoto, 'url'>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'El archivo es demasiado grande. Máximo 5MB.' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Solo se permiten archivos de imagen.' });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setMessage({ type: 'error', text: 'Debes seleccionar una imagen' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      // Subir imagen a Cloudinary
      const imageUrl = await cloudinaryService.uploadImage(selectedFile);
      
      // Guardar información en Google Sheets
      const photoData: ProgressPhoto = {
        ...formData,
        url: imageUrl,
      };

      const response = await photoService.add(photoData);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Foto de progreso guardada correctamente' });
        
        // Limpiar formulario
        setFormData({
          date: new Date().toISOString().split('T')[0],
          description: '',
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Recargar fotos
        loadPhotos();
      } else {
        setMessage({ type: 'error', text: response.error || 'Error al guardar foto' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al subir imagen' });
    } finally {
      setLoading(false);
    }
  };

  const loadPhotos = async () => {
    try {
      const response = await photoService.getRecent(10);
      if (response.success && response.data) {
        setPhotos(response.data);
      }
    } catch (error) {
      console.error('Error al cargar fotos:', error);
    }
  };

  React.useEffect(() => {
    loadPhotos();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Camera className="h-8 w-8 mr-3" />
          Fotos de Progreso
        </h1>
        <p className="text-gray-600">Registra tu evolución física con fotografías</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de subida */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Nueva Foto
            </CardTitle>
            <CardDescription>
              Sube una foto de tu progreso
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
                <Label htmlFor="photo">Seleccionar Imagen</Label>
                <Input
                  ref={fileInputRef}
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 5MB. Formatos: JPG, PNG, WebP
                </p>
              </div>

              {/* Preview de la imagen */}
              {previewUrl && (
                <div className="space-y-2">
                  <Label>Vista previa</Label>
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Input
                  id="description"
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Ej: Después de 3 meses de entrenamiento"
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

              <Button type="submit" disabled={loading || !selectedFile} className="w-full">
                {loading ? 'Subiendo...' : 'Subir Foto'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Galería de fotos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="h-5 w-5 mr-2" />
              Fotos Recientes
            </CardTitle>
            <CardDescription>
              Tus últimas fotos de progreso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {photos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay fotos registradas</p>
                <p className="text-sm">Sube tu primera foto de progreso</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {photos.map((photo, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <img
                        src={photo.url}
                        alt={`Progreso ${photo.date}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium">
                            {new Date(photo.date).toLocaleDateString()}
                          </span>
                        </div>
                        {photo.description && (
                          <p className="text-sm text-gray-600 truncate">
                            {photo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Consejos */}
      <Card>
        <CardHeader>
          <CardTitle>Consejos para Fotos de Progreso</CardTitle>
          <CardDescription>
            Cómo tomar mejores fotos para seguir tu evolución
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Consistencia</h4>
              <p className="text-sm text-gray-600">
                Toma las fotos siempre en las mismas condiciones: misma hora, misma luz, misma pose.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Buena iluminación</h4>
              <p className="text-sm text-gray-600">
                Usa luz natural cuando sea posible y evita sombras que oculten detalles.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Múltiples ángulos</h4>
              <p className="text-sm text-gray-600">
                Considera tomar fotos de frente, perfil y espalda para un seguimiento completo.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

