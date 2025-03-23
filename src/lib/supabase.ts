import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Les variables d\'environnement Supabase sont manquantes. Assurez-vous que le fichier .env est présent avec VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: 'smartdiscount31-repair-auth',
      flowType: 'pkce'
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'x-application-name': 'smartdiscount31-repair'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);

// Fonction pour tester la connexion avec retry
const testConnection = async (retries = 3, delay = 1000): Promise<boolean> => {
  for (let i = 0; i < retries; i++) {
    try {
      const { error } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      const { error: dbError } = await supabase
        .from('customers')
        .select('count')
        .limit(1)
        .single();

      if (dbError && dbError.code !== 'PGRST116') {
        throw dbError;
      }

      console.log('✅ Connexion à Supabase établie avec succès');
      return true;
    } catch (error) {
      console.warn(`Tentative ${i + 1}/${retries} échouée:`, error);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error('❌ Erreur de connexion à Supabase après plusieurs tentatives');
  return false;
};

// Test de connexion initial avec délai
setTimeout(() => {
  testConnection().then((isConnected) => {
    if (!isConnected) {
      console.warn('⚠️ Veuillez vérifier votre connexion internet et les identifiants Supabase');
    }
  });
}, 1000);

export { testConnection };