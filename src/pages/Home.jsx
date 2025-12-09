import React, { useEffect, useState } from 'react';
import { Property, Availability } from '@/api/client';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import { ArrowRight, Loader2, Search, MapPin, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format, isWithinInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [allProperties, setAllProperties] = useState([]);
  const [allAvailability, setAllAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [locationFilter, setLocationFilter] = useState('');
  const [guests, setGuests] = useState('');
  const [date, setDate] = useState({ from: undefined, to: undefined });

  const uniqueLocations = Array.from(new Set(allProperties.map(p => p.location).filter(Boolean)));

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch properties
        let props = [];
        try {
            const propRes = await Property.list();
            props = Array.isArray(propRes) ? propRes : (propRes.data || []);
        } catch (e) {
            console.error("Error fetching properties", e);
        }

        // Fetch availability - use .list() correctly without query object
        let avail = [];
        try {
            const avRes = await Availability.list('-date', 1000);
            avail = Array.isArray(avRes) ? avRes : (avRes.data || []);
        } catch (e) {
            console.error("Error fetching availability", e);
        }
        
        setAllProperties(props);
        setProperties(props);
        setAllAvailability(avail);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = allProperties;
    
    if (locationFilter && locationFilter !== 'all_locations_clear_filter') {
      filtered = filtered.filter(p => 
        p.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (guests) {
      filtered = filtered.filter(p => (p.capacity || 0) >= parseInt(guests));
    }

    if (date?.from && date?.to) {
       filtered = filtered.filter(p => {
            const pBlocked = allAvailability.filter(a => a.property_id === p.id);
            const hasConflict = pBlocked.some(block => {
                const blockDate = parseISO(block.date);
                return isWithinInterval(blockDate, { start: date.from, end: date.to });
            });
            return !hasConflict;
       });
    }
    
    setProperties(filtered);
  }, [locationFilter, guests, date, allProperties, allAvailability]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full bg-neutral-900 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
           <motion.img 
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
             src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop"
             className="w-full h-full object-cover opacity-70" 
             alt="Hero" 
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="inline-block px-3 py-1 mb-6 border border-white/30 rounded-full bg-white/10 backdrop-blur-md">
              <span className="text-xs font-medium tracking-widest text-white uppercase">Alquileres Temporarios Premium</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-white mb-8 leading-[0.9]">
              Encuentra tu lugar <br />
              <span className="font-serif italic text-neutral-300">ideal en CBA.</span>
            </h1>
            <p className="text-lg md:text-xl font-light text-white/70 max-w-lg leading-relaxed mb-10 border-l border-white/20 pl-6">
              Propiedades únicas para experiencias que van más allá de una estadía.
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => document.getElementById('properties-section').scrollIntoView({ behavior: 'smooth' })}
                className="h-14 px-8 bg-white text-neutral-900 rounded-full hover:bg-neutral-200 transition-colors text-sm font-medium tracking-widest uppercase"
              >
                Ver Propiedades
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties-section" className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-3xl font-light text-neutral-900 mb-2">Casas Disponibles</h2>
            <p className="text-neutral-500 font-light">Explora todas las propiedades disponibles.</p>
          </div>

          {/* Search Filters */}
          <div className="flex flex-col lg:flex-row gap-3 w-full md:w-auto bg-white p-2 rounded-xl border border-neutral-100 shadow-sm items-center">
            
            {/* Location */}
            <div className="w-full md:w-auto">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[200px] border-none shadow-none focus:ring-0 pl-3 h-10 text-neutral-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <SelectValue placeholder="Ubicación" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_locations_clear_filter">Todas las ubicaciones</SelectItem>
                  {uniqueLocations.map((loc, idx) => (
                    <SelectItem key={idx} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-px h-6 bg-neutral-200 hidden lg:block"></div>
            
            {/* Guests Select */}
            <div className="w-full md:w-auto">
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="w-full md:w-[150px] border-none shadow-none focus:ring-0 pl-3 h-10 text-neutral-600">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-neutral-400" />
                        <SelectValue placeholder="Huéspedes" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num} Huéspedes</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>

            <div className="w-px h-6 bg-neutral-200 hidden lg:block"></div>

            {/* Date Range Picker */}
            <div className="w-full md:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className={cn(
                        "w-full md:w-[240px] justify-start text-left font-normal border-none hover:bg-transparent shadow-none h-10 px-3",
                        !date?.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-neutral-400" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "d MMM", { locale: es })} -{" "}
                            {format(date.to, "d MMM", { locale: es })}
                          </>
                        ) : (
                          format(date.from, "d MMM, yyyy", { locale: es })
                        )
                      ) : (
                        <span className="text-neutral-400">Seleccionar fechas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={1}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
            </div>

            <Button className="w-full md:w-auto bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 h-10 px-4">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-neutral-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {properties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && properties.length === 0 && (
          <div className="text-center py-20 bg-neutral-50 rounded-lg">
            <p className="text-neutral-500">No hay propiedades disponibles en este momento.</p>
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="bg-neutral-50 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-6">¿Eres propietario?</h2>
          <p className="text-neutral-500 mb-8 leading-relaxed">
            Gestionamos tu propiedad con el cuidado que merece. Únete a nuestra red exclusiva y maximiza tus ingresos con total tranquilidad.
          </p>
          <a 
             href="https://wa.me/5493572502550?text=Hola,%20esta%20es%20la%20propiedad%20que%20quisiera%20que%20me%20administren:"
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-all text-sm uppercase tracking-widest"
          >
            Administramos tu propiedad <ArrowRight size={16} />
          </a>
        </div>
      </section>
    </div>
  );
}