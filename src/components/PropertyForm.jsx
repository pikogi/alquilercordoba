import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, X, Upload, Plus } from "lucide-react";
import { UploadFile } from '@/api/client';
import { toast } from "sonner";

export default function PropertyForm({ initialData, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    title: "",
    description: "",
    location: "",
    price_per_night: "",
    capacity: "",
    cover_image: "",
    images: [],
    amenities: [],
    owner_email: ""
  });

  const amenitiesList = [
    "Wifi", "Aire acondicionado", "Estacionamiento", "Cocina", 
    "Piscina", "Jacuzzi", "Vistas a la Montaña", "Vista al Mar",
    "Desayuno incluido", "Seguridad 24hs", "Gimnasio", "Hogar a leña"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => {
      const current = prev.amenities || [];
      if (current.includes(amenity)) {
        return { ...prev, amenities: current.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...current, amenity] };
      }
    });
  };

  const handleImageUpload = async (e, isCover = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validación del tamaño (20MB = 20 * 1024 * 1024 bytes)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. El tamaño máximo es 20MB");
      e.target.value = ''; // Limpiar el input
      return;
    }

    // Validación del tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/jfif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, GIF, WebP)");
      e.target.value = ''; // Limpiar el input
      return;
    }

    setUploading(true);
    try {
      // UploadFile returns { file_url: string }
      const res = await UploadFile({ file });
      const url = res.file_url;

      if (isCover) {
        setFormData(prev => ({ ...prev, cover_image: url }));
      } else {
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), url] }));
      }
      toast.success("Imagen subida correctamente");
      e.target.value = ''; // Limpiar el input para permitir subir el mismo archivo de nuevo
    } catch (error) {
      console.error("Upload failed", error);
      const errorMessage = error.message || "Error al subir la imagen. Verifica el tamaño (máx 20MB) y formato (JPG, PNG, GIF, WebP)";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate
    if (!formData.title || !formData.price_per_night || !formData.cover_image) {
        toast.error("Por favor completa los campos requeridos");
        setLoading(false);
        return;
    }

    try {
      // Ensure numeric values are numbers
      const submissionData = {
        ...formData,
        price_per_night: Number(formData.price_per_night),
        capacity: Number(formData.capacity)
      };
      
      await onSubmit(submissionData);
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto bg-white p-8 rounded-xl border border-neutral-100 shadow-sm">
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Información Básica</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la propiedad</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Ej. Villa del Lago" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleInputChange} placeholder="Ej. Tigre, Buenos Aires" required />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="h-32" placeholder="Describe los detalles de la propiedad..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_per_night">Precio por noche (USD)</Label>
            <Input id="price_per_night" name="price_per_night" type="number" value={formData.price_per_night} onChange={handleInputChange} placeholder="0.00" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidad (Huéspedes)</Label>
            <Input id="capacity" name="capacity" type="number" value={formData.capacity} onChange={handleInputChange} placeholder="1" required />
          </div>
        </div>
      </div>

        <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Imágenes</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 20MB por imagen.
        </p>
        
        <div className="space-y-2">
          <Label>Imagen de Portada</Label>
          <div className="flex items-center gap-4">
            {formData.cover_image && (
                <img src={formData.cover_image} alt="Cover" className="w-32 h-20 object-cover rounded-md border" />
            )}
            <div className="relative">
                <input type="file" id="cover-upload" className="hidden" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={(e) => handleImageUpload(e, true)} disabled={uploading} />
                <Button type="button" variant="outline" onClick={() => document.getElementById('cover-upload').click()} disabled={uploading}>
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                    Subir Portada
                </Button>
            </div>
            <div className="text-xs text-neutral-400">O ingresa URL:</div>
            <Input 
                name="cover_image" 
                value={formData.cover_image} 
                onChange={handleInputChange} 
                placeholder="https://..." 
                className="flex-1"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Galería de Imágenes</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            {formData.images?.map((img, idx) => (
                <div key={idx} className="relative group">
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-24 object-cover rounded-md border" />
                    <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </div>
            ))}
            <div className="h-24 border-2 border-dashed border-neutral-200 rounded-md flex flex-col items-center justify-center text-neutral-400 hover:bg-neutral-50 transition-colors cursor-pointer"
                 onClick={() => document.getElementById('gallery-upload').click()}>
                 <input type="file" id="gallery-upload" className="hidden" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp" onChange={(e) => handleImageUpload(e, false)} disabled={uploading} />
                 {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                 <span className="text-xs mt-1">Agregar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">Comodidades</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenitiesList.map(item => (
                <div key={item} className="flex items-center space-x-2">
                    <input 
                        type="checkbox" 
                        id={`amenity-${item}`} 
                        checked={formData.amenities?.includes(item)} 
                        onChange={() => handleAmenityToggle(item)}
                        className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    <label htmlFor={`amenity-${item}`} className="text-sm text-neutral-600 cursor-pointer">{item}</label>
                </div>
            ))}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={loading || uploading} className="bg-neutral-900 text-white hover:bg-neutral-800">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Guardar Propiedad
        </Button>
      </div>
    </form>
  );
}