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

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => {
            if (!isLightboxOpen) {
                setSelectedIndex(emblaApi.selectedScrollSnap());
            }
        };
        emblaApi.on('select', onSelect);
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi, isLightboxOpen]);

    useEffect(() => {
        if (!lightboxApi) return;
        const onSelect = () => setSelectedIndex(lightboxApi.selectedScrollSnap());
        lightboxApi.on('select', onSelect);
        return () => lightboxApi.off('select', onSelect);
    }, [lightboxApi]);

    useEffect(() => {
        if (isLightboxOpen && lightboxApi) {
            lightboxApi.reInit();
            lightboxApi.scrollTo(selectedIndex, true);
        }
    }, [isLightboxOpen, lightboxApi]);

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
            {/* Main Gallery */}
            <div className="relative h-[50vh] md:h-[60vh] w-full bg-neutral-100 group select-none">
                <div className="overflow-hidden h-full" ref={emblaRef}>
                    <div className="flex h-full">
                        {validImages.map((src, index) => (
                            <div 
                                key={index} 
                                className="relative flex-[0_0_100%] min-w-0 h-full cursor-zoom-in"
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={src}
                                    alt={`${title} - Image ${index + 1}`}
                                    className="block h-full w-full object-contain bg-black"
                                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80'}
                                />
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
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full flex"
                            onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full flex"
                            onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>

                        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                            {selectedIndex + 1} / {validImages.length}
                        </div>
                    </>
                )}
            </div>

            {/* Lightbox */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent 
                    className="max-w-[100vw] h-[100vh] w-screen h-screen p-0 border-none bg-black overflow-hidden [&>button]:hidden"
                >
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                        
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 rounded-full h-10 w-10"
                            onClick={() => setIsLightboxOpen(false)}
                        >
                            <X className="h-6 w-6" />
                        </Button>

                        <div className="overflow-hidden w-full h-full" ref={lightboxRef}>
                            <div className="flex h-full items-center">
                                {validImages.map((src, index) => (
                                    <div key={index} className="flex-[0_0_100%] min-w-0 h-full flex items-center justify-center">
                                        <img
                                            src={src}
                                            alt={`${title} - Fullscreen ${index + 1}`}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80'}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NAV buttons mobile + desktop */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full h-12 w-12 flex"
                            onClick={lightboxScrollPrev}
                        >
                            <ChevronLeft className="h-10 w-10" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-white/10 hover:bg-white/20 rounded-full h-12 w-12 flex"
                            onClick={lightboxScrollNext}
                        >
                            <ChevronRight className="h-10 w-10" />
                        </Button>

                        <div className="absolute top-6 left-6 text-white font-medium text-sm">
                            {selectedIndex + 1} / {validImages.length}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
