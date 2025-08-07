import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Plus,
  MapPin,
  Clock,
  Eye,
  Shield,
  Users,
  Camera,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  time: string;
  type: 'incident' | 'safety_tip' | 'location_update' | 'general';
  title: string;
  content: string;
  location?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  urgency: 'low' | 'medium' | 'high';
  verified: boolean;
}

const CommunityFeed = () => {
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState<{
    title: string;
    content: string;
    type: 'incident' | 'safety_tip' | 'location_update' | 'general';
    location: string;
  }>({
    title: '',
    content: '',
    type: 'general',
    location: ''
  });
  const [posts, setPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'Sarah M.',
      avatar: '👩🏽‍💼',
      time: '15 minutes ago',
      type: 'incident',
      title: 'Poor lighting on Jan Smuts Avenue',
      content: 'Walking from Rosebank Station to the mall tonight, noticed several street lights are out between 7th and 9th street. Felt unsafe. Reported to city council.',
      location: 'Jan Smuts Ave, Rosebank',
      likes: 12,
      comments: 5,
      isLiked: false,
      urgency: 'medium',
      verified: true
    },
    {
      id: '2',
      author: 'Nomsa K.',
      avatar: '👩🏿‍⚕️',
      time: '1 hour ago',
      type: 'safety_tip',
      title: 'Self-defense tip: Awareness is key',
      content: 'Remember ladies, always be aware of your surroundings. Keep your phone charged, walk confidently, and trust your instincts. If something feels off, it probably is.',
      likes: 28,
      comments: 8,
      isLiked: true,
      urgency: 'low',
      verified: true
    },
    {
      id: '3',
      author: 'Lerato T.',
      avatar: '👩🏾‍🎓',
      time: '3 hours ago',
      type: 'location_update',
      title: 'Security patrol active in Sandton CBD',
      content: 'Just saw increased security presence around Sandton City. Police van stationed at main entrance. Feeling much safer shopping today!',
      location: 'Sandton City Mall',
      likes: 15,
      comments: 3,
      isLiked: false,
      urgency: 'low',
      verified: true
    }
  ]);
  const { toast } = useToast();

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const submitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: 'You',
      avatar: '👤',
      time: 'Just now',
      type: newPost.type,
      title: newPost.title,
      content: newPost.content,
      location: newPost.location,
      likes: 0,
      comments: 0,
      isLiked: false,
      urgency: newPost.type === 'incident' ? 'medium' : 'low',
      verified: true
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', type: 'general', location: '' });
    setShowNewPost(false);
    
    toast({
      title: "Post Shared! 📢",
      description: "Thank you for keeping our community informed",
    });
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'incident': return 'bg-danger text-danger-foreground';
      case 'safety_tip': return 'bg-success text-success-foreground';
      case 'location_update': return 'bg-accent-blue text-accent-blue-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-danger text-danger-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      default: return 'bg-success text-success-foreground';
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Community Feed</h2>
          <p className="text-sm text-muted-foreground">Stay connected, stay safe together</p>
        </div>
        <Button onClick={() => setShowNewPost(!showNewPost)} variant="hero">
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Community Stats */}
      <Card className="shadow-soft bg-gradient-primary text-white border-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">847</div>
              <div className="text-sm opacity-90">Active Members</div>
            </div>
            <div>
              <div className="text-2xl font-bold">124</div>
              <div className="text-sm opacity-90">Reports Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-sm opacity-90">Verified Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Post Form */}
      {showNewPost && (
        <Card className="shadow-soft border-primary/20 animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-primary" />
              Share with Community
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="sm"
                variant={newPost.type === 'incident' ? 'destructive' : 'outline'}
                onClick={() => setNewPost(prev => ({ ...prev, type: 'incident' }))}
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Incident
              </Button>
              <Button
                size="sm"
                variant={newPost.type === 'safety_tip' ? 'success' : 'outline'}
                onClick={() => setNewPost(prev => ({ ...prev, type: 'safety_tip' }))}
              >
                <Shield className="w-4 h-4 mr-1" />
                Safety Tip
              </Button>
            </div>
            
            <Input
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
            />
            
            <Textarea
              placeholder="Share details with the community..."
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              rows={3}
            />
            
            <Input
              placeholder="Location (optional)"
              value={newPost.location}
              onChange={(e) => setNewPost(prev => ({ ...prev, location: e.target.value }))}
            />
            
            <div className="flex gap-2">
              <Button onClick={submitPost} variant="hero" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Share Post
              </Button>
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-soft hover:shadow-strong transition-all duration-300">
            <CardContent className="p-4">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{post.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.author}</span>
                      {post.verified && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {post.time}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getPostTypeColor(post.type)}>
                    {post.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={getUrgencyColor(post.urgency)}>
                    {post.urgency}
                  </Badge>
                </div>
              </div>

              {/* Post Content */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.content}</p>
                {post.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {post.location}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleLike(post.id)}
                    className={post.isLiked ? 'text-primary' : ''}
                  >
                    <ThumbsUp className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-current' : ''}`} />
                    {post.likes}
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments}
                  </Button>
                </div>
                <Button size="sm" variant="ghost">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <Card className="shadow-soft">
        <CardContent className="p-4 text-center">
          <Button variant="outline" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            Load More Posts
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityFeed;