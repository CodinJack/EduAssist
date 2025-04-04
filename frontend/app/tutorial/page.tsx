"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  BookOpen, 
  PlayCircle, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  FilePlus, 
  PenLine
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/dashboard/SideBar";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/TextArea";

// Types
interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  category: string;
}

// Sample pre-defined notes
const sampleNotes: Note[] = [
  {
    id: "note-1",
    title: "Quadratic Equations",
    content: "A quadratic equation is a polynomial equation of the second degree, meaning it contains at least one term that is squared. The standard form is ax² + bx + c = 0 with a ≠ 0. The quadratic formula to find solutions is x = (-b ± √(b² - 4ac)) / 2a.",
    createdAt: new Date("2025-02-15"),
    category: "Mathematics"
  },
  {
    id: "note-2",
    title: "Newton's Laws of Motion",
    content: "1. First Law (Law of Inertia): An object will remain at rest or in uniform motion in a straight line unless acted upon by an external force.\n\n2. Second Law: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass (F = ma).\n\n3. Third Law: For every action, there is an equal and opposite reaction.",
    createdAt: new Date("2025-02-20"),
    category: "Physics"
  },
  {
    id: "note-3",
    title: "Basic HTML Structure",
    content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n  <meta charset=\"UTF-8\">\n</head>\n<body>\n  <h1>Main Heading</h1>\n  <p>Paragraph text</p>\n</body>\n</html>",
    createdAt: new Date("2025-03-01"),
    category: "Computer Science"
  },
  {
    id: "note-4",
    title: "Periodic Table Elements",
    content: "The periodic table is organized by atomic number, electron configuration, and recurring chemical properties. Elements are presented in order of increasing atomic number.\n\n- Group 1: Alkali metals (Li, Na, K, Rb, Cs, Fr)\n- Group 2: Alkaline earth metals (Be, Mg, Ca, Sr, Ba, Ra)\n- Groups 3-12: Transition metals\n- Group 17: Halogens (F, Cl, Br, I, At, Ts)\n- Group 18: Noble gases (He, Ne, Ar, Kr, Xe, Rn, Og)",
    createdAt: new Date("2025-03-05"),
    category: "Chemistry"
  }
];

// YouTube safe search terms
const safeSearchTerms = [
  "educational", "tutorial", "lecture", "course", "lesson", "learn", "study", 
  "academic", "school", "university", "college", "education", "teaching"
];

const TutorialPage = () => {
  // State
  const [collapsed, setCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [notes, setNotes] = useState<Note[]>(sampleNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Note Creation
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteTopic, setNewNoteTopic] = useState("");

  // Content filtering for educational purposes
  const sanitizeSearchQuery = (query: string): string => {
    // Always append a safe search term to ensure educational content
    const randomSafeSearchIndex = Math.floor(Math.random() * safeSearchTerms.length);
    return `${query} ${safeSearchTerms[randomSafeSearchIndex]}`;
  };

  // Fetch videos from YouTube API
  const fetchVideos = async () => {
    // In a real app, we'd call a backend API that securely handles the YouTube API key
    setLoading(true);
    
    try {
      // This is a mock implementation - in production, this would be a backend call
      const searchTerm = sanitizeSearchQuery(searchQuery);
      
      // This is a simulation - in reality we would call our backend which would call YouTube API
      setTimeout(() => {
        // Generate mock videos based on search terms
        const mockResults = generateMockVideos(searchTerm);
        setVideos(mockResults);
        setTotalPages(Math.ceil(mockResults.length / 6));
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch videos. Please try again.");
      setLoading(false);
    }
  };

  // Generate mock videos for demo purposes
  const generateMockVideos = (searchTerm: string): Video[] => {
    const mockVideos: Video[] = [];
    const topics = searchTerm.split(" ");
    
    // Create 10-20 mock videos
    const count = 10 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < count; i++) {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const adjectives = ["Complete", "Comprehensive", "Ultimate", "Basic", "Advanced", "Essential"];
      const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
      
      mockVideos.push({
        id: `vid-${Date.now()}-${i}`,
        title: `${randomAdj} ${randomTopic} Tutorial - Part ${i + 1}`,
        description: `Learn everything about ${randomTopic} in this ${randomAdj.toLowerCase()} tutorial. Perfect for students and professionals.`,
        thumbnailUrl: `https://picsum.photos/seed/${randomTopic}${i}/640/360`,
        channelTitle: "Educational Channel",
        publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      });
    }
    
    return mockVideos;
  };

  const getPaginatedVideos = () => {
    const start = (page - 1) * 6;
    const end = start + 6;
    return videos.slice(start, end);
  };

  const handleWatchVideo = (video: Video) => {
    setCurrentVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleViewNote = (note: Note) => {
    setSelectedNote(note);
  };
  
  // Handle note creation
  const handleCreateNote = () => {
    if (!newNoteTitle.trim()) {
      toast.error("Please enter a note title");
      return;
    }
    
    if (!newNoteTopic.trim()) {
      toast.error("Please enter a topic for the note");
      return;
    }
    
    toast.success("Generating note content...");
    
    // This would be replaced with actual AI generation
    // For now, we'll just create a placeholder note
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: newNoteTitle,
      content: `This is a placeholder for AI-generated content about ${newNoteTopic}. In the real application, this would be generated by an AI service like Gemini.`,
      createdAt: new Date(),
      category: newNoteTopic
    };
    
    setNotes([newNote, ...notes]);
    setNewNoteTitle("");
    setNewNoteTopic("");
    setIsCreateNoteOpen(false);
    setSelectedNote(newNote);
  };

  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <BookOpen className="h-8 w-8 text-quiz-purple mr-3" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-quiz-purple to-quiz-blue text-transparent bg-clip-text">
                Learn & Discover
              </h1>
            </div>
            <p className="text-gray-600 mb-4">
              Find educational videos and study materials to enhance your learning
            </p>
            
            <Tabs defaultValue="videos" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="videos" className="text-base">
                  <PlayCircle className="w-5 h-5 mr-2" /> Video Tutorials
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-base">
                  <FileText className="w-5 h-5 mr-2" /> Study Notes
                </TabsTrigger>
              </TabsList>

              {/* Videos Tab */}
              <TabsContent value="videos" className="mt-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Search Form */}
                  <Card className="mb-8 border border-gray-200 shadow-sm">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <Input
                            ref={searchInputRef}
                            placeholder="Search for educational videos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                            onKeyPress={(e) => e.key === 'Enter' && fetchVideos()}
                          />
                        </div>
                        <Button 
                          onClick={fetchVideos} 
                          disabled={loading}
                          className="bg-gradient-to-r from-quiz-purple to-quiz-blue hover:opacity-90 text-white px-6"
                        >
                          {loading ? (
                            <span className="flex items-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              Searching...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Search className="w-4 h-4 mr-2" />
                              Search
                            </span>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Results Container */}
                  <div>
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="mt-3">
                              <Skeleton className="h-6 w-3/4 mb-2" />
                              <Skeleton className="h-4 w-1/2 mb-2" />
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-11/12" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : videos.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {getPaginatedVideos().map((video) => (
                            <Card key={video.id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                              <div className="relative aspect-video">
                                <img 
                                  src={video.thumbnailUrl} 
                                  alt={video.title} 
                                  className="w-full h-full object-cover"
                                />
                                <div 
                                  className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                  onClick={() => handleWatchVideo(video)}
                                >
                                  <PlayCircle className="text-white w-16 h-16" />
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-semibold text-lg mb-1 line-clamp-2" title={video.title}>
                                  {video.title}
                                </h3>
                                <div className="text-sm text-gray-500 mb-2">
                                  {new Date(video.publishedAt).toLocaleDateString()}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                  {video.description}
                                </p>
                              </CardContent>
                              <CardFooter className="p-4 pt-0">
                                <Button 
                                  onClick={() => handleWatchVideo(video)} 
                                  variant="outline" 
                                  className="w-full"
                                >
                                  <PlayCircle className="w-4 h-4 mr-2" /> Watch Now
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center mt-8 items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPage(p => Math.max(p - 1, 1))}
                              disabled={page === 1}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                              Page {page} of {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                              disabled={page === totalPages}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg border border-dashed border-gray-300 text-center">
                        <PlayCircle className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-1">No Videos Found</h3>
                        <p className="text-gray-500 mb-4 max-w-md">
                          Use the search bar above to find educational videos on your favorite topics.
                        </p>
                        <Button onClick={() => {
                          setSearchQuery("Introduction to learning");
                          fetchVideos();
                        }}>
                          <Search className="w-4 h-4 mr-2" /> Try a Sample Search
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="mt-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-quiz-purple" />
                      Study Notes Library
                    </h2>
                    <Button 
                      onClick={() => setIsCreateNoteOpen(true)}
                      className="bg-gradient-to-r from-quiz-purple to-quiz-blue hover:opacity-90"
                    >
                      <FilePlus className="w-4 h-4 mr-2" />
                      Create AI Note
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Notes Sidebar */}
                    <div className="lg:col-span-1">
                      <Card className="border border-gray-200 h-full shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-quiz-purple" />
                            My Notes
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="h-[600px] overflow-auto pb-0">
                          <div className="space-y-3">
                            {notes.map((note) => (
                              <div 
                                key={note.id} 
                                className={`p-3 border rounded-md cursor-pointer transition-all ${
                                  selectedNote?.id === note.id 
                                    ? 'border-quiz-purple bg-quiz-purple/5' 
                                    : 'border-gray-200 hover:border-quiz-purple/50'
                                }`}
                                onClick={() => handleViewNote(note)}
                              >
                                <h4 className="font-medium mb-1 line-clamp-1">{note.title}</h4>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                    {note.category}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {note.createdAt.toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Note Content */}
                    <div className="lg:col-span-2">
                      <Card className="border border-gray-200 h-full shadow-sm">
                        {selectedNote ? (
                          <>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-xl">{selectedNote.title}</CardTitle>
                                <span className="text-sm bg-quiz-purple/10 text-quiz-purple px-3 py-1 rounded-full">
                                  {selectedNote.category}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="prose max-w-none">
                                {selectedNote.content.split('\n\n').map((paragraph, idx) => (
                                  <p key={idx} className="mb-4">
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </CardContent>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[600px] text-center p-6">
                            <FileText className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Note</h3>
                            <p className="text-gray-500 max-w-md">
                              Choose a study note from the sidebar to view its content
                            </p>
                          </div>
                        )}
                      </Card>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Video Modal */}
      {isVideoModalOpen && currentVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium truncate">{currentVideo.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsVideoModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="aspect-video w-full">
              <div className="w-full h-full bg-black flex items-center justify-center text-white">
                {/* In a real app, this would be an iframe with the YouTube embed */}
                <div className="text-center">
                  <PlayCircle className="w-20 h-20 mx-auto mb-4 opacity-70" />
                  <p>This is a mock player for demonstration.</p>
                  <p className="text-sm mt-2 text-gray-400">
                    In a production app, this would show the actual YouTube video.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-medium text-lg mb-2">{currentVideo.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{currentVideo.description}</p>
              <div className="flex justify-end">
                <Button variant="outline" className="mr-2" onClick={() => setIsVideoModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Create Note Dialog */}
      <Dialog open={isCreateNoteOpen} onOpenChange={setIsCreateNoteOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PenLine className="w-5 h-5 mr-2 text-quiz-purple" />
              Create AI-Generated Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="noteTitle" className="text-sm font-medium">Note Title</label>
              <Input
                id="noteTitle"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Enter a title for your note"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="noteTopic" className="text-sm font-medium">Topic</label>
              <Input
                id="noteTopic"
                value={newNoteTopic}
                onChange={(e) => setNewNoteTopic(e.target.value)}
                placeholder="Enter the topic to generate notes about"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateNoteOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNote}
              className="bg-gradient-to-r from-quiz-purple to-quiz-blue hover:opacity-90"
            >
              Generate Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorialPage;
