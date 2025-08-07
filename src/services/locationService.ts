interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  type: 'business' | 'landmark' | 'address';
  coordinates?: { lat: number; lng: number };
}

class LocationService {
  private suggestions: (LocationSuggestion & { coordinates: { lat: number; lng: number } })[] = [
    { id: '1', name: 'Mall of Africa', address: 'Waterfall City, Midrand', type: 'business', coordinates: { lat: -25.9269, lng: 28.1122 } },
    { id: '2', name: 'Sandton City', address: 'Sandton, Johannesburg', type: 'business', coordinates: { lat: -26.1076, lng: 28.0567 } },
    { id: '3', name: 'OR Tambo Airport', address: 'Kempton Park, Johannesburg', type: 'landmark', coordinates: { lat: -26.1367, lng: 28.2411 } },
    { id: '4', name: 'University of Witwatersrand', address: 'Braamfontein, Johannesburg', type: 'landmark', coordinates: { lat: -26.1929, lng: 28.0305 } },
    { id: '5', name: 'Nelson Mandela Square', address: 'Sandton, Johannesburg', type: 'landmark', coordinates: { lat: -26.1076, lng: 28.0567 } },
    { id: '6', name: 'Rosebank Mall', address: 'Rosebank, Johannesburg', type: 'business', coordinates: { lat: -26.1448, lng: 28.0436 } },
    { id: '7', name: 'Menlyn Park Mall', address: 'Pretoria, Gauteng', type: 'business', coordinates: { lat: -25.7879, lng: 28.2772 } },
    { id: '8', name: 'Carlton Centre', address: 'Johannesburg CBD', type: 'landmark', coordinates: { lat: -26.2041, lng: 28.0473 } },
    { id: '9', name: 'FNB Stadium', address: 'Nasrec, Johannesburg', type: 'landmark', coordinates: { lat: -26.2349, lng: 27.9824 } },
    { id: '10', name: 'Johannesburg Zoo', address: 'Parkview, Johannesburg', type: 'landmark', coordinates: { lat: -26.1672, lng: 28.0406 } }
  ];

  async searchLocations(query: string): Promise<LocationSuggestion[]> {
    if (!query || query.length < 2) return [];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const filtered = this.suggestions.filter(location =>
      location.name.toLowerCase().includes(query.toLowerCase()) ||
      location.address.toLowerCase().includes(query.toLowerCase())
    );
    
    return filtered.slice(0, 5);
  }
}

export const locationService = new LocationService();
export type { LocationSuggestion };