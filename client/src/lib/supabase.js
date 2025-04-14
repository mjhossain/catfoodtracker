import { createClient } from '@supabase/supabase-js'; 
import { VITE_SUPABASE_URL, VITE_SUPABASE_KEY } from '../../env.js';

// Debug log to see what environment variables are available
console.log('Environment variables check:');
console.log('VITE_SUPABASE_URL exists in import.meta.env:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_KEY exists in import.meta.env:', !!import.meta.env.VITE_SUPABASE_KEY);
console.log('All env vars:', import.meta.env);

// Initialize the Supabase client with fallback to explicit values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || VITE_SUPABASE_KEY;

console.log('Using supabaseUrl:', supabaseUrl ? 'Available' : 'Not available');
console.log('Using supabaseKey:', supabaseKey ? 'Available' : 'Not available');

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and API key must be provided in environment variables');
  console.error('supabaseUrl:', supabaseUrl);
  console.error('supabaseKey exists:', !!supabaseKey);
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize the database table if it doesn't exist
export async function initializeDatabase() {
  try {
    console.log('Checking Supabase connection...');
    
    // Check if the feedings table exists by querying it
    console.log('Checking for feedings table...');
    const { data, error: tableError } = await supabase
      .from('feedings')
      .select('*')
      .limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') {
        console.error('The "feedings" table does not exist in your Supabase database.');
        console.error('Please create it in the Supabase dashboard with the following structure:');
        console.error(`
          Table name: feedings
          Columns:
          - id: integer (primary key, auto-increment)
          - color: text (required)
          - timestamp: timestamptz (default: now())
        `);
        
        // Create a test record to help guide the process
        console.log('Attempting to insert a test record to verify structure...');
        const { error: insertError } = await supabase
          .from('feedings')
          .insert([{ color: 'red', timestamp: new Date() }]);
          
        if (insertError) {
          console.error('Error inserting test record:', insertError);
        }
      } else {
        console.error('Error accessing feedings table:', tableError);
      }
    } else {
      console.log('Feedings table exists and is accessible');
      console.log('Current records:', data?.length || 0);
    }
  } catch (error) {
    console.error('Error initializing database connection:', error);
  }
}

// Helper function to get recent feedings
export async function getRecentFeedings(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('feedings')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent feedings:', error);
    return [];
  }
}

// Helper function to get the last feeding
export async function getLastFeeding() {
  try {
    const { data, error } = await supabase
      .from('feedings')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the "no rows returned" error code
    return data || null;
  } catch (error) {
    console.error('Error fetching last feeding:', error);
    return null;
  }
}

// Helper function to create a new feeding
export async function createFeeding(color) {
  try {
    const { data, error } = await supabase
      .from('feedings')
      .insert([{ color, timestamp: new Date() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating feeding:', error);
    throw error;
  }
}