
import { Agent, Listing } from './types';

export const AGENTS: Agent[] = [
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
        comment: 'Victoria marketed our Clifton home with absolute professionalism. Her network of buyers is unmatched. Sold in 3 days!',
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
        comment: 'Julian was very knowledgeable about the Winelands area. Great negotiation skills.',
        date: '2024-01-20'
      }
    ]
  },
  {
    id: 'a3',
    name: 'Elena Rostova',
    title: 'Luxury Consultant',
    image: 'https://picsum.photos/id/65/300/300',
    phone: '+27 72 555 0987',
    email: 'elena@mandated.co.za',
    sales: 'R820M Sold 2024',
    reviews: []
  }
];

export const LISTINGS: Listing[] = [
  {
    id: 'l1',
    title: 'The Clifton Obsidian',
    price: 285000000,
    address: '52 Nettleton Road, Clifton, Cape Town',
    beds: 5,
    baths: 6.5,
    size: 950, // m²
    image: 'https://picsum.photos/id/164/1200/800',
    images: ['https://picsum.photos/id/164/800/600', 'https://picsum.photos/id/188/800/600'],
    agentId: 'a1',
    description: 'Perched above the Atlantic Seaboard, this architectural masterpiece features floor-to-ceiling glass, an infinity pool blending with the ocean horizon, and a private elevator. The master suite encompasses the entire top floor.',
    isFeatured: true,
    status: 'active',
    propertyType: 'House'
  },
  {
    id: 'l2',
    title: 'Franschhoek Wine Estate',
    price: 145000000,
    address: 'Dieu Donne Way, Franschhoek, Winelands',
    beds: 8,
    baths: 9,
    size: 2200, // m²
    image: 'https://picsum.photos/id/122/1200/800',
    images: ['https://picsum.photos/id/122/800/600', 'https://picsum.photos/id/233/800/600'],
    agentId: 'a2',
    description: 'A meticulously restored Cape Dutch homestead surrounded by working vineyards. Features a temperature-controlled wine cellar, guest cottages, a commercial-grade kitchen, and panoramic mountain views.',
    isFeatured: true,
    status: 'on_show',
    propertyType: 'House',
    onShowDate: 'Sunday 14:00 - 17:00'
  },
  {
    id: 'l3',
    title: 'Sandton Skye Penthouse',
    price: 79000000,
    address: 'Maude Street, Sandton, Johannesburg',
    beds: 4,
    baths: 4.5,
    size: 650, // m²
    image: 'https://picsum.photos/id/184/1200/800',
    images: ['https://picsum.photos/id/184/800/600', 'https://picsum.photos/id/403/800/600'],
    agentId: 'a1',
    description: 'Dominating the richest square mile in Africa, this triplex penthouse features 360-degree city views, private security detail, a rooftop jacuzzi, and bespoke Italian interiors.',
    isFeatured: true,
    status: 'reduced',
    propertyType: 'Apartment'
  },
  {
    id: 'l4',
    title: 'Zimbali Coastal Villa',
    price: 42000000,
    address: 'Mahogany Drive, Zimbali Estate, KZN',
    beds: 5,
    baths: 5,
    size: 580, // m²
    image: 'https://picsum.photos/id/75/1200/800',
    images: ['https://picsum.photos/id/75/800/600'],
    agentId: 'a3',
    description: 'A modern tropical sanctuary nestled in the forest canopy. Features extensive entertainment decks, ocean glimpses, direct beach access, and access to world-class golf facilities.',
    isFeatured: false,
    status: 'new',
    propertyType: 'House'
  },
  {
    id: 'l5',
    title: 'Constantia Green',
    price: 55000000,
    address: 'Southern Cross Drive, Constantia',
    beds: 6,
    baths: 6,
    size: 1100,
    image: 'https://picsum.photos/id/28/1200/800',
    images: ['https://picsum.photos/id/28/800/600'],
    agentId: 'a2',
    description: 'A sprawling family estate set on 2 acres of lush manicured gardens. Includes a tennis court, borehole water system, and a separate entertainment pavilion.',
    isFeatured: false,
    status: 'active',
    propertyType: 'House'
  },
  {
    id: 'l6',
    title: 'Waterfall Equestrian',
    price: 38000000,
    address: 'Waterfall Estate, Midrand',
    beds: 4,
    baths: 4,
    size: 850,
    image: 'https://picsum.photos/id/49/1200/800',
    images: ['https://picsum.photos/id/49/800/600'],
    agentId: 'a3',
    description: 'Modern farmhouse architecture meets equestrian luxury. Stable facilities for 4 horses, paddocks, and a state-of-the-art smart home system.',
    isFeatured: false,
    status: 'active',
    propertyType: 'House'
  },
  {
    id: 'l7',
    title: 'Camps Bay Contemporary',
    price: 85000000,
    address: 'Geneva Drive, Camps Bay',
    beds: 5,
    baths: 5.5,
    size: 720,
    image: 'https://picsum.photos/id/58/1200/800',
    images: ['https://picsum.photos/id/58/800/600'],
    agentId: 'a1',
    description: 'Sunset views guaranteed. This multi-level villa offers rental income potential and luxury living with a rim-flow pool and cinema room.',
    isFeatured: false,
    status: 'sold',
    propertyType: 'House'
  },
  {
    id: 'l8',
    title: 'Umhlanga Arch Apartment',
    price: 12500000,
    address: 'Umhlanga Rocks Drive, Durban',
    beds: 2,
    baths: 2,
    size: 120,
    image: 'https://picsum.photos/id/238/1200/800',
    images: ['https://picsum.photos/id/238/800/600'],
    agentId: 'a3',
    description: 'High-rise luxury living in the heart of Umhlanga. Concierge service, facial recognition access, and immediate access to premium retail outlets.',
    isFeatured: false,
    status: 'new',
    propertyType: 'Apartment'
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
