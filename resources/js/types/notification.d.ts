export interface Notification {
    id: string;
    title: string;
    message: string;
    url?: string | null;
    type?: string | null;
    isRead: boolean;
    timestamp: string; // ISO string
    read_at?: string | null; // ISO string or null
}
