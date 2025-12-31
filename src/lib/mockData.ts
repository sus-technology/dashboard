export interface App {
  id: string;
  name: string;
  status: 'Draft' | 'Live';
  lastUpdated: string;
  icon: string;
  downloads?: number;
}

export interface Template {
  id: string;
  name: string;
  category: 'E-commerce' | 'Chat' | 'Booking' | 'Social' | 'Utility';
  description: string;
  preview: string;
  usageCount: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  avatar?: string;
  isOnline: boolean;
  lastAction?: string;
}

export interface ActivityLog {
  id: string;
  type: 'app_created' | 'template_used' | 'team_action' | 'login' | 'settings_changed';
  description: string;
  timestamp: string;
  details?: string;
  user?: string;
}

export interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  avgSessionDuration: string;
  usageByDay: { day: string; users: number; sessions: number }[];
}

export const mockApps: App[] = [
  { id: '1', name: 'FoodDelivery Pro', status: 'Live', lastUpdated: '2024-01-15', icon: '🍔', downloads: 12500 },
  { id: '2', name: 'FitTracker', status: 'Live', lastUpdated: '2024-01-14', icon: '💪', downloads: 8300 },
  { id: '3', name: 'ChatConnect', status: 'Draft', lastUpdated: '2024-01-13', icon: '💬' },
  { id: '4', name: 'BookingMaster', status: 'Live', lastUpdated: '2024-01-12', icon: '📅', downloads: 5600 },
  { id: '5', name: 'ShopEasy', status: 'Draft', lastUpdated: '2024-01-11', icon: '🛒' },
];

export const mockTemplates: Template[] = [
  { id: '1', name: 'E-commerce Starter', category: 'E-commerce', description: 'Complete shopping app with cart and checkout', preview: '/E-commerce%20Starter.png', usageCount: 2340 },
  { id: '2', name: 'Chat Application', category: 'Chat', description: 'Real-time messaging with group support', preview: '/Chat%20Application.png', usageCount: 1890 },
  { id: '3', name: 'Booking System', category: 'Booking', description: 'Appointment scheduling with calendar', preview: '/Booking%20System.png', usageCount: 1560 },
  { id: '4', name: 'Social Feed', category: 'Social', description: 'Social media feed with posts and comments', preview: '/Social%20Feed.png', usageCount: 2100 },
  { id: '5', name: 'Task Manager', category: 'Utility', description: 'Todo list with categories and reminders', preview: '/Task%20Manager.png', usageCount: 1780 },
  { id: '6', name: 'Marketplace', category: 'E-commerce', description: 'Multi-vendor marketplace template', preview: '/Marketplace.png', usageCount: 980 },
];

export const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex@sustech.com', role: 'Owner', isOnline: true, lastAction: 'Updated Settings' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@sustech.com', role: 'Admin', isOnline: true, lastAction: 'Created new app' },
  { id: '3', name: 'Mike Wilson', email: 'mike@sustech.com', role: 'Editor', isOnline: false, lastAction: 'Edited template' },
  { id: '4', name: 'Emma Davis', email: 'emma@sustech.com', role: 'Viewer', isOnline: true, lastAction: 'Viewed analytics' },
];

export const mockActivityLogs: ActivityLog[] = [
  { id: '1', type: 'app_created', description: 'Created new app "ShopEasy"', timestamp: '2024-01-15T10:30:00', user: 'Sarah Chen', details: 'E-commerce template selected, 12 screens configured' },
  { id: '2', type: 'template_used', description: 'Used "Chat Application" template', timestamp: '2024-01-15T09:15:00', user: 'Mike Wilson', details: 'Template customized with dark theme' },
  { id: '3', type: 'team_action', description: 'Added Emma Davis to team', timestamp: '2024-01-14T16:45:00', user: 'Alex Johnson', details: 'Assigned Viewer role' },
  { id: '4', type: 'login', description: 'Login from new device', timestamp: '2024-01-14T14:20:00', user: 'Sarah Chen', details: 'Chrome on MacOS, San Francisco, CA' },
  { id: '5', type: 'settings_changed', description: 'Updated notification preferences', timestamp: '2024-01-14T11:00:00', user: 'Alex Johnson', details: 'Email notifications enabled for app deployments' },
  { id: '6', type: 'app_created', description: 'Created new app "FitTracker"', timestamp: '2024-01-13T15:30:00', user: 'Alex Johnson', details: 'Utility template selected, 8 screens configured' },
];

export const mockAnalytics: AnalyticsData = {
  totalUsers: 24680,
  activeUsers: 8945,
  totalSessions: 156780,
  avgSessionDuration: '4m 32s',
  usageByDay: [
    { day: 'Mon', users: 1200, sessions: 3400 },
    { day: 'Tue', users: 1450, sessions: 4100 },
    { day: 'Wed', users: 1380, sessions: 3900 },
    { day: 'Thu', users: 1520, sessions: 4300 },
    { day: 'Fri', users: 1680, sessions: 4800 },
    { day: 'Sat', users: 980, sessions: 2800 },
    { day: 'Sun', users: 735, sessions: 2100 },
  ],
};

export const overviewStats = {
  totalApps: 12,
  activeApps: 8,
  totalDownloads: 45600,
  monthlyGrowth: 23,
};
