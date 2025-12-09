import React, { useEffect, useState } from 'react';
import { Property, auth } from '@/api/client';
import { Loader2, AlertCircle, Plus, Edit, PlusCircle } from 'lucide-react';
import CalendarComponent from '@/components/CalendarComponent';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";

export default function OwnerDashboard() {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const currentUser = await auth.me();
        setUser(currentUser);
        
        // Fetch properties owned by this user
        // We filter by owner_email matches current user email
        const res = await Property.filter({ owner_email: currentUser.email });
        const data = Array.isArray(res) ? res : (res.data || []);
        setProperties(data);
      } catch (e) {
        // User not logged in, redirect handled by button usually but here we show state
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-2xl font-light mb-4">Acceso Restringido</h2>
        <p className="text-neutral-500 mb-8 max-w-md">Debes iniciar sesión para acceder al panel de propietarios y gestionar la disponibilidad de tus propiedades.</p>
        <button 
          onClick={() => navigate(createPageUrl('Login'))}
          className="px-8 py-3 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Panel de Control</h1>
          <p className="text-neutral-500">Bienvenido, {user.first_name || 'Propietario'}. Gestiona tus propiedades.</p>
        </div>
        <Button 
          onClick={() => navigate(createPageUrl('ManageProperty'))}
          className="bg-neutral-900 text-white rounded-full hover:bg-neutral-800"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nueva Propiedad
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-12 text-center">
          <AlertCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No tienes propiedades asignadas</h3>
          <p className="text-neutral-500 max-w-md mx-auto">
            Si eres propietario y no ves tus propiedades aquí, por favor contacta a la administración para que vinculen tu email a tus propiedades.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {properties.map(prop => (
            <div key={prop.id} className="bg-white border border-neutral-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center p-4 border-b border-neutral-50 bg-neutral-50/50">
                <div className="flex items-center gap-4">
                    <img src={prop.cover_image} alt={prop.title} className="w-16 h-16 object-cover rounded-md" />
                    <div>
                    <h3 className="font-medium text-lg">{prop.title}</h3>
                    <Link to={`${createPageUrl('PropertyDetail')}?id=${prop.id}`} className="text-xs text-neutral-500 hover:text-neutral-900 underline">
                        Ver publicación
                    </Link>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`${createPageUrl('ManageProperty')}?id=${prop.id}`)}
                    className="text-neutral-500 hover:text-neutral-900"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                </Button>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium uppercase tracking-wide text-neutral-500 mb-4">Gestionar Calendario</h4>
                    <p className="text-sm text-neutral-400 mb-6">
                      Selecciona las fechas en el calendario para marcarlas como NO disponibles. Las fechas oscuras indican que la propiedad está ocupada o bloqueada.
                    </p>
                  </div>
                  <div className="mx-auto">
                    <CalendarComponent propertyId={prop.id} isOwner={true} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}