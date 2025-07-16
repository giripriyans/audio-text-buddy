import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bot, Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-background px-4 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/66565d73-3ccb-42ba-a986-ad69b15f1f93.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="w-full max-w-sm relative z-10 text-center flex flex-col items-center justify-center"
           style={{ minHeight: '60vh' }}>
        <div className="flex justify-center mb-3">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold text-white mb-1">Welcome Back</h1>
        <p className="text-sm text-white/80 mb-6">
          Sign in to continue your conversations
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1 text-center">
            <Label htmlFor="email" className="text-white text-sm block">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-9 text-center"
            />
          </div>
          <div className="space-y-1 text-center">
            <Label htmlFor="password" className="text-white text-sm block">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-9 text-center"
            />
          </div>
          <Button type="submit" className="w-full h-9" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-xs text-white/80">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;