import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No user authentication for public site
  }
});

// Admin client with service role (for admin operations)
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Types for our database
export interface Publication {
  id: string;
  slug: string;
  titre: string;
  chapeau: string;
  contenu_long: string;
  type_media_principal: 'texte' | 'image' | 'video' | 'audio';
  date_publication: string;
  categorie_id: string; // Obligatoire
  equipe_id: string;    // Obligatoire
  media_id?: string;
  image_url?: string;
  media_url?: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
   // Optional relation / helper fields returned by queries
  category?: string; // Optionnel, pour affichage seulement
  categorie_nom?: string; // name pulled from joined categories table
  equipe_nom?: string;    // name pulled from joined teams table
  categories?: { nom?: string } | null; // raw joined object when selecting relations
  teams?: { nom?: string } | null;
}

export interface Event {
  id: string;
  titre: string;
  description_long: string;
  statut: 'a_venir' | 'termine';
  date_debut: string;
  date_fin?: string;
  heure?: string;
  lieu: string;
  type_event_id?: string;
  keywords: string[];
  media_id?: string;
  participants_count: number;
  max_participants: number;
  prix?: string;
  gratuit: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
   // Optional relation fields returned by admin queries
  event_types?: { id?: string; nom?: string } | null;
  media?: { id?: string; url?: string } | null;
}


export interface Category {
  id: string;
  nom: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  nom: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface EventType {
  id: string;
  nom: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  nom_fichier: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  taille?: number;
  mime_type?: string;
  uploaded_by: string;
  created_at: string;
}

export interface Participant {
  id: string;
  event_id: string;
  nom: string;
  email: string;
  inscription_date: string;
  confirmed: boolean;
  // Relations
  events?: Event;
}

export interface Message {
  id: string;
  origine: 'contact' | 'participation';
  ref_id?: string;
  nom: string;
  email: string;
  sujet?: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export interface SupportInfo {
  id: string;
  type: string;
  nom: string;
  details: Record<string, any>;
  actif: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminLog {
  id: string;
  action: string;
  details?: Record<string, any>;
  created_at: string;
}