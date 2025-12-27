
import React from 'react';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { VirtualTour } from '../../types';

interface VirtualTourManagerProps {
    virtualTours: VirtualTour[];
    setPreviewTour: (tour: VirtualTour) => void;
    deleteTour: (id: string) => Promise<void>;
}

export const VirtualTourManager: React.FC<VirtualTourManagerProps> = ({
    virtualTours,
    setPreviewTour,
    deleteTour
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">Virtual Tours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {virtualTours.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-slate-400">No virtual tours created yet.</div>
                ) : (
                    virtualTours.map(tour => (
                        <div key={tour.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div className="h-48 relative">
                                <img src={tour.stops[0]?.image} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <button onClick={() => setPreviewTour(tour)} className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:scale-110 transition-transform text-white">
                                        <Play size={24} fill="currentColor" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{tour.title}</h3>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xs font-bold text-slate-500">{tour.stops.length} Scenes</span>
                                    <Button variant="outline" size="sm" onClick={() => deleteTour(tour.id)}>Delete</Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
