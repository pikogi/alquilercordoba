import React, { useState, useEffect } from 'react';
import { Availability } from '@/api/client';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfToday } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Lock, Check } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function CalendarComponent({ propertyId, isOwner = false }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAvailability = async () => {
    setIsLoading(true);
    // Fetch all dates for this property
    // Optimally we would filter by date range, but for simplicity we fetch all for this property
    const records = await Availability.filter({
      property_id: propertyId
    });
    setBlockedDates(records.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    if (propertyId) {
      fetchAvailability();
    }
  }, [propertyId]);

  const toggleDate = async (day) => {
    if (!isOwner) return; // Only owners can toggle
    if (isBefore(day, startOfToday())) return; // Cannot change past

    const dateStr = format(day, 'yyyy-MM-dd');
    const existingRecord = blockedDates.find(d => d.date === dateStr);

    try {
      if (existingRecord) {
        // Unblock (delete)
        await Availability.delete(existingRecord.id);
        setBlockedDates(prev => prev.filter(d => d.id !== existingRecord.id));
      } else {
        // Block (create)
        const res = await Availability.create({
          property_id: propertyId,
          date: dateStr,
          reason: 'owner_occupied'
        });
        
        // Normalizar fecha siempre a yyyy-MM-dd
        const newRecord = {
          ...res,
          date: dateStr
        };
        
        setBlockedDates(prev => [...prev, newRecord]);
      }
    } catch (error) {
      console.error("Error updating calendar", error);
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="bg-white p-6 border border-neutral-100 rounded-lg shadow-sm max-w-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-lg capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-neutral-50 rounded-full"><ChevronLeft size={18} /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-neutral-50 rounded-full"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'].map(day => (
          <div key={day} className="text-xs text-neutral-400 font-medium uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for start of month offset if needed (simplified here, date-fns grid handles most) */}
        {/* We use grid-cols-7 so we might need prefix empty divs based on getDay() of first day */}
        {Array.from({ length: startOfMonth(currentDate).getDay() }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isBlocked = blockedDates.some(d => d.date === dateStr);
          const isPast = isBefore(day, startOfToday());
          
          return (
            <button
              key={day.toString()}
              onClick={() => toggleDate(day)}
              disabled={!isOwner || isPast}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-full transition-all duration-200 relative group",
                !isSameMonth(day, currentDate) && "text-neutral-300",
                isBlocked 
                  ? "bg-neutral-900 text-white hover:bg-neutral-800" 
                  : "hover:bg-neutral-100 text-neutral-700",
                isPast && "opacity-30 cursor-not-allowed hover:bg-transparent",
                isOwner && !isPast && !isBlocked && "hover:ring-1 hover:ring-neutral-300"
              )}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
              {isBlocked && isOwner && (
                <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border border-neutral-200 bg-white"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neutral-900"></div>
          <span>Ocupado / No disponible</span>
        </div>
      </div>
      
      {isOwner && (
        <p className="text-center text-xs text-neutral-400 mt-4 pt-4 border-t border-neutral-100">
          Haz clic en una fecha para bloquearla o desbloquearla.
        </p>
      )}
    </div>
  );
}