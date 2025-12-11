import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function PropertyHeaderGallery({ images = [], title = "Property" }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [lightboxRef, lightboxApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Sync selectedIndex when main carousel moves
    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            // Only update if lightbox is NOT controlling it (or if they are synced)
            // But if lightbox is open, we want to update selectedIndex from lightbox
            if (!isLightboxOpen) {
                setSelectedIndex(emblaApi.selectedScrollSnap());
            }
        };
        emblaApi.on('select', onSelect);
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi, isLightboxOpen]);

    // Sync selectedIndex when lightbox moves
    useEffect(() => {
        if (!lightboxApi) return;
        const onSelect = () => {
            setSelectedIndex(lightboxApi.selectedScrollSnap());
        };
        lightboxApi.on('select', onSelect);
        return () => lightboxApi.off('select', onSelect);
    }, [lightboxApi]);

    // Initialize lightbox position when opening
    useEffect(() => {
        if (isLightboxOpen && lightboxApi) {
            lightboxApi.reInit();
            lightboxApi.scrollTo(selectedIndex, true);
        }
    }, [isLightboxOpen, lightboxApi]); // Only depend on open/api, not index to avoid loops

    // Sync main carousel when selectedIndex changes (e.g. from lightbox)
    useEffect(() => {
        if (emblaApi && !isLightboxOpen) {
             emblaApi.scrollTo(selectedIndex);
        }
    }, [selectedIndex, emblaApi, isLightboxOpen]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    
    const lightboxScrollPrev = useCallback(() => lightboxApi && lightboxApi.scrollPrev(), [lightboxApi]);
    const lightboxScrollNext = useCallback(() => lightboxApi && lightboxApi.scrollNext(), [lightboxApi]);

    const openLightbox = (index) => {
        setSelectedIndex(index);
        setIsLightboxOpen(true);
    };

    const validImages = images.filter(img => img);

    if (validImages.length === 0) {
        return (
            <div className="h-[60vh] w-full bg-neutral-200 flex items-center justify-center">
                <span className="text-neutral-400">No images available</span>
            </div>
        );
    }

    return (
        <>
            {/* Main Header Gallery */}
            <div className="relative h-[50vh] md:h-[60vh] w-full bg-neutral-100 group select-none">
                <div className="overflow-hidden h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {validImages.map((src, index) => (
                            <div 
                                key={index} 
                                className="relative flex-[0_0_100%] min-w-0 h-full cursor-zoom-in active:cursor-grabbing"
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={src}
                                    alt={`${title} - Image ${index + 1}`}
                                    className="block h-full w-full object-cover"
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop'}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                {validImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                            onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                            onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                        
                        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                            {selectedIndex + 1} / {validImages.length}
                        </div>
                    </>
                )}
            </div>

            {/* Lightbox Dialog */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent 
                    className="max-w-[95vw] max-h-[95vh] p-0 border-none bg-black/95 rounded-lg md:rounded-2xl focus:outline-none [&>button]:hidden overflow-hidden"
                    aria-describedby="lightbox-description"
                >
                    <span id="lightbox-description" className="sr-only">Image gallery lightbox</span>
                    <div className="relative w-full h-[95vh] flex items-center justify-center">
                        {/* Custom Close Button */}
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 md:top-4 md:right-4 text-white hover:text-white bg-black/70 hover:bg-white/20 rounded-full z-[100] h-10 w-10 md:h-12 md:w-12 backdrop-blur-sm shadow-lg active:bg-black/70"
                            onClick={() => setIsLightboxOpen(false)}
                            aria-label="Close gallery"
                        >
                            <X className="h-6 w-6 md:h-7 md:w-7" />
                        </Button>

                        <div className="overflow-hidden w-full h-full" ref={lightboxRef}>
                            <div className="flex h-full items-center">
                                {validImages.map((src, index) => (
                                    <div key={index} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center p-0">
                                        <img
                                            src={src}
                                            alt={`${title} - Fullscreen ${index + 1}`}
                                            className="max-h-full max-w-full object-contain select-none"
                                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {validImages.length > 1 && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-white bg-black/70 hover:bg-white/20 active:bg-black/70 rounded-full h-10 w-10 md:h-12 md:w-12 backdrop-blur-sm z-[100] shadow-lg"
                                    onClick={lightboxScrollPrev}
                                >
                                    <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-white bg-black/70 hover:bg-white/20 active:bg-black/70 rounded-full h-10 w-10 md:h-12 md:w-12 backdrop-blur-sm z-[100] shadow-lg"
                                    onClick={lightboxScrollNext}
                                >
                                    <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
                                </Button>
                                
                                {/* Counter in Lightbox */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-sm z-[100] shadow-lg">
                                    {selectedIndex + 1} / {validImages.length}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}