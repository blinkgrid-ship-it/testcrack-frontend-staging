import { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Progress } from '@/shared/components/ui/progress';
import {
  Book,
  Star,
  Plus,
  BookOpen,
  Youtube,
  Clock,
  GraduationCap,
  ArrowRight,
  Trophy
} from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { NotesUpload } from '@/features/notes/components/NotesUpload';
import { YouTubeAnalyzer } from '@/features/notes/components/YouTubeAnalyzer';
import { StudyGuides } from '@/features/notes/components/StudyGuides';
import { PremiumModal } from '@/features/payment/components/PremiumModal';
import { ProgressDashboard } from '@/features/profile/components/ProgressDashboard';
import { Navbar } from '@/shared/components/layout/Navbar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getBackendUrl } from '@/shared/utils';
import { callBackend } from '@/features/auth/services/authClient';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [displayName, setDisplayName] = useState<string>('');
  const { user } = useAuth();
  const hasLoadedProfile = useRef(false);

  useEffect(() => {
    if (hasLoadedProfile.current || !user) {
      return;
    }

    const loadProfile = async () => {
      try {
        const backendUrl = getBackendUrl();
        const data = await callBackend(`${backendUrl}/api/profile`, {
          method: 'GET',
        });

        if (data.user) {
          setDisplayName(data.user.name || data.user.email);
          hasLoadedProfile.current = true;
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setDisplayName(user?.email || 'Student');
      }
    };

    loadProfile();
  }, [user]);

  const userData = {
    name: displayName || user?.email?.split('@')[0] || 'Student',
    streak: 12,
    totalStudyTime: 45,
    completedSessions: 8,
    isPremium: false,
    lastAssessment: {
      readingSpeed: 185,
      level: 'Intermediate',
    },
  };

  const features = [
    {
      icon: Book,
      title: 'Smart Notes',
      description: 'Upload and analyze your study materials with AI',
      action: () => setActiveTab('notes'),
      premium: false,
    },
    {
      icon: Youtube,
      title: 'YouTube Learning',
      description: 'Extract and summarize video content instantly',
      action: () => setActiveTab('youtube'),
      premium: false,
    },
    {
      icon: BookOpen,
      title: 'Study Guides',
      description: 'AI-generated personalized study guides',
      action: () => setActiveTab('guides'),
      premium: false,
    },
    {
      icon: Clock,
      title: 'Speed Assessment',
      description: 'Test and improve your reading speed',
      action: () => (window.location.href = '/assessment'),
      premium: false,
    },
    {
      icon: Star,
      title: 'AI Tutor Sessions',
      description: 'One-on-one AI tutoring with adaptive learning',
      action: () => setShowPremiumModal(true),
      premium: true,
    },
    {
    icon: Trophy,
    title: 'Daily Challenges',
    description: 'Join global study streaks and earn rewards',
action: () => toast.info('Challenges Coming Soon', {
        description: 'We are currently building the global leaderboard. Stay tuned!',
        icon: <Trophy className="h-4 w-4 text-indigo-600" />,
      }),    premium: false,
  }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'notes':
        return <NotesUpload />;
      case 'youtube':
        return <YouTubeAnalyzer />;
      case 'guides':
        return <StudyGuides />;
      case 'progress':
        return <ProgressDashboard />;
      default:
        return (
     <DashboardOverview 
      userData={userData} 
      features={features} 
      setActiveTab={setActiveTab} 
    />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <Navbar
        showNavItems={true}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showUpgradeButton={!userData.isPremium}
        onUpgradeClick={() => setShowPremiumModal(true)}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {renderContent()}
      </main>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
      />
    </div>
  );
};

export default DashboardPage;
