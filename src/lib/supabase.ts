import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getTours = async () => {
  const { data, error } = await supabase
    .from('tours')
    .select('*');

  if (error) throw error;
  return data;
};

export const getTourById = async (id: string) => {
  const { data, error } = await supabase
    .from('tours')
    .select('*, virtual_tours(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

