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
  Plus,
  Youtube,
  GraduationCap,
  ArrowRight,
  Star,
  Clock,
  BookOpen,
  Zap
} from 'lucide-react';

interface DashboardOverviewProps {
  userData: any;
  features: any[];
  setActiveTab: (tab: string) => void;
}

export const DashboardOverview = ({ userData, features, setActiveTab }: DashboardOverviewProps) => {
  return (
    <div className="space-y-10 pb-10">
      {/* 1. Welcome Section - Clean Typography */}
      <div className="text-center space-y-3 pt-4">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Welcome back, <span className="text-indigo-600">{userData.name}</span>! 🎓
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Your AI-powered learning companion is ready to help you excel.
        </p>
      </div>

      {/* 2. Stats Grid - Refined Apple Style */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Study Streak', value: `${userData.streak} days`, icon: Star, color: 'text-orange-500' },
          { label: 'Study Time', value: `${userData.totalStudyTime}h`, icon: Clock, color: 'text-blue-500' },
          { label: 'Sessions', value: userData.completedSessions, icon: BookOpen, color: 'text-green-500' },
          { label: 'Progress', value: '75%', icon: GraduationCap, color: 'text-purple-500', isProgress: true },
          { label: 'Reading Speed', value: `${userData.lastAssessment.readingSpeed} WPM`, icon: Zap, color: 'text-indigo-500' }
        ].map((stat, i) => (
          <Card key={i} className="apple-card-base border-none">
            <CardHeader className="pb-2 p-5 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color} opacity-80`} />
            </CardHeader>
            <CardContent className="px-5 pb-6">
              <div className="text-2xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              {stat.isProgress && <Progress value={75} className="h-1.5 mt-3 bg-slate-100" />}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. Courses CTA Banner - Using the "Glass" look */}
      <Card className="bg-indigo-700 border-none rounded-[24px] overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 opacity-50 group-hover:opacity-70 transition-opacity" />
        <CardContent className="p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-2">New Courses Available</Badge>
            <h2 className="text-3xl font-bold text-white tracking-tight">Master New Skills Today</h2>
            <p className="text-slate-300 max-w-md">
              Structured learning paths designed by experts to take you from beginner to professional.
            </p>
          </div>
          <Button 
            onClick={() => (window.location.href = '/courses')}
            className="bg-white text-slate-900 hover:bg-slate-100 h-14 px-8 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl active:scale-95"
          >
            Browse Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* 4. Feature Cards - Using apple-card-interactive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="apple-card-interactive group relative overflow-hidden"
            onClick={feature.action}
          >
            {feature.premium && !userData.isPremium && (
              <Badge className="absolute top-4 right-4 bg-indigo-600 text-white border-none text-[10px] font-bold uppercase tracking-widest">
                Premium
              </Badge>
            )}
            <CardHeader className="p-8">
              <div className="p-3 w-fit bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors mb-4">
                <feature.icon className="h-6 w-6 text-slate-600 group-hover:text-indigo-600 transition-colors" />
              </div>
              <CardTitle className="text-xl font-bold text-slate-900 tracking-tight">
                {feature.title}
              </CardTitle>
              <CardDescription className="text-slate-500 text-base leading-relaxed mt-2">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* 5. Quick Actions - Soft Gradient */}
      <div className="bg-indigo-600 rounded-[32px] p-8 md:p-12 text-center space-y-6 shadow-2xl shadow-indigo-200">
        <h3 className="text-2xl md:text-3xl font-bold text-white">Ready to learn something new?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={() => setActiveTab('notes')}
            className="bg-white text-indigo-600 hover:bg-indigo-50 h-12 px-8 rounded-xl font-bold shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Upload Notes
          </Button>
          <Button
            onClick={() => setActiveTab('youtube')}
            className="bg-indigo-500 text-white hover:bg-indigo-400 border border-indigo-400 h-12 px-8 rounded-xl font-bold"
          >
            <Youtube className="h-4 w-4 mr-2" />
            Analyze Video
          </Button>
        </div>
      </div>
    </div>
  );
};