import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WaitlistEntry {
  id: string;
  email: string;
  name: string | null;
  wallet_address: string | null;
  twitter_username: string | null;
  discord_username: string | null;
  referral_code: string;
  referred_by_code: string | null;
  twitter_followed: boolean;
  discord_joined: boolean;
  email_connected: boolean;
  password_hash: string | null;
  salt: string | null;
  is_verified: boolean;
  verification_token: string | null;
  reset_token: string | null;
  reset_token_expires: string | null;
  created_at: string;
  updated_at: string;
}

export const useWaitlist = () => {
  const [loading, setLoading] = useState(false);
  const [isVerifyingTwitter, setIsVerifyingTwitter] = useState(false);
  const [isVerifyingDiscord, setIsVerifyingDiscord] = useState(false);
  const { toast } = useToast();

  const joinWaitlist = async (
    email: string, 
    name?: string, 
    referredByCode?: string,
    password?: string
  ) => {
    setLoading(true);
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        throw new Error("Invalid email format");
      }

      // Generate referral code
      const referralCode = generateReferralCode();

      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('waitlist_entries')
        .select('email')
        .eq('email', email.trim())
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing user:', checkError);
        throw new Error('Failed to check existing user');
      }

      if (existingUser) {
        throw new Error("Email already registered");
      }

      // If there's a referral code, get the referrer's email
      let referrerEmail = null;
      if (referredByCode) {
        const { data: referrer, error: referrerError } = await supabase
          .from('waitlist_entries')
          .select('email')
          .eq('referral_code', referredByCode)
          .single();

        if (referrerError) {
          console.error('Error finding referrer:', referrerError);
          // Don't throw error, just continue without referral
        } else if (referrer) {
          referrerEmail = referrer.email;
        }
      }

      // Create new entry
      const entryData = {
        email: email.trim(),
        name: name || null,
        wallet_address: null,
        referred_by_code: referredByCode || null,
        referral_code: referralCode,
        updated_at: new Date().toISOString(),
        twitter_followed: false,
        discord_joined: false,
        email_connected: true
      };

      // Add auth fields only if password is provided
      if (password) {
        // Store password hash and salt in a separate table or handle it differently
        // For now, we'll just store the email and handle auth separately
        console.log('Password provided but auth fields not yet available in database');
      }

      const { data, error } = await supabase
        .from('waitlist_entries')
        .insert([entryData])
        .select()
        .single() as { data: WaitlistEntry | null, error: any };

      if (error) {
        console.error('Error creating waitlist entry:', error);
        throw new Error('Failed to create waitlist entry');
      }

      if (!data) {
        throw new Error('Failed to create waitlist entry');
      }

      // If we have a referrer, create the referral record
      if (referrerEmail) {
        const { error: referralError } = await supabase
          .from('referrals')
          .insert([{
            referrer_email: referrerEmail,
            referred_email: email.trim(),
            created_at: new Date().toISOString()
          }]);

        if (referralError) {
          console.error('Error creating referral record:', referralError);
          // Don't throw error, just log it
        }
      }

      return data;
    } catch (error) {
      console.error("Error joining waitlist:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update password hashing function to use salt
  const hashPassword = async (password: string, salt: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Add salt generation function
  const generateSalt = (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Add sign in function
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Get user data
      const { data: user, error } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('email', email.trim())
        .single() as { data: WaitlistEntry | null, error: any };

      if (error) {
        console.error('Error fetching user:', error);
        throw new Error('User not found');
      }

      if (!user) {
        throw new Error('User not found');
      }

      // For now, just check if the email exists
      // We'll implement proper password verification once the database is updated
      if (user.email === email.trim()) {
        return user;
      }

      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Add referral code generation function
  const generateReferralCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const validateWalletAddress = (address: string): boolean => {
    // Basic Ethereum address validation (0x followed by 40 hexadecimal characters)
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
  };

  const updateWaitlistEntry = async (email: string, updates: Partial<WaitlistEntry>) => {
    setLoading(true);
    try {
      // Import the safelyUpdateUser utility
      const { safelyUpdateUser } = await import('@/utils/supabaseUtils');

      // Use the safer update method that checks if the user exists first
      const result = await safelyUpdateUser(email, updates);
      
      if (!result.success) {
        console.error('Error updating waitlist entry:', result.error);
        return null;
      }

      return result.data;
    } catch (error) {
      console.error('Error updating waitlist entry:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getWaitlistEntry = async (email: string) => {
    try {
      // Check connection first
      const { checkSupabaseConnection } = await import('@/utils/supabaseUtils');
      const connectionStatus = await checkSupabaseConnection();
      
      if (!connectionStatus.success) {
        console.error('Could not connect to database:', connectionStatus.error);
        toast({
          title: "Database connection error",
          description: "Unable to connect to our servers. Please try again later.",
          variant: "destructive",
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('email', email)
        .single() as { data: WaitlistEntry | null, error: any };

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          console.warn(`User with email ${email} not found in database`);
          return null;
        }
        console.error('Error fetching waitlist entry:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting waitlist entry:', error);
      return null;
    }
  };

  const getLeaderboard = async () => {
    try {
      // Get waitlist entries with their referral counts using a join
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('waitlist_entries')
        .select(`
          *,
          referrals:referrals!referrals_referrer_email_fkey(count)
        `);
      
      if (leaderboardError) {
        console.error('Error fetching leaderboard data:', leaderboardError);
        throw leaderboardError;
      }
      
      if (!leaderboardData || leaderboardData.length === 0) {
        console.warn('No leaderboard data found');
        return [];
      }
      
      console.log(`Retrieved ${leaderboardData.length} leaderboard entries`);
      
      // Process the data to include referral counts
      const processedData = leaderboardData.map((entry: any) => {
        // Extract the referral count from the nested array of counts
        const referralCount = Array.isArray(entry.referrals) && entry.referrals.length > 0 
          ? entry.referrals[0].count 
          : 0;
          
        return {
          ...entry,
          referral_count: parseInt(referralCount) || 0,
          joined_at: entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown',
        };
      });
      
      // Sort by referral count in descending order
      const sortedData = [...processedData].sort((a, b) => b.referral_count - a.referral_count);
      
      console.log('Successfully processed and sorted leaderboard data:', sortedData);
      return sortedData;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  };

  const getTotalWaitlistCount = async () => {
    try {
      const { count, error } = await supabase
        .from('waitlist_entries')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error getting waitlist count:', error);
      return 0;
    }
  };

  const verifyTwitterFollow = async (email: string, twitterUsername: string): Promise<boolean> => {
    setIsVerifyingTwitter(true);
    try {
      // Import the safelyUpdateUser utility
      const { safelyUpdateUser } = await import('@/utils/supabaseUtils');
      
      // In a real implementation, we would verify with the Twitter API
      // that the user has actually followed our account
      
      // For now, we'll just trust the user has followed since we can't verify via API
      // Use the safer update method that checks if the user exists first
      const result = await safelyUpdateUser(email, {
        twitter_username: twitterUsername,
        twitter_followed: true,
        updated_at: new Date().toISOString(),
      });
      
      if (!result.success) {
        console.error('Database error during Twitter verification:', result.error);
        throw new Error(result.error);
      }
      
      return true;
    } catch (error) {
      console.error('Error verifying Twitter follow:', error);
      // More detailed error message for troubleshooting
      toast({
        title: "Error",
        description: "Database error during verification. This is a system issue, not related to your Twitter follow status.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifyingTwitter(false);
    }
  };
  
  const verifyDiscordJoin = async (email: string, discordUsername: string): Promise<boolean> => {
    setIsVerifyingDiscord(true);
    try {
      // Import the safelyUpdateUser utility
      const { safelyUpdateUser } = await import('@/utils/supabaseUtils');
      
      // In a real implementation, we would verify with the Discord API
      // that the user has actually joined our server
      
      // For now, we'll just trust the user has joined since we can't verify via API
      // Use the safer update method that checks if the user exists first
      const result = await safelyUpdateUser(email, {
        discord_username: discordUsername,
        discord_joined: true,
        updated_at: new Date().toISOString(),
      });
      
      if (!result.success) {
        console.error('Database error during Discord verification:', result.error);
        throw new Error(result.error);
      }
      
      return true;
    } catch (error) {
      console.error('Error verifying Discord join:', error);
      // More detailed error message for troubleshooting
      toast({
        title: "Error",
        description: "Database error during verification. This is a system issue, not related to your Discord join status.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsVerifyingDiscord(false);
    }
  };

  // Format leaderboard data with proper date formatting and referral counts
  const formatLeaderboardData = (data: any[]) => {
    return data.map(entry => ({
      ...entry,
      referral_count: parseInt(entry.referral_count) || 0,
      joined_date: entry.created_at ? new Date(entry.created_at).toLocaleDateString() : 'Unknown'
    }));
  };
  
  return {
    joinWaitlist,
    signIn,
    updateWaitlistEntry,
    getLeaderboard,
    formatLeaderboardData,
    getTotalWaitlistCount,
    validateWalletAddress,
    verifyTwitterFollow,
    verifyDiscordJoin,
    loading,
    verifyingTwitter: isVerifyingTwitter,
    verifyingDiscord: isVerifyingDiscord
  };
};
