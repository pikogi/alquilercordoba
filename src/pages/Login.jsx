import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '@/api/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPageUrl } from '@/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || createPageUrl('OwnerDashboard');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await auth.login(email, password);
      if (result.token) {
        toast.success("Sesión iniciada correctamente");
        window.location.href = returnUrl || createPageUrl('OwnerDashboard');
      }
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-8">
          <h1 className="text-3xl font-light text-neutral-900 mb-2">Iniciar Sesión</h1>
          <p className="text-neutral-500 mb-8">Accede a tu panel de propietarios</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800 h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100">
            <p className="text-sm text-neutral-500 text-center mb-4">
              Usuarios de prueba:
            </p>
            <div className="space-y-2 text-xs text-neutral-400">
              <div className="bg-neutral-50 p-3 rounded">
                <div className="font-medium text-neutral-600">Admin:</div>
                <div>admin@example.com / admin123</div>
              </div>
              <div className="bg-neutral-50 p-3 rounded">
                <div className="font-medium text-neutral-600">Propietario:</div>
                <div>propietario@example.com / password123</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

