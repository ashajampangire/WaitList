import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Handle sign in using Supabase
      const { data: user, error } = await supabase
        .from('waitlist_entries')
        .select('*')
        .eq('email', email.trim())
        .single();

      if (error || !user) {
        throw new Error('Invalid credentials');
      }

      if (user.email === email.trim()) {
        // Store in localStorage
        localStorage.setItem(
          "waitlist_user",
          JSON.stringify({
            ...user,
            updated_at: new Date().toISOString(),
          })
        );

        toast({
          title: "Signed In Successfully!",
          description: "Welcome back! Redirecting to dashboard..."
        });

        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast({
        title: "Error",
        description: error.message === 'Invalid credentials'
          ? "Invalid email or password. Please try again."
          : "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/images/background1.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header logoSize="h-10 md:h-10" className="pl-1 py-1"/>
      <div style={{ zoom: 0.75 }} className="flex-grow flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold bg-gradient-to-b from-[#b3a4f7] via-[#8f6fff] to-[#2d186c] bg-clip-text ">
              Welcome Back
            </h2>
            <p className="text-white/60 text-lg">
              Sign in to continue your journey
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#233876]/50 backdrop-blur-sm p-4 rounded-xl text-white font-medium placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#5D43EF]/50 border border-white/10"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#233876]/50 backdrop-blur-sm p-4 rounded-xl text-white font-medium placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-[#5D43EF]/50 border border-white/10"
              />
            </div>

            <Button
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full bg-[#5D43EF] hover:bg-[#4935c8] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,94,251,0.3)] transition-all duration-300 text-lg"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <p className="text-center text-white/60 text-sm">
              Don't have an account?{" "}
              <button
                onClick={() => navigate('/')}
                className="text-[#5D43EF] hover:text-[#4935c8] font-medium transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn; 