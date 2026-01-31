'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useThemeContext } from '@/context/themeContext';
import { 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineUserGroup, 
  HiOutlineBolt,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineDevicePhoneMobile,
  HiArrowRight,
  HiOutlineSun,
  HiOutlineMoon
} from 'react-icons/hi2';

const features = [
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Real-time Messaging',
    description: 'Send and receive messages instantly with our lightning-fast infrastructure.'
  },
  {
    icon: HiOutlineUserGroup,
    title: 'Group Conversations',
    description: 'Create groups and collaborate with multiple people at once effortlessly.'
  },
  {
    icon: HiOutlineBolt,
    title: 'Lightning Fast',
    description: 'Built with modern technology for the fastest possible experience.'
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure & Private',
    description: 'Your conversations are protected with industry-standard security.'
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Connect Anywhere',
    description: 'Stay connected with friends and family no matter where you are.'
  },
  {
    icon: HiOutlineDevicePhoneMobile,
    title: 'Responsive Design',
    description: 'Beautiful experience on any device - desktop, tablet, or mobile.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Designer',
    avatar: '/avatars/woman.png',
    content: 'LinkUp has transformed how our team communicates. The interface is beautiful and intuitive!'
  },
  {
    name: 'Mike Chen',
    role: 'Software Engineer',
    avatar: '/avatars/man.png',
    content: 'Finally, a chat app that just works. Fast, reliable, and a joy to use every day.'
  },
  {
    name: 'Emily Davis',
    role: 'Marketing Manager',
    avatar: '/avatars/woman-2.png',
    content: 'The group features are amazing for coordinating with my team. Highly recommended!'
  }
];

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useThemeContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/main');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <HiOutlineChatBubbleLeftRight className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">LinkUp</span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
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
              <button
                onClick={() => router.push('/auth')}
                className="btn btn-primary"
              >
                Get Started
                <HiArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[rgb(var(--primary))] opacity-10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[rgb(var(--accent))] opacity-10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-fade-in">
              <span className="badge badge-primary text-sm mb-6">
                ✨ Modern Chat Experience
              </span>
            </div>
            
            <h1 className="animate-slide-up text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-6 leading-tight">
              Connect & Chat
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
                Like Never Before
              </span>
            </h1>
            
            <p className="animate-slide-up stagger-1 text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-10">
              Experience the future of communication with LinkUp. 
              Beautiful, fast, and secure messaging for everyone.
            </p>
            
            <div className="animate-slide-up stagger-2 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/auth')}
                className="btn btn-primary text-lg px-8 py-4"
              >
                Start Chatting Free
                <HiArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-secondary text-lg px-8 py-4"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 md:mt-24 animate-slide-up stagger-3">
            <div className="relative max-w-4xl mx-auto">
              <div className="card card-hover overflow-hidden p-0">
                <div className="bg-surface p-4 border-b border-theme flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-sm text-tertiary">LinkUp Chat</span>
                </div>
                <div className="p-6 bg-secondary">
                  <div className="flex gap-4">
                    {/* Sidebar preview */}
                    <div className="hidden md:block w-64 bg-surface rounded-xl p-4 space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 1 ? 'bg-[rgb(var(--primary)/0.1)]' : ''}`}>
                          <div className="w-10 h-10 rounded-full bg-tertiary animate-pulse" />
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-tertiary rounded w-20 animate-pulse" />
                            <div className="h-2 bg-tertiary rounded w-32 animate-pulse opacity-50" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Chat preview */}
                    <div className="flex-1 bg-surface rounded-xl p-4">
                      <div className="space-y-4">
                        <div className="flex justify-start">
                          <div className="chat-bubble chat-bubble-received">
                            Hey! How are you doing? 👋
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <div className="chat-bubble chat-bubble-sent">
                            I'm great! Just tried LinkUp 🎉
                          </div>
                        </div>
                        <div className="flex justify-start">
                          <div className="chat-bubble chat-bubble-received">
                            Isn't it amazing? So fast and beautiful!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 md:-right-8 animate-float">
                <div className="bg-surface shadow-xl rounded-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <HiOutlineBolt className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-primary">Real-time</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 md:-left-8 animate-float" style={{ animationDelay: '1s' }}>
                <div className="bg-surface shadow-xl rounded-xl p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <HiOutlineShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-primary">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-primary text-sm mb-4">Features</span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              Powerful features designed to make your communication seamless and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="card card-hover group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-32 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="badge badge-primary text-sm mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
              Loved by Users
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto">
              See what our community has to say about their experience with LinkUp.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.name}
                className="card card-hover"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full avatar"
                  />
                  <div>
                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-tertiary">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-secondary italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of users who are already enjoying a better chat experience.
          </p>
          <button
            onClick={() => router.push('/auth')}
            className="btn bg-white text-[rgb(var(--primary))] hover:bg-white/90 text-lg px-8 py-4 shadow-xl"
          >
            Create Free Account
            <HiArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary border-t border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-primary">LinkUp</span>
            </div>
            <p className="text-tertiary text-sm">
              © {new Date().getFullYear()} LinkUp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
