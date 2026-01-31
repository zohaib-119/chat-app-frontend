'use client'

import { useState, useEffect } from "react";
import { toaster } from "@/components/ui/toaster";
import axios from 'axios'
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { setCookie } from 'cookies-next';
import { useThemeContext } from "@/context/themeContext";
import { 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineEnvelope, 
  HiOutlineLockClosed, 
  HiOutlineUser,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineSun,
  HiOutlineMoon,
  HiArrowLeft
} from 'react-icons/hi2';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export default function AuthPage() {
  const router = useRouter();
  const { setUser, setIsAuthenticated, setToken, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useThemeContext();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/main');
    }
  }, [isAuthenticated, router]);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim() || (!isLogin && !username.trim())) {
      toaster.create({
        title: 'All fields are required.',
        type: 'error',
      })
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toaster.create({
        title: "Invalid email format.",
        type: 'error',
      });
      return;
    }

    if (password.length < 6) {
      toaster.create({
        title: "Password must be at least 6 characters.",
        type: 'error',
      });
      return;
    }

    if (!isLogin && username.length < 5) {
      toaster.create({
        title: "Username must be at least 5 characters.",
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    if (isLogin) {
      try {
        const response = await axios.post(`${baseURL}/api/auth/login`, {
          email, password
        });

        if (response.data.success) {
          setUser(response.data.user);
          setToken(response.data.token);
          setCookie('token', response.data.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'Lax'
          });
          setIsAuthenticated(true);
          toaster.create({
            title: 'Welcome back!',
            type: 'success',
          });
          router.replace('/main');
        } else {
          toaster.create({
            title: response.data.message,
            type: 'error',
          });
        }
      } catch (error) {
        toaster.create({
          title: error.response?.data?.message || "Something went wrong",
          type: 'error',
        });
      }
    } else {
      try {
        const response = await axios.post(`${baseURL}/api/auth/signup`, {
          email, password, username
        });

        if (response.data.success) {
          setUser(response.data.user);
          setToken(response.data.token);
          setCookie('token', response.data.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'Lax'
          });
          setIsAuthenticated(true);
          toaster.create({
            title: 'Account created successfully!',
            type: 'success',
          });
          router.replace('/main');
        } else {
          toaster.create({
            title: response.data.message,
            type: 'error',
          });
        }
      } catch (error) {
        toaster.create({
          title: error.response?.data?.message || "Something went wrong",
          type: 'error',
        });
      }
    }

    setIsLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="min-h-screen bg-primary flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8">
            <HiOutlineChatBubbleLeftRight className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">Welcome to LinkUp</h1>
          <p className="text-xl text-white/80 text-center max-w-md">
            Connect with friends, family, and teams in a beautiful, secure environment.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-12 space-y-4 w-full max-w-sm">
            {[
              { title: 'Real-time messaging', desc: 'Instant delivery, always' },
              { title: 'Group conversations', desc: 'Collaborate with teams' },
              { title: 'Secure & private', desc: 'Your data is protected' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 md:p-6">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
          >
            <HiArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back to Home</span>
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-surface-hover transition-colors text-secondary"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <HiOutlineSun className="w-5 h-5" />
            ) : (
              <HiOutlineMoon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-primary">LinkUp</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-2">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-secondary">
                {isLogin 
                  ? 'Enter your credentials to access your account' 
                  : 'Sign up to start connecting with others'}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Username field (signup only) */}
              {!isLogin && (
                <div className="animate-slide-up">
                  <label className="block text-sm font-medium text-primary mb-2">
                    Username
                  </label>
                  <div className="relative">
                    {
                        !username && <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                    }
                    <input
                      type="text"
                      placeholder="      Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="input-modern pl-12"
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="animate-slide-up stagger-1">
                <label className="block text-sm font-medium text-primary mb-2">
                  Email
                </label>
                <div className="relative">
                  {!email && <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />}
                  <input
                    type="email"
                    placeholder="      Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-modern pl-12"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="animate-slide-up stagger-2">
                <label className="block text-sm font-medium text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  {!password && (
                    <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
                  )}
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="      Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-modern pl-12 pr-12"
                    onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-tertiary hover:text-secondary transition-colors"
                  >
                    {showPassword ? (
                      <HiOutlineEyeSlash className="w-5 h-5" />
                    ) : (
                      <HiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <div className="animate-slide-up stagger-3 pt-2">
                <button
                  type="button"
                  onClick={handleAuth}
                  disabled={isLoading}
                  className="btn btn-primary w-full py-4 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Please wait...</span>
                    </div>
                  ) : (
                    isLogin ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>
            </form>

            {/* Switch mode */}
            <div className="mt-8 text-center animate-fade-in">
              <p className="text-secondary">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={switchMode}
                  className="ml-2 font-semibold text-[rgb(var(--primary))] hover:underline"
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
