import React, { useEffect, useState } from 'react';
import { Property } from '@/api/client';
import { Loader2, MapPin, Users, Wifi, Wind, Car, Coffee, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import CalendarComponent from '@/components/CalendarComponent';
import PropertyHeaderGallery from '@/components/PropertyHeaderGallery';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

export default function PropertyDetail() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const query = new URLSearchParams(window.location.search);
  const id = query.get('id');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;
    const fetchProp = async () => {
      try {
        const res = await Property.filter({ id: id });
        const data = Array.isArray(res) ? res : (res.data || []);
        if (data && data.length > 0) {
          setProperty(data[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchProp();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!property) return <div className="h-screen flex items-center justify-center text-neutral-500">Propiedad no encontrada</div>;

  const amenitiesIcons = {
    'Wifi': <Wifi size={18} />,
    'Aire acondicionado': <Wind size={18} />,
    'Estacionamiento': <Car size={18} />,
    'Cocina': <Coffee size={18} />,
    // Default fallback
  };

  const whatsappMessage = `Hola, estoy interesado en reservar *${property.title}*. ¿Tienen disponibilidad?`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`; // Add phone number in real app

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Gallery */}
      <PropertyHeaderGallery 
        images={[property.cover_image, ...(property.images || [])]} 
        title={property.title} 
      />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-light text-neutral-900 mb-3">{property.title}</h1>
                  <div className="flex items-center gap-4 text-neutral-500">
                    <span className="flex items-center gap-1"><MapPin size={16} /> {property.location}</span>
                    <span className="flex items-center gap-1"><Users size={16} /> {property.capacity} Huéspedes</span>
                  </div>
                </div>
                <div className="text-2xl font-medium text-neutral-900">
                  ${property.price_per_night} <span className="text-base font-normal text-neutral-500">/ noche</span>
                </div>
              </div>
              
              <hr className="border-neutral-100 my-8" />
              
              <div className="prose prose-neutral max-w-none text-neutral-600 font-light leading-relaxed">
                {property.description}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-medium mb-6">Comodidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((am, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-neutral-600 p-3 bg-neutral-50 rounded-lg">
                    {amenitiesIcons[am] || <Check size={18} />}
                    <span className="text-sm">{am}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Calendar */}
            <div>
              <h3 className="text-lg font-medium mb-6">Disponibilidad</h3>
              <div className="max-w-md">
                <CalendarComponent propertyId={property.id} isOwner={false} />
              </div>
            </div>


          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">

              {/* Contact Card */}
              <div className="bg-neutral-900 text-white p-8 rounded-xl text-center space-y-6">
                <h3 className="text-xl font-light">¿Te interesa esta propiedad?</h3>
                <p className="text-neutral-400 text-sm">Contáctanos para verificar disponibilidad y confirmar tu reserva.</p>
                
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-white text-neutral-900 rounded-full font-medium hover:bg-neutral-200 transition-colors uppercase tracking-widest text-xs"
                >
                  Consultar por WhatsApp
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}