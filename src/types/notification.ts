export interface TicketNotification {
  id: string;
  user_id: string;
  ticket_id: string;
  type: string;
  message: string;
  created_at: string;
  is_read: boolean;
}
