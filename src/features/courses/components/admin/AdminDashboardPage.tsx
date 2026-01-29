import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { Plus, Search, Filter, Sparkles } from "lucide-react";
import { AdminNavbar } from "./AdminNavbar";
import { AdminStats } from "./AdminStats";
import { AdminCourseCard, AdminCourse } from "./AdminCourseCard";

const AdminDashboardPage = () => {
  // Mock Data
  const mockCourses: AdminCourse[] = [
    {
      id: "1",
      title: "Advanced React Patterns & Performance",
      description: "Master advanced React concepts including HOCs, Render Props, and Custom Hooks for building scalable applications.",
      students: 1234,
      rating: 4.8,
      duration: "12h 30m",
      price: 99.99,
      status: "published",
      lastUpdated: "2 days ago",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "2",
      title: "UI/UX Design Masterclass 2024",
      description: "Complete guide to modern UI/UX design principles, tools, and workflows used by top designers.",
      students: 856,
      rating: 4.9,
      duration: "24h 15m",
      price: 149.99,
      status: "published",
      lastUpdated: "1 week ago",
      thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a5638d0f?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "3",
      title: "Fullstack Web Development Bootcamp",
      description: "Become a full-stack developer with this comprehensive guide covering Node.js, React, and PostgreSQL.",
      students: 45,
      rating: 4.5,
      duration: "48h 00m",
      price: 199.99,
      status: "draft",
      lastUpdated: "3 hours ago",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: "4",
      title: "Python for Data Science",
      description: "Learn how to use Python for data analysis, machine learning, and visualization.",
      students: 0,
      rating: 0,
      duration: "18h 45m",
      price: 89.99,
      status: "draft",
      lastUpdated: "1 day ago",
      thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const handleEdit = (id: string) => {
    console.log("Edit course", id);
  };

  const handleView = (id: string) => {
    console.log("View course", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete course", id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="ml-64 mt-16 p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600">
              Empower your students with world-class content and insights.
            </p>
          </div>
          <Button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Course</span>
          </Button>
        </div>

        {/* Stats Section */}
        <AdminStats />

        {/* Courses Management Section */}
        <div className="mt-8">
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4 w-full lg:w-auto">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-gray-900 whitespace-nowrap">My Courses</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-full">{mockCourses.length}</span>
                </div>
                
                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

                <div className="flex items-center space-x-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search projects..." 
                      className="pl-10 h-11 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <Button variant="ghost" size="icon" className="h-11 w-11 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition-colors">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="all" className="w-full lg:w-auto">
                <TabsList className="grid w-full grid-cols-3 lg:w-[320px] h-11 p-1 bg-gray-100 rounded-lg">
                  <TabsTrigger value="all" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">All</TabsTrigger>
                  <TabsTrigger value="published" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Published</TabsTrigger>
                  <TabsTrigger value="draft" className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">Drafts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockCourses.map((course, index) => (
              <AdminCourseCard 
                key={course.id}
                course={course}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;