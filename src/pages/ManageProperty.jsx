import React, { useEffect, useState } from 'react';
import { Property, auth } from '@/api/client';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PropertyForm from '@/components/PropertyForm';
import { toast } from "sonner";

export default function ManageProperty() {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const query = new URLSearchParams(window.location.search);
  const id = query.get('id'); // If id exists, it's edit mode
  
  useEffect(() => {
    const init = async () => {
      // Check auth
      try {
        const user = await auth.me();
        if (!user) {
            navigate(createPageUrl('OwnerDashboard'));
            return;
        }

        if (id) {
            const res = await Property.filter({ id: id });
            const data = Array.isArray(res) ? res : (res.data || []);
            if (data && data.length > 0) {
                // Verify ownership (optional strict check, dashboard handles visibility)
                if (data[0].owner_email !== user.email && user.role !== 'admin') {
                     toast.error("No tienes permisos para editar esta propiedad");
                     navigate(createPageUrl('OwnerDashboard'));
                     return;
                }
                setProperty(data[0]);
            }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
        const user = await auth.me();
        
        if (id) {
            // Update
            await Property.update(id, data);
            toast.success("Propiedad actualizada correctamente");
        } else {
            // Create
            await Property.create({
                ...data,
                owner_email: user.email // Assign current user as owner
            });
            toast.success("Propiedad creada correctamente");
        }
        navigate(createPageUrl('OwnerDashboard'));
    } catch (e) {
        console.error(e);
        toast.error("Error al guardar");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Link to={createPageUrl('OwnerDashboard')} className="p-2 hover:bg-white rounded-full transition-colors">
                <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-light text-neutral-900">
                {id ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </h1>
        </div>

        <PropertyForm 
            initialData={property} 
            onSubmit={handleSubmit}
            onCancel={() => navigate(createPageUrl('OwnerDashboard'))}
        />
      </div>
    </div>
  );
}