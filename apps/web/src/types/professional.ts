// Types partagés pour les professionnels
export interface Professional {
  id: number;
  name: string;
  email: string;
  city: string;
  serviceType: string;
  description?: string | null;
  languages?: string;
  slug?: string | null;
  verified?: boolean;
  profileImage?: string | null;
  badge?: string | null;
  averageRating?: number;
  totalReviews?: number;
  [key: string]: unknown; // Pour les propriétés additionnelles
}

export interface Review {
  id: number;
  bookingId: number;
  professionalId: number;
  clientId: number;
  rating: number;
  comment?: string | null;
  createdAt: Date | string;
}

// Type pour les routes API avec params
export interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}



