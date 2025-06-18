import { supabase } from '@/integrations/supabase/client';

// Function to check Supabase connection
export const checkSupabaseConnection = async () => {
  try {
    // Try to make a simple query to test connection
    const { data, error } = await supabase
      .from('waitlist_entries')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Supabase connection error:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('Failed to check Supabase connection:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};

// Function to validate if a record exists in the database
export const validateUserExists = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('waitlist_entries')
      .select('email')
      .eq('email', email)
      .single();
      
    if (error && error.code !== 'PGRST116') { // PGRST116 is not found error
      console.error('Error checking if user exists:', error);
      return false;
    }
    
    return !!data; // Returns true if data exists
  } catch (err) {
    console.error('Failed to validate user exists:', err);
    return false;
  }
};

// Function to safely update a user record
export const safelyUpdateUser = async (email: string, updates: any) => {
  try {
    // First check if user exists
    const userExists = await validateUserExists(email);
    
    if (!userExists) {
      console.warn(`User with email ${email} doesn't exist in the database`);
      return {
        success: false,
        error: 'User not found'
      };
    }
    
    // Proceed with the update
    const { data, error } = await supabase
      .from('waitlist_entries')
      .update(updates)
      .eq('email', email)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      data
    };
  } catch (err) {
    console.error('Failed to safely update user:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
};
