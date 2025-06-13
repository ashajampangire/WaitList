
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
  created_at: string;
  updated_at: string;
}

export const useWaitlist = () => {
  const [loading, setLoading] = useState(false);
  const [isVerifyingTwitter, setIsVerifyingTwitter] = useState(false);
  const [isVerifyingDiscord, setIsVerifyingDiscord] = useState(false);
  const { toast } = useToast();

  const joinWaitlist = async (email: string, name?: string, referredByCode?: string, walletAddress?: string) => {
    setLoading(true);
    try {
      // First check if user already exists to avoid duplicate entries
      const { validateUserExists } = await import('@/utils/supabaseUtils');
      const userExists = await validateUserExists(email);
      
      if (userExists) {
        toast({
          title: "Already signed up!",
          description: "This email is already on the waitlist.",
        });
        return null;
      }
      
      // Generate a unique referral code based on email hash
      const referralCode = btoa(email).substring(0, 8).replace(/[/+=]/g, 'x');
      
      // Create the new waitlist entry
      const { data, error } = await supabase
        .from('waitlist_entries')
        .insert([
          {
            email,
            name: name || null,
            wallet_address: walletAddress || null,
            referred_by_code: referredByCode || null,
            referral_code: referralCode,
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) {
        // Double-check for race condition duplicate entries
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already signed up!",
            description: "This email is already on the waitlist.",
          });
          return null;
        }
        console.error('Database error during waitlist signup:', error);
        throw error;
      }

      // If referred by someone, create referral relationship
      if (referredByCode && data) {
        try {
          const { data: referrer } = await supabase
            .from('waitlist_entries')
            .select('email')
            .eq('referral_code', referredByCode)
            .single();

          if (referrer) {
            await supabase
              .from('referrals')
              .insert([
                {
                  referrer_email: referrer.email,
                  referred_email: data.email,
                }
              ]);
          }
        } catch (refError) {
          // Log but don't fail the overall registration if referral fails
          console.error('Error creating referral relationship:', refError);
        }
      }

      toast({
        title: "Welcome to the waitlist!",
        description: "You've successfully joined the NEFTIT waitlist.",
      });

      return data;
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
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
        .single();

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
      // First try to get data from the stored procedure
      try {
        const { data, error } = await supabase.rpc('get_referral_leaderboard');
        if (!error && data && data.length > 0) {
          // Format data with proper dates and ensure all fields are present
          const formattedData = data.map((item: any) => ({
            ...item,
            // Format created_at as a readable date if it exists
            joined_at: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown',
            // Ensure referral_count is a number
            referral_count: parseInt(item.referral_count || '0'),
          }));
          
          console.log('Successfully retrieved leaderboard data from RPC');
          return formattedData;
        }
      } catch (rpcError) {
        console.warn('RPC method not available, falling back to direct query:', rpcError);
      }
      
      console.log('Fetching leaderboard data using direct queries');
      
      // If RPC fails or returns no data, use direct query approach
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
      
      console.log('Successfully processed and sorted leaderboard data');
      return sortedData;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      
      // Return empty array instead of mock data
      console.warn('Returning empty leaderboard due to error');
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
