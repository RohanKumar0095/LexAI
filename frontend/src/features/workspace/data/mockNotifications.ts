import type { Notification } from '../types/user';

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Daily Law Learning Available',
    type: 'daily-law',
    message: 'Today\'s Topic: "Can police search your phone without permission?" - Complete the short quiz to earn 100 XP.',
    timestamp: 'Today, 9:00 AM',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New Legal Reform Notification',
    type: 'law-update',
    message: 'The Ministry of Consumer Affairs has issued new rules for Dark Patterns in e-commerce websites. Review your updated rights.',
    timestamp: 'Yesterday, 2:30 PM',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Streak Alert!',
    type: 'learning-reminder',
    message: 'Great job! You are on a 1-day learning streak. Complete today\'s law article to keep it going.',
    timestamp: 'Yesterday, 8:00 AM',
    read: true
  },
  {
    id: 'notif-4',
    title: 'Emergency Help Active',
    type: 'important-alert',
    message: 'SOS Hotline numbers verified for your current location (Delhi NCR). Keep this active for quick access.',
    timestamp: '3 days ago',
    read: true
  }
];
