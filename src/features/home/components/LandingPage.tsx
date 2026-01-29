import { useEffect, useState, useRef } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import {
  GraduationCap,
  BookOpen,
  Brain,
  Zap,
  ArrowRight,
  Star,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// ===== OPTIMIZATION 1: Lazy load GSAP only when needed =====
let gsap: any = null;
let ScrollTrigger: any = null;

const loadGSAP = async () => {
  if (!gsap) {
    const gsapModule = await import('gsap');
    const scrollTriggerModule = await import('gsap/ScrollTrigger');
    gsap = gsapModule.default;
    ScrollTrigger = scrollTriggerModule.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }
  return { gsap, ScrollTrigger };
};

// ===== OPTIMIZATION 2: Memoized Counter Component =====
const AnimatedCounter = ({ value, label, index }: { value: string; label: string; index: number }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          
          const baseValue = value.includes('/') ? value.split('/')[0] : value;
          const numericValue = parseInt(baseValue.replace(/[^0-9]/g, ''));
          
          const duration = 2000;
          const steps = 60;
          const increment = numericValue / steps;
          let current = 0;

          const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  const displayValue = () => {
    if (value.includes('K+')) return `${count}K+`;
    if (value.includes('+')) return `${count}+`;
    if (value.includes('%')) return `${count}%`;
    if (value.includes('/')) {
      const suffix = value.split('/')[1];
      return `${count}/${suffix}`;
    }
    return count;
  };

  return (
    <div 
      ref={counterRef} 
      className="stats-item text-center"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="text-3xl sm:text-4xl font-bold text-gray-900">
        {displayValue()}
      </div>
      <div className="text-gray-600 mt-1 font-medium">{label}</div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processingAuth, setProcessingAuth] = useState(false);
  const [gsapLoaded, setGsapLoaded] = useState(false);
  
  const mainRef = useRef<HTMLDivElement>(null);

  // ===== OPTIMIZATION 3: Load GSAP after initial render =====
  useEffect(() => {
    // Defer GSAP loading until after paint
    const timer = setTimeout(async () => {
      await loadGSAP();
      setGsapLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // ===== OPTIMIZATION 4: Run animations only after GSAP loads =====
  useEffect(() => {
    if (!gsapLoaded || !gsap || !ScrollTrigger) return;

    const ctx = gsap.context(() => {
      // Hero Entrance Animation
      const tl = gsap.timeline();
      tl.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        clearProps: "all" 
      })
      .from(".stats-item", {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "all"
      }, "-=0.4");

      // Scroll-triggered animations
      const revealSections = [".feature-card", ".step-item", ".testimonial-card"];
      
      revealSections.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) return;

        gsap.from(elements, {
          scrollTrigger: {
            trigger: elements[0],
            start: "top 90%",
            toggleActions: "play none none none",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          clearProps: "all"
        });
      });

      // Navigation Entrance
      gsap.from(".nav-container", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.2
      });
    }, mainRef);

    return () => ctx.revert();
  }, [gsapLoaded]);

  // Auth callback handler
  useEffect(() => {
    const handleAuthCallback = async () => {
      const hash = window.location.hash;
      if (!hash || !hash.includes("access_token")) return;
      setProcessingAuth(true);
      const hashParams = new URLSearchParams(hash.substring(1));
      const type = hashParams.get("type");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (!accessToken) {
        setProcessingAuth(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });
        if (error) {
          navigate("/auth?error=invalid_token");
          return;
        }
        window.history.replaceState(null, "", window.location.pathname);
        if (type === "recovery") {
          navigate("/reset-password", { replace: true });
        } else if (type === "signup" || type === "magiclink" || type === "email") {
          navigate("/profile?welcome=true", { replace: true });
        } else if (data.session) {
          navigate("/dashboard", { replace: true });
        }
      } catch (err) {
        setProcessingAuth(false);
      }
    };
    handleAuthCallback();
  }, [navigate]);

  if (processingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Verifying your account...</p>
        </div>
      </div>
    );
  }

  const features = [
    { icon: Brain, title: 'AI-Powered Learning', description: 'Personalized study paths that adapt to your learning style and pace.' },
    { icon: BookOpen, title: 'Smart Notes', description: 'Upload your materials and get AI-generated summaries, flashcards, and quizzes.' },
    { icon: Zap, title: 'Speed Reading', description: 'Improve your reading speed with scientifically-backed assessments and training.' },
    { icon: GraduationCap, title: 'Expert Courses', description: 'Structured courses with modules, assessments, and progress tracking.' },
  ];

  const stats = [
    { value: '10K+', label: 'Active Learners' },
    { value: '500+', label: 'Courses' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '24/7', label: 'AI Support' },
  ];

  const testimonials = [
    { name: 'Sarah M.', role: 'Medical Student', content: 'This platform transformed how I study. The AI summaries save me hours every week!', rating: 5 },
    { name: 'James K.', role: 'Software Engineer', content: 'The structured courses helped me transition into a new tech stack seamlessly.', rating: 5 },
    { name: 'Priya R.', role: 'Graduate Student', content: 'Speed reading training improved my research efficiency by 3x. Highly recommend!', rating: 5 },
  ];

  return (
    <div ref={mainRef} className="min-h-screen bg-white overflow-x-hidden selection:bg-purple-100 selection:text-purple-900">
      {/* Navigation */}
      <nav className="nav-container fixed top-4 inset-x-0 z-50 flex justify-center px-4">
        <div className="w-full max-w-7xl bg-white/70 backdrop-blur-md border-b border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-2xl transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => navigate('/')}>
                <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl group-hover:scale-110 transition-all">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
                  TestCrack
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <Button variant="ghost" onClick={() => navigate('/courses')} className="text-gray-600 hover:text-purple-600 font-medium">
                  Courses
                </Button>
                {user ? (
                  <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                    Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onClick={() => navigate('/auth')} className="text-gray-600 hidden sm:inline-flex font-medium">
                      Sign In
                    </Button>
                    <Button onClick={() => navigate('/auth')} className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl px-6">
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-purple-100 text-purple-700 hover:bg-purple-100">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Education Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-tight">
              Learn Smarter, Not Harder with{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your learning experience with personalized AI tutoring, smart notes, and expert-curated courses.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                onClick={() => navigate(user ? '/dashboard' : '/auth')} 
                className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-lg hover:scale-105 transition-transform text-white font-bold
                  bg-[linear-gradient(270deg,#8b5cf6,#22d3ee,#8b5cf6)] 
                  bg-[length:200%_200%] 
                  animate-[gradientMove_3s_ease_infinite]"
              >
                {user ? 'Go to Dashboard' : 'Start Learning Free'} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/courses')} className="w-full sm:w-auto px-8 py-6 text-lg rounded-xl hover:bg-white shadow-sm transition-all">
                <BookOpen className="mr-2 h-5 w-5" /> Browse Courses
              </Button>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedCounter 
                key={index} 
                value={stat.value} 
                label={stat.label} 
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Excel</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive platform combining AI with proven learning methodologies.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group h-[220px] [perspective:1000px]">
                <Card 
                  className="relative h-full w-full transition-all duration-300 border border-gray-200 hover:border-purple-400 hover:shadow-xl rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 group"
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl w-fit mb-4 shadow-md group-hover:scale-110 transition-transform">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600">Get started in minutes and transform your learning journey.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Create Your Account', description: 'Sign up for free and set your learning goals and preferences.' },
              { step: '02', title: 'Choose Your Path', description: 'Browse courses, upload notes, or start with a reading assessment.' },
              { step: '03', title: 'Learn & Grow', description: 'Track your progress, earn achievements, and master new skills.' },
            ].map((item, index) => (
              <div key={index} className="step-item text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-2xl font-black mb-6 shadow-xl">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Loved by Learners</h2>
            <p className="text-lg text-gray-600">Join thousands of students achieving their goals.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="testimonial-card border-none bg-white shadow-lg shadow-purple-200 rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-lg">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">{testimonial.name[0]}</div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center bg-gradient-to-r from-purple-300 to-blue-700 rounded-[2.5rem] p-12 sm:p-20 shadow-2xl relative overflow-hidden p-[2px] group
          before:absolute before:inset-[-200%] before:bg-[conic-gradient(from_0deg,transparent_20%,#3b82f6_50%,#eab308_80%,transparent_100%)] 
          before:animate-[spin_4s_linear_infinite] before:opacity-100">
          
          <div className="absolute inset-[2px] bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2.4rem] z-0" />

          <div className="absolute top-0 right-0 p-8 opacity-20"><Sparkles className="h-32 w-32 text-white" /></div>
          <h2 className="text-4xl font-extrabold text-white mb-6 relative z-10">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-purple-100 mb-10 relative z-10">Join thousands of learners already using AI to study smarter.</p>
          <Button size="lg" onClick={() => navigate(user ? '/dashboard' : '/auth')} className="relative z-10 bg-white text-purple-600 hover:bg-purple-50 px-10 py-8 text-xl rounded-2xl font-bold shadow-xl transition-all hover:scale-105">
            {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-blue-200 text-gray-700">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg"><GraduationCap className="h-5 w-5 text-white" /></div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
              TestCrack
            </span>
          </div>
          <p className="text-sm">© 2026 TestCrack. Elevating education via AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;