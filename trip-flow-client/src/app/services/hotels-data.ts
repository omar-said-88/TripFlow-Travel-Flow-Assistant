export interface MockHotel {
  id: number;
  name: string;
  city: string;
  country: string;
  stars: number;
  propertyType: 'Hotel' | 'Apartment' | 'Resort';
  price: number;
  ratingScore: number;
  reviews: number;
  tags: string[];
  image: string;
}

export const MOCK_HOTELS: MockHotel[] = [
  // ── Dubai ──────────────────────────────────────────────
  { id: 101, name: 'Burj Al Arab Jumeirah', city: 'Dubai', country: 'UAE', stars: 5, propertyType: 'Hotel', price: 980, ratingScore: 9.6, reviews: 12400, tags: ['Free Cancellation', 'Breakfast Included'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },
  { id: 102, name: 'Atlantis The Palm', city: 'Dubai', country: 'UAE', stars: 5, propertyType: 'Resort', price: 520, ratingScore: 9.1, reviews: 28700, tags: ['Free Cancellation', 'Pool Access'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 103, name: 'Address Downtown Dubai', city: 'Dubai', country: 'UAE', stars: 5, propertyType: 'Hotel', price: 310, ratingScore: 9.0, reviews: 18200, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 104, name: 'JW Marriott Marquis Dubai', city: 'Dubai', country: 'UAE', stars: 5, propertyType: 'Hotel', price: 270, ratingScore: 8.9, reviews: 15600, tags: ['Free Cancellation', 'Spa'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
  { id: 105, name: 'Premier Inn Dubai Marina', city: 'Dubai', country: 'UAE', stars: 3, propertyType: 'Hotel', price: 95, ratingScore: 7.8, reviews: 9300, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80' },
  { id: 106, name: 'Rove Downtown Dubai', city: 'Dubai', country: 'UAE', stars: 3, propertyType: 'Hotel', price: 80, ratingScore: 8.2, reviews: 11000, tags: ['Free Cancellation', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=600&q=80' },
  { id: 107, name: 'Sofitel Dubai The Palm', city: 'Dubai', country: 'UAE', stars: 5, propertyType: 'Resort', price: 420, ratingScore: 9.2, reviews: 7800, tags: ['Free Cancellation', 'Beach Access'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
  { id: 108, name: 'Dubai Marina Luxury Flat', city: 'Dubai', country: 'UAE', stars: 4, propertyType: 'Apartment', price: 150, ratingScore: 8.6, reviews: 3400, tags: ['Free Cancellation', 'Kitchen'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },

  // ── Paris ──────────────────────────────────────────────
  { id: 201, name: 'Hôtel Plaza Athénée', city: 'Paris', country: 'France', stars: 5, propertyType: 'Hotel', price: 850, ratingScore: 9.5, reviews: 10200, tags: ['Free Cancellation', 'Breakfast Included'], image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80' },
  { id: 202, name: 'Le Meurice', city: 'Paris', country: 'France', stars: 5, propertyType: 'Hotel', price: 780, ratingScore: 9.4, reviews: 8700, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' },
  { id: 203, name: 'Hôtel du Louvre', city: 'Paris', country: 'France', stars: 4, propertyType: 'Hotel', price: 290, ratingScore: 8.8, reviews: 14500, tags: ['Free Cancellation', 'City View'], image: 'https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?w=600&q=80' },
  { id: 204, name: 'Pullman Paris Montparnasse', city: 'Paris', country: 'France', stars: 4, propertyType: 'Hotel', price: 210, ratingScore: 8.5, reviews: 19800, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80' },
  { id: 205, name: 'ibis Paris Tour Eiffel', city: 'Paris', country: 'France', stars: 3, propertyType: 'Hotel', price: 115, ratingScore: 7.9, reviews: 22400, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 206, name: 'Marais District Studio', city: 'Paris', country: 'France', stars: 3, propertyType: 'Apartment', price: 130, ratingScore: 8.3, reviews: 5600, tags: ['Free Cancellation', 'Kitchen'], image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=600&q=80' },
  { id: 207, name: 'Four Seasons George V Paris', city: 'Paris', country: 'France', stars: 5, propertyType: 'Hotel', price: 1100, ratingScore: 9.7, reviews: 6300, tags: ['Breakfast Included', 'Spa'], image: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=600&q=80' },
  { id: 208, name: 'Paris Bastille Apartment', city: 'Paris', country: 'France', stars: 4, propertyType: 'Apartment', price: 170, ratingScore: 8.7, reviews: 4100, tags: ['Free Cancellation', 'Balcony'], image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },

  // ── London ─────────────────────────────────────────────
  { id: 301, name: 'The Savoy', city: 'London', country: 'United Kingdom', stars: 5, propertyType: 'Hotel', price: 720, ratingScore: 9.4, reviews: 11300, tags: ['Free Cancellation', 'Spa'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 302, name: 'Claridge\'s', city: 'London', country: 'United Kingdom', stars: 5, propertyType: 'Hotel', price: 680, ratingScore: 9.3, reviews: 8900, tags: ['Breakfast Included'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },
  { id: 303, name: 'Premier Inn London Bridge', city: 'London', country: 'United Kingdom', stars: 3, propertyType: 'Hotel', price: 110, ratingScore: 7.6, reviews: 31000, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 304, name: 'Canary Wharf Aparthotel', city: 'London', country: 'United Kingdom', stars: 4, propertyType: 'Apartment', price: 160, ratingScore: 8.5, reviews: 7200, tags: ['Free Cancellation', 'Kitchen'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { id: 305, name: 'Marriott Grosvenor Square', city: 'London', country: 'United Kingdom', stars: 5, propertyType: 'Hotel', price: 440, ratingScore: 9.0, reviews: 13500, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
  { id: 306, name: 'Shoreditch Boutique Hotel', city: 'London', country: 'United Kingdom', stars: 4, propertyType: 'Hotel', price: 220, ratingScore: 8.8, reviews: 6100, tags: ['Free Cancellation', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80' },

  // ── New York ───────────────────────────────────────────
  { id: 401, name: 'The Plaza Hotel', city: 'New York', country: 'United States', stars: 5, propertyType: 'Hotel', price: 890, ratingScore: 9.3, reviews: 14600, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80' },
  { id: 402, name: 'Marriott Marquis Times Square', city: 'New York', country: 'United States', stars: 4, propertyType: 'Hotel', price: 340, ratingScore: 8.7, reviews: 28900, tags: ['Free Cancellation', 'City View'], image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80' },
  { id: 403, name: 'The Standard High Line', city: 'New York', country: 'United States', stars: 4, propertyType: 'Hotel', price: 280, ratingScore: 8.9, reviews: 9800, tags: ['Free Cancellation', 'Rooftop Bar'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 404, name: 'Pod 51 Hotel', city: 'New York', country: 'United States', stars: 3, propertyType: 'Hotel', price: 115, ratingScore: 7.8, reviews: 18700, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 405, name: 'Brooklyn Heights Apartment', city: 'New York', country: 'United States', stars: 3, propertyType: 'Apartment', price: 190, ratingScore: 8.4, reviews: 4500, tags: ['Free Cancellation', 'Kitchen', 'Washer'], image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=600&q=80' },
  { id: 406, name: 'Mandarin Oriental New York', city: 'New York', country: 'United States', stars: 5, propertyType: 'Hotel', price: 760, ratingScore: 9.5, reviews: 7300, tags: ['Free Cancellation', 'Spa', 'Pool'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },

  // ── Rome ───────────────────────────────────────────────
  { id: 501, name: 'Hotel Hassler Roma', city: 'Rome', country: 'Italy', stars: 5, propertyType: 'Hotel', price: 620, ratingScore: 9.2, reviews: 8400, tags: ['Free Cancellation', 'Breakfast Included'], image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80' },
  { id: 502, name: 'Hotel de Russie', city: 'Rome', country: 'Italy', stars: 5, propertyType: 'Hotel', price: 590, ratingScore: 9.1, reviews: 7100, tags: ['Free Cancellation', 'Spa'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 503, name: 'NH Collection Roma Fori Imperiali', city: 'Rome', country: 'Italy', stars: 4, propertyType: 'Hotel', price: 195, ratingScore: 8.6, reviews: 12600, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 504, name: 'Trastevere Cozy Flat', city: 'Rome', country: 'Italy', stars: 3, propertyType: 'Apartment', price: 110, ratingScore: 8.8, reviews: 3900, tags: ['Free Cancellation', 'Kitchen'], image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },
  { id: 505, name: 'Generator Rome', city: 'Rome', country: 'Italy', stars: 3, propertyType: 'Hotel', price: 75, ratingScore: 7.9, reviews: 9200, tags: ['Free Cancellation', 'Free WiFi'], image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=600&q=80' },

  // ── Barcelona ──────────────────────────────────────────
  { id: 601, name: 'W Barcelona', city: 'Barcelona', country: 'Spain', stars: 5, propertyType: 'Resort', price: 380, ratingScore: 9.0, reviews: 16800, tags: ['Free Cancellation', 'Pool', 'Beach'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
  { id: 602, name: 'Hotel Arts Barcelona', city: 'Barcelona', country: 'Spain', stars: 5, propertyType: 'Hotel', price: 410, ratingScore: 9.1, reviews: 13200, tags: ['Free Cancellation', 'Sea View'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
  { id: 603, name: 'Mandarin Oriental Barcelona', city: 'Barcelona', country: 'Spain', stars: 5, propertyType: 'Hotel', price: 520, ratingScore: 9.4, reviews: 6700, tags: ['Free Cancellation', 'Spa', 'Pool'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },
  { id: 604, name: 'H10 Urquinaona Plaza', city: 'Barcelona', country: 'Spain', stars: 4, propertyType: 'Hotel', price: 155, ratingScore: 8.4, reviews: 11400, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 605, name: 'Eixample Design Apartment', city: 'Barcelona', country: 'Spain', stars: 3, propertyType: 'Apartment', price: 90, ratingScore: 8.6, reviews: 5100, tags: ['Free Cancellation', 'Kitchen', 'Terrace'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { id: 606, name: 'ibis Styles Barcelona Poblenou', city: 'Barcelona', country: 'Spain', stars: 3, propertyType: 'Hotel', price: 80, ratingScore: 7.7, reviews: 8900, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80' },

  // ── Istanbul ───────────────────────────────────────────
  { id: 701, name: 'Four Seasons Sultanahmet', city: 'Istanbul', country: 'Turkey', stars: 5, propertyType: 'Hotel', price: 450, ratingScore: 9.5, reviews: 7600, tags: ['Free Cancellation', 'Breakfast Included'], image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=600&q=80' },
  { id: 702, name: 'Çırağan Palace Kempinski', city: 'Istanbul', country: 'Turkey', stars: 5, propertyType: 'Hotel', price: 520, ratingScore: 9.3, reviews: 9100, tags: ['Free Cancellation', 'Bosphorus View'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 703, name: 'Radisson Blu Istanbul Pera', city: 'Istanbul', country: 'Turkey', stars: 5, propertyType: 'Hotel', price: 190, ratingScore: 8.7, reviews: 14300, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80' },
  { id: 704, name: 'Beyoglu Boutique Apartment', city: 'Istanbul', country: 'Turkey', stars: 3, propertyType: 'Apartment', price: 65, ratingScore: 8.5, reviews: 4600, tags: ['Free Cancellation', 'Kitchen'], image: 'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=600&q=80' },
  { id: 705, name: 'Armada Istanbul Old City', city: 'Istanbul', country: 'Turkey', stars: 4, propertyType: 'Hotel', price: 120, ratingScore: 8.3, reviews: 8200, tags: ['Free Cancellation', 'Sea View'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },

  // ── Maldives ───────────────────────────────────────────
  { id: 801, name: 'One&Only Reethi Rah', city: 'North Malé Atoll', country: 'Maldives', stars: 5, propertyType: 'Resort', price: 1800, ratingScore: 9.8, reviews: 4200, tags: ['All Inclusive', 'Private Beach'], image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
  { id: 802, name: 'Soneva Jani', city: 'Noonu Atoll', country: 'Maldives', stars: 5, propertyType: 'Resort', price: 2200, ratingScore: 9.9, reviews: 2800, tags: ['All Inclusive', 'Overwater Villa'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },
  { id: 803, name: 'COMO Cocoa Island', city: 'South Malé Atoll', country: 'Maldives', stars: 5, propertyType: 'Resort', price: 1400, ratingScore: 9.6, reviews: 3100, tags: ['Breakfast Included', 'Spa', 'Overwater Villa'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
  { id: 804, name: 'Kandima Maldives', city: 'Dhaalu Atoll', country: 'Maldives', stars: 5, propertyType: 'Resort', price: 650, ratingScore: 9.1, reviews: 6800, tags: ['Free Cancellation', 'Water Sports'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },

  // ── Tokyo ──────────────────────────────────────────────
  { id: 901, name: 'Park Hyatt Tokyo', city: 'Tokyo', country: 'Japan', stars: 5, propertyType: 'Hotel', price: 560, ratingScore: 9.4, reviews: 9800, tags: ['Free Cancellation', 'City View'], image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { id: 902, name: 'The Peninsula Tokyo', city: 'Tokyo', country: 'Japan', stars: 5, propertyType: 'Hotel', price: 690, ratingScore: 9.6, reviews: 7600, tags: ['Free Cancellation', 'Spa'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
  { id: 903, name: 'Shinjuku Granbell Hotel', city: 'Tokyo', country: 'Japan', stars: 4, propertyType: 'Hotel', price: 160, ratingScore: 8.7, reviews: 11200, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 904, name: 'Shibuya Crossing Apartment', city: 'Tokyo', country: 'Japan', stars: 3, propertyType: 'Apartment', price: 120, ratingScore: 8.9, reviews: 5300, tags: ['Free Cancellation', 'Kitchen'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },
  { id: 905, name: 'APA Hotel Shinjuku', city: 'Tokyo', country: 'Japan', stars: 3, propertyType: 'Hotel', price: 85, ratingScore: 7.8, reviews: 24600, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80' },

  // ── Bali ───────────────────────────────────────────────
  { id: 1001, name: 'Four Seasons Bali at Sayan', city: 'Ubud', country: 'Indonesia', stars: 5, propertyType: 'Resort', price: 780, ratingScore: 9.7, reviews: 5800, tags: ['Breakfast Included', 'Spa', 'Pool'], image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80' },
  { id: 1002, name: 'Alaya Resort Ubud', city: 'Ubud', country: 'Indonesia', stars: 5, propertyType: 'Resort', price: 350, ratingScore: 9.3, reviews: 7200, tags: ['Free Cancellation', 'Pool', 'Jungle View'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 1003, name: 'The Seminyak Beach Resort', city: 'Seminyak', country: 'Indonesia', stars: 5, propertyType: 'Resort', price: 290, ratingScore: 9.0, reviews: 9400, tags: ['Free Cancellation', 'Beach Access'], image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
  { id: 1004, name: 'Kuta Beach Hostel & Hotel', city: 'Kuta', country: 'Indonesia', stars: 3, propertyType: 'Hotel', price: 45, ratingScore: 7.6, reviews: 13100, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1544124499-58912cbddaad?w=600&q=80' },
  { id: 1005, name: 'Canggu Villa Retreat', city: 'Canggu', country: 'Indonesia', stars: 4, propertyType: 'Resort', price: 180, ratingScore: 8.9, reviews: 4700, tags: ['Free Cancellation', 'Private Pool'], image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80' },

  // ── Singapore ──────────────────────────────────────────
  { id: 1101, name: 'Marina Bay Sands', city: 'Singapore', country: 'Singapore', stars: 5, propertyType: 'Hotel', price: 490, ratingScore: 9.2, reviews: 42000, tags: ['Free Cancellation', 'Infinity Pool'], image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=600&q=80' },
  { id: 1102, name: 'Raffles Singapore', city: 'Singapore', country: 'Singapore', stars: 5, propertyType: 'Hotel', price: 720, ratingScore: 9.5, reviews: 11400, tags: ['Breakfast Included', 'Heritage Hotel'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80' },
  { id: 1103, name: 'Hotel Jen Orchardgateway', city: 'Singapore', country: 'Singapore', stars: 4, propertyType: 'Hotel', price: 195, ratingScore: 8.5, reviews: 15600, tags: ['Free Cancellation', 'Pool'], image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80' },
  { id: 1104, name: 'Chinatown Heritage Apartment', city: 'Singapore', country: 'Singapore', stars: 3, propertyType: 'Apartment', price: 130, ratingScore: 8.7, reviews: 3800, tags: ['Free Cancellation', 'Kitchen'], image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80' },

  // ── Amsterdam ──────────────────────────────────────────
  { id: 1201, name: 'Conservatorium Hotel', city: 'Amsterdam', country: 'Netherlands', stars: 5, propertyType: 'Hotel', price: 480, ratingScore: 9.4, reviews: 8100, tags: ['Free Cancellation', 'Spa'], image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
  { id: 1202, name: 'Hotel V Nesplein', city: 'Amsterdam', country: 'Netherlands', stars: 4, propertyType: 'Hotel', price: 195, ratingScore: 8.8, reviews: 12300, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80' },
  { id: 1203, name: 'Canal House Apartment', city: 'Amsterdam', country: 'Netherlands', stars: 4, propertyType: 'Apartment', price: 210, ratingScore: 9.0, reviews: 5600, tags: ['Free Cancellation', 'Canal View', 'Kitchen'], image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80' },
  { id: 1204, name: 'ibis Amsterdam Centre', city: 'Amsterdam', country: 'Netherlands', stars: 3, propertyType: 'Hotel', price: 110, ratingScore: 7.8, reviews: 19700, tags: ['Free Cancellation'], image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80' },
];

/**
 * Filter hotels by destination string.
 * Matches against city name or country name (case-insensitive partial match).
 * Returns all hotels when destination is empty.
 */
export function filterHotelsByDestination(dest: string): MockHotel[] {
  if (!dest || !dest.trim()) return MOCK_HOTELS;
  const q = dest.trim().toLowerCase();
  return MOCK_HOTELS.filter(h =>
    h.city.toLowerCase().includes(q) ||
    h.country.toLowerCase().includes(q) ||
    h.name.toLowerCase().includes(q)
  );
}
