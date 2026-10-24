export type UserRole = "organizer" | "volunteer";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  interests?: string[];
  avatar?: string;
  createdAt?: string;
}

export type EventCategory =
  | "environment"
  | "education"
  | "health"
  | "community"
  | "sports"
  | "arts"
  | "technology"
  | "charity"
  | "other";

export type EventStatus = "draft" | "published" | "closed" | "completed";

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: EventCategory;
  maxCapacity: number;
  registeredCount: number;
  availableSlots?: number;
  isFull?: boolean;
  requiredSkills: string[];
  registrationDeadline: string;
  status: EventStatus;
  organizer: {
    _id: string;
    name: string;
    email: string;
  };
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export type RegistrationStatus =
  | "registered"
  | "confirmed"
  | "attended"
  | "cancelled";

export interface Registration {
  _id: string;
  event: EventItem | string;
  volunteer: {
    _id: string;
    name: string;
    email: string;
    skills?: string[];
  };
  selectedSkill: string;
  status: RegistrationStatus;
  registeredAt: string;
}

export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  totalVolunteers: number;
  availableSlots: number;
  totalCapacity: number;
}

export interface CategoryStat {
  category: EventCategory;
  count: number;
}

export interface RegistrationStat {
  eventTitle: string;
  registered: number;
  capacity: number;
  utilization: number;
}

export interface VolunteerStatusStat {
  status: RegistrationStatus;
  count: number;
}

