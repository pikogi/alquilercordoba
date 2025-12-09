import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MapPin, Users, ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PropertyCard({ property }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [property.cover_image, ...(property.images || [])].filter(Boolean);

  const scrollPrev = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="group block h-full">
      <div 
        className="relative overflow-hidden aspect-[4/5] bg-neutral-100 mb-4 rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-full w-full" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((src, index) => (
              <div key={index} className="flex-[0_0_100%] min-w-0 h-full relative">
                <Link to={`${createPageUrl('PropertyDetail')}?id=${property.id}`} className="block h-full w-full">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    src={src} 
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop'}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-sm z-10 pointer-events-none">
          ${property.price_per_night} / noche
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 opacity-0 transition-opacity duration-200 z-20",
                isHovered && "opacity-100"
              )}
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4 text-neutral-900" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 opacity-0 transition-opacity duration-200 z-20",
                isHovered && "opacity-100"
              )}
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4 text-neutral-900" />
            </Button>
            
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
              {images.slice(0, 5).map((_, idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full bg-white/50 transition-all shadow-sm",
                    idx === selectedIndex && "bg-white scale-110",
                    // Hide dots if too many, just show first 5 to avoid clutter
                    images.length > 5 && idx === 4 && selectedIndex > 4 && "bg-white/50" 
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
      
      <Link to={`${createPageUrl('PropertyDetail')}?id=${property.id}`} className="block">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium leading-tight mb-1 group-hover:text-neutral-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-neutral-500 text-sm gap-4 mt-2">
              <span className="flex items-center gap-1">
                <MapPin size={14} /> {property.location}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} /> {property.capacity} Huéspedes
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}