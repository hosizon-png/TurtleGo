export type ActivityType = 'transit' | 'food' | 'activity' | 'leisure' | 'hotel';

export interface Activity {
  id: string;
  dayId: number; // e.g. 1, 2, 3, 4, 5
  time: string; // e.g. "10:00 AM"
  title: string;
  description: string;
  type: ActivityType;
  tags: string[];
  locationName: string;
  imageUrl?: string;
  coordinates: { x: number; y: number }; // Percentage coords on our beautiful simulated vector map
  isCompleted?: boolean;
}

export interface Trip {
  id: string;
  name: string;
  dateRange: string;
  destination: string;
  description: string;
  daysCount: number;
  activities: Activity[];
  imageUrl?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
  action?: {
    type: 'adjust_day3' | 'relaxed_morning' | 'add_event' | 'reschedule';
    label: string;
    description: string;
  };
}

export interface QuickTip {
  id: string;
  title: string;
  category: 'Local secrets' | 'Transport' | 'Food &' | 'Budget' | 'Packing';
  content: string;
  icon: string;
}
