export interface Equipment {
  id: string;
  type: 'laptop' | 'simcard' | 'tablet' | 'other';
  model: string;
  serialNumber: string;
  currentUser?: string;
  currentLocation?: string;
  status: 'available' | 'assigned' | 'in_transit' | 'maintenance';
}

export interface EquipmentHistory {
  id: string;
  equipmentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  travelId: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'completed' | 'ongoing' | 'cancelled';
  purpose: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  currentTravel?: {
    destination: string;
    startDate: string;
    endDate: string;
  };
}