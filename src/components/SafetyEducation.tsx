import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Shield, 
  Users, 
  Heart,
  Play,
  Star,
  Clock,
  Trophy,
  MessageCircle,
  Lightbulb,
  AlertTriangle,
  Eye,
  Phone,
  Navigation,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'self-defense' | 'awareness' | 'emergency' | 'legal';
  progress: number;
  rating: number;
  students: number;
}

interface Discussion {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
}

const SafetyEducation = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const { toast } = useToast();

  const courses: Course[] = [
    {
      id: '1',
      title: 'Basic Self-Defense Techniques',
      description: 'Learn fundamental self-defense moves that can help you escape dangerous situations',
      duration: '45 min',
      difficulty: 'beginner',
      category: 'self-defense',
      progress: 75,
      rating: 4.8,
      students: 1234
    },
    {
      id: '2',
      title: 'Situational Awareness 101',
      description: 'Develop skills to read your environment and identify potential threats early',
      duration: '30 min',
      difficulty: 'beginner',
      category: 'awareness',
      progress: 100,
      rating: 4.9,
      students: 2156
    },
    {
      id: '3',
      title: 'Emergency Response Protocols',
      description: 'Know exactly what to do in various emergency situations',
      duration: '25 min',
      difficulty: 'intermediate',
      category: 'emergency',
      progress: 0,
      rating: 4.7,
      students: 893
    },
    {
      id: '4',
      title: 'Understanding Your Legal Rights',
      description: 'Know your rights and legal protections in South Africa',
      duration: '40 min',
      difficulty: 'intermediate',
      category: 'legal',
      progress: 25,
      rating: 4.6,
      students: 567
    }
  ];

  const discussions: Discussion[] = [
    {
      id: '1',
      title: 'Best apps for personal safety?',
      author: 'Sarah M.',
      replies: 23,
      lastActivity: '2 hours ago',
      category: 'Technology'
    },
    {
      id: '2',
      title: 'Walking alone at night - safety tips?',
      author: 'Nomsa K.',
      replies: 45,
      lastActivity: '4 hours ago',
      category: 'Prevention'
    },
    {
      id: '3',
      title: 'Public transport safety in Johannesburg',
      author: 'Lerato T.',
      replies: 67,
      lastActivity: '1 day ago',
      category: 'Transportation'
    }
  ];

  const quickTips = [
    {
      icon: Eye,
      title: "Trust Your Instincts",
      tip: "If something feels wrong, it probably is. Don't ignore your gut feelings."
    },
    {
      icon: Phone,
      title: "Keep Phone Charged",
      tip: "Always ensure your phone has battery for emergencies. Carry a power bank."
    },
    {
      icon: Users,
      title: "Travel in Groups",
      tip: "There's safety in numbers. When possible, travel with trusted friends."
    },
    {
      icon: Navigation,
      title: "Share Your Location",
      tip: "Let trusted contacts know where you're going and when you expect to arrive."
    }
  ];

  const startCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    toast({
      title: "📚 Course Started",
      description: `Starting "${course?.title}" - Let's learn together!`,
    });
  };

  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-danger text-danger-foreground';
    }
  };

  const getCategoryIcon = (category: Course['category']) => {
    switch (category) {
      case 'self-defense': return Shield;
      case 'awareness': return Eye;
      case 'emergency': return AlertTriangle;
      case 'legal': return BookOpen;
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Safety Education Hub</h2>
        <p className="text-muted-foreground">Learn, grow, and stay safe together</p>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-soft bg-gradient-primary text-white border-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm opacity-90">Courses</div>
            </div>
            <div>
              <div className="text-2xl font-bold">50%</div>
              <div className="text-sm opacity-90">Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold">12h</div>
              <div className="text-sm opacity-90">Learning Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="tips">Quick Tips</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4 mt-4">
          {/* Courses */}
          {courses.map((course) => {
            const CategoryIcon = getCategoryIcon(course.category);
            return (
              <Card key={course.id} className="shadow-soft hover:shadow-strong transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CategoryIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{course.title}</h3>
                        <Badge className={getDifficultyColor(course.difficulty)}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      
                      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-current" />
                          {course.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.students}
                        </div>
                      </div>

                      {course.progress > 0 && (
                        <div className="mb-3">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-success h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      <Button 
                        onClick={() => startCourse(course.id)}
                        variant={course.progress > 0 ? "outline" : "hero"}
                        size="sm"
                        className="w-full"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {course.progress > 0 ? 'Continue' : 'Start'} Course
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="tips" className="space-y-4 mt-4">
          {/* Quick Tips */}
          <div className="grid gap-4">
            {quickTips.map((tip, index) => (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                      <tip.icon className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.tip}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Daily Safety Reminder */}
          <Card className="shadow-soft border-warning/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <Lightbulb className="w-5 h-5" />
                Daily Safety Reminder
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                🌟 <strong>Today's Focus:</strong> Practice the "buddy system" - let someone know where you're going, 
                when you expect to return, and check in with them upon arrival. Simple communication can be 
                your strongest safety tool.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4 mt-4">
          {/* Community Discussions */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Community Discussions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {discussions.map((discussion) => (
                <div key={discussion.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-foreground">{discussion.title}</h3>
                    <Badge variant="outline">{discussion.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>by {discussion.author}</span>
                    <span>{discussion.replies} replies</span>
                    <span>{discussion.lastActivity}</span>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Start New Discussion
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="shadow-soft border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <Trophy className="w-5 h-5" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-success/10">
                  <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-sm font-medium">Course Completionist</div>
                  <div className="text-xs text-muted-foreground">Completed 2 courses</div>
                </div>
                <div className="text-center p-3 rounded-lg bg-accent-blue/10">
                  <Users className="w-8 h-8 text-accent-blue mx-auto mb-2" />
                  <div className="text-sm font-medium">Community Helper</div>
                  <div className="text-xs text-muted-foreground">15 helpful replies</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SafetyEducation;