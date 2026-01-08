import { Agent, Listing, VirtualTour, Contractor, Conveyancer } from '../types';

export const MOCK_AGENTS: Agent[] = [
    {
        id: 'a1',
        name: 'Victoria St. Clair',
        title: 'Senior Partner',
        image: 'https://picsum.photos/id/64/300/300',
        phone: '+27 82 555 0192',
        email: 'victoria@mandated.co.za',
        sales: 'R2.5B Sold 2024',
        reviews: [
            {
                id: 'r1',
                author: 'Michael & Sarah Jennings',
                rating: 5,
                comment: 'Victoria marketed our Clifton home with absolute professionalism. Sold in 3 days!',
                date: '2024-02-15'
            },
            {
                id: 'r2',
                author: 'James Rothchild',
                rating: 5,
                comment: 'Exceptional service. Victoria understands the luxury market better than anyone else.',
                date: '2023-11-30'
            }
        ]
    },
    {
        id: 'a2',
        name: 'Julian Thorne',
        title: 'Estate Director',
        image: 'https://picsum.photos/id/91/300/300',
        phone: '+27 83 555 0123',
        email: 'julian@mandated.co.za',
        sales: 'R980M Sold 2024',
        reviews: [
            {
                id: 'r3',
                author: 'The Van Der Merwes',
                rating: 4,
                comment: 'Julian was very knowledgeable about the Winelands area.',
                date: '2024-01-20'
            }
        ]
    }
];

export const MOCK_LISTINGS: Listing[] = [
    {
        id: 'l1',
        title: 'The Clifton Obsidian',
        price: 285000000,
        address: '52 Nettleton Road, Clifton, Cape Town',
        beds: 5,
        baths: 6.5,
        garage: 'Triple',
        pool: 'private',
        image: 'https://picsum.photos/id/164/1200/800',
        images: ['https://picsum.photos/id/164/800/600', 'https://picsum.photos/id/188/800/600'],
        agentId: 'a1',
        description: 'Perched above the Atlantic Seaboard, this architectural masterpiece features floor-to-ceiling glass and an infinity pool.',
        isFeatured: true,
        status: 'active',
        propertyType: 'House',
        isPetFriendly: true,
        viewingType: 'appointment'
    }
];

export const MOCK_CONTRACTORS: Contractor[] = [
    {
        id: 'c1',
        name: 'Elite Pool & Garden',
        trade: 'Landscaping',
        location: 'Cape Town',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1558905619-174091969236?q=80&w=300&h=300&fit=crop',
        phone: '+27 21 555 0192',
        email: 'contact@elitepools.co.za',
        description: 'Specializing in luxury outdoor spaces and infinity pool maintenance.',
        isVerified: true,
        hourlyRate: 850
    }
];

export const MOCK_CONVEYANCERS: Conveyancer[] = [
    {
        id: 'conv1',
        name: 'Steyn & Associates',
        specialist: 'Property Transfers',
        location: 'Pretoria',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&h=300&fit=crop',
        phone: '+27 12 555 0123',
        website: 'https://steynlegal.co.za',
        isVerified: true
    }
];

export const MOCK_TOURS: VirtualTour[] = [
    {
        id: 'vt1',
        title: 'Clifton Obsidian Walkthrough',
        agentId: 'a1',
        listingId: 'l1',
        date: new Date().toISOString(),
        status: 'published',
        stops: [
            {
                id: 's1',
                title: 'Entrance Hall',
                description: 'A grand entrance featuring imported Italian marble.',
                image: 'https://picsum.photos/id/164/800/600',
                timestamp: Date.now()
            }
        ]
    }
];

export const PROVINCES_CITIES: Record<string, string[]> = {
    'Eastern Cape': ['Gqeberha (Port Elizabeth)', 'East London', 'Mthatha', 'Makhanda', 'Kariega', 'Queenstown'],
    'Free State': ['Bloemfontein', 'Welkom', 'Sasolburg', 'Bethlehem', 'Kroonstad', 'Parys'],
    'Gauteng': ['Johannesburg', 'Pretoria', 'Soweto', 'Sandton', 'Midrand', 'Centurion', 'Benoni', 'Krugersdorp', 'Soshanguve'],
    'KwaZulu-Natal': ['Durban', 'Pietermaritzburg', 'Umhlanga', 'Ballito', 'Richards Bay', 'Newcastle', 'Ladysmith'],
    'Limpopo': ['Polokwane', 'Tzaneen', 'Musina', 'Phalaborwa', 'Mokopane', 'Thohoyandou'],
    'Mpumalanga': ['Mbombela (Nelspruit)', 'Emalahleni (Witbank)', 'Secunda', 'Ermelo', 'Middelburg', 'White River'],
    'Northern Cape': ['Kimberley', 'Upington', 'Springbok', 'Kuruman', 'De Aar', 'Kathu'],
    'North West': ['Mahikeng', 'Klerksdorp', 'Rustenburg', 'Potchefstroom', 'Brits', 'Vryburg'],
    'Western Cape': ['Cape Town', 'Stellenbosch', 'George', 'Paarl', 'Hermanus', 'Mossel Bay', 'Knysna', 'Worcester', 'Somerset West']
};
