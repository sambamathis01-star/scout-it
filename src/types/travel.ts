export type TravelStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';

export interface TravelRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  purpose: string;
  destination: {
    city: string;
    address: string;
  };
  dates: {
    start: string;
    end: string;
  };
  schedule: {
    arrivalTime: string;
    arrivalPreference: 'morning' | 'evening' | 'both' | 'specific';
    departureTime: string;
    departurePreference: 'evening' | 'next_day' | 'both' | 'specific';
  };
  accommodation: {
    hotelPreference: string;
    location: string;
  };
  equipment: {
    laptop: boolean;
    simCard: boolean;
    other: string;
  };
  status: TravelStatus;
  createdAt: string;
  validatorNotes?: string;
}

export interface ChatMessage {
  id: string;
  travelId: string;
  sender: string;
  senderType: 'requester' | 'validator';
  message: string;
  timestamp: string;
}