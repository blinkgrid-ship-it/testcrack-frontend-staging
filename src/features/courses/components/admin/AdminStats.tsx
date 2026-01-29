import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Users, BookOpen, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean;
  color: string;
  delay: number;
}

const StatCard = ({ title, value, icon: Icon, trend, trendUp, color, delay }: StatCardProps) => (
  <Card 
    className="overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow duration-300"
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">
        {title}
      </CardTitle>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="flex items-center">
        <span className="text-xs font-medium text-green-600">
          {trend}
        </span>
        <span className="text-xs text-gray-500 ml-2">from last month</span>
      </div>
    </CardContent>
  </Card>
);

export const AdminStats = () => {
  const stats = [
    {
      title: "Total Students",
      value: "2,845",
      icon: Users,
      trend: "+12.5%",
      trendUp: true,
      color: "bg-blue-50 text-blue-500",
    },
    {
      title: "Active Courses",
      value: "14",
      icon: BookOpen,
      trend: "+2.4%",
      trendUp: true,
      color: "bg-purple-50 text-purple-500",
    },
    {
      title: "Total Revenue",
      value: "$45,231",
      icon: DollarSign,
      trend: "+8.2%",
      trendUp: true,
      color: "bg-teal-50 text-teal-500",
    },
    {
      title: "Avg. Completion",
      value: "68%",
      icon: TrendingUp,
      trend: "+4.1%",
      trendUp: true,
      color: "bg-orange-50 text-orange-500",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
};