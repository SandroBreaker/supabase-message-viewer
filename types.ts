
export interface Message {
  id: string;
  sender_id: string | null;
  text: string | null;
  media_url: string | null;
  type: string | 'text';
  created_at: string;
  read_at: string | null;
  reactions: Record<string, any> | null;
  is_edited: boolean;
  reply_to_id: string | null;
  is_deleted: boolean;
  delivered_at: string | null;
}

export interface Profile {
  id: string;
  username?: string;
  avatar_url?: string;
  full_name?: string;
}

export interface ChatSession {
  user1: string;
  user2: string;
}
