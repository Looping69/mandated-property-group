import React from 'react';
import { PropertyCard } from '../components/PropertyCard';
import { Listing } from '../types';
import { useData } from '../contexts/DataContext';

interface ListingsPageProps {
    onViewListingDetails: (listing: Listing) => void;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({ onViewListingDetails }) => {
    const { listings } = useData();

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div>
                <h2 className="text-4xl font-serif text-slate-900 mb-2">Exclusive Portfolio</h2>
                <p className="text-slate-500 font-bold">Curated properties for the discerning buyer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
                {listings.map(l => (
                    <PropertyCard key={l.id} listing={l} onViewDetails={onViewListingDetails} />
                ))}
            </div>
        </div>
    );
};
