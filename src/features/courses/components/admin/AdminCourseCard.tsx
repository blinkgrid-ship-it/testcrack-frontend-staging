import { 
  MoreVertical, 
  Users, 
  Star, 
  Clock, 
  Eye, 
  Edit3, 
  Trash2,
  Calendar
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/shared/components/ui/dropdown-menu";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export interface AdminCourse {
  id: string;
  title: string;
  description: string;
  students: number;
  rating: number;
  duration: string;
  price: number;
  status: 'published' | 'draft';
  lastUpdated: string;
  thumbnail: string;
}

interface AdminCourseCardProps {
  course: AdminCourse;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AdminCourseCard = ({ course, onEdit, onView, onDelete }: AdminCourseCardProps) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={course.title}
          className="w-full h-full object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
            course.status === 'published' 
              ? 'bg-green-500 text-white' 
              : 'bg-yellow-500 text-white'
          }`}>
            {course.status}
          </Badge>
        </div>

        {/* Floating Actions */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="h-8 w-8 rounded-lg bg-white hover:bg-gray-100 text-gray-700">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 p-1 rounded-lg border-gray-200">
              <DropdownMenuItem onClick={() => onView(course.id)} className="rounded-md px-3 py-2 text-sm hover:bg-gray-50 font-medium">
                <Eye className="mr-2 h-4 w-4" /> Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(course.id)} className="rounded-md px-3 py-2 text-sm hover:bg-gray-50 font-medium">
                <Edit3 className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <div className="h-px bg-gray-100 my-1" />
              <DropdownMenuItem 
                onClick={() => onDelete(course.id)} 
                className="rounded-md px-3 py-2 text-sm hover:bg-red-50 font-medium text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>
        
        <p className="mt-2 text-gray-500 text-sm leading-relaxed line-clamp-2">
          {course.description}
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-medium text-gray-600">{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium text-gray-600">{course.rating}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-purple-500" />
            <span className="text-xs font-medium text-gray-600">{course.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-teal-500" />
            <span className="text-xs font-medium text-gray-600">{course.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Footer / Price */}
      <div className="px-5 pb-5 mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            ${course.price}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-indigo-600 font-medium hover:bg-gray-50 hover:text-indigo-700 rounded-lg px-4"
            onClick={() => onEdit(course.id)}
          >
            Manage →
          </Button>
        </div>
      </div>
    </div>
  );
};