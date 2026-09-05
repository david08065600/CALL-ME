export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  avatar_url?: string;
  credits: number;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface Call {
  id: string;
  creator_id: string;
  status: 'pending' | 'active' | 'ended';
  created_at: Date;
  ended_at?: Date;
  effect_enabled: boolean;
}

export interface CallParticipant {
  id: string;
  call_id: string;
  user_id: string;
  joined_at: Date;
  left_at?: Date;
}

export interface FaceEffect {
  id: string;
  user_id: string;
  image_url: string;
  name: string;
  created_at: Date;
}

export interface CreditTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'grant' | 'usage' | 'refund';
  description: string;
  created_at: Date;
}

export interface UserSettings {
  id: string;
  user_id: string;
  default_camera?: string;
  default_microphone?: string;
  default_resolution: string;
  dark_mode: boolean;
  effect_intensity: number;
  created_at: Date;
  updated_at: Date;
}
