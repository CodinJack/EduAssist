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
  PenLine,
  Trash2
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
import { createTutorialNotes, getAllNotesForUserId, deleteNote } from "@/services/tutorialService";
import NotesRenderer from "@/components/NotesRenderer";

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

const TutorialPage = () => {
  // State
  const [collapsed, setCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Note Creation
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteTopic, setNewNoteTopic] = useState("");

  // Fetch YouTube videos
  const fetchVideos = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would call your backend API endpoint that safely handles YouTube API keys
      const response = await fetch(`/api/youtube?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      // Transform YouTube API response to our Video type
      const formattedVideos: Video[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt
      }));
      
      setVideos(formattedVideos);
      setTotalPages(Math.ceil(formattedVideos.length / 6));
      setPage(1);
    } catch (error) {
      console.error("Error fetching videos:", error);
      toast.error("Failed to fetch videos. Please try again.");
    } finally {
      setLoading(false);
    }
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

  const handleDeleteNote = async (noteId: string) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteNote = async () => {
    if (!noteToDelete) return;
    
    try {
      await deleteNote(noteToDelete);
      
      // Update state
      setNotes(notes.filter(note => note.id !== noteToDelete));
      
      // Clear selection if the deleted note was selected
      if (selectedNote?.id === noteToDelete) {
        setSelectedNote(null);
      }
      
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    } finally {
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    }
  };
  
  const handleCreateNote = async () => {  
    if (!newNoteTopic.trim()) {
      toast.error("Please enter a topic for the note");
      return;
    }
  
    try {
      toast.loading("Generating notes...");
  
      const userId = user?.uid;
      if (!userId) {
        toast.error("User not logged in");
        return;
      }
  
      // Call backend + Firestore save
      const result = await createTutorialNotes({
        topic: newNoteTopic,
        userId: userId
      });
      console.log(result);
      // Create local note object for UI using returned data
      const newNote: Note = {
        id: result.id,
        title: newNoteTitle,
        content: result?.notes || `Notes for ${newNoteTopic}`,
        createdAt: new Date(),
        category: newNoteTopic
      };
  
      setNotes([newNote, ...notes]);
      setNewNoteTitle("");
      setNewNoteTopic("");
      setIsCreateNoteOpen(false);
      setSelectedNote(newNote);
      toast.success("Notes created successfully!");
    } catch (err) {
      console.error("Note creation failed:", err);
      toast.error("Failed to create notes");
    } finally {
      toast.dismiss(); // Remove loading toast
    }
  };

  // Load user's notes from Firestore
  const loadUserNotes = async () => {
    if (!user?.uid) return;
    
    setLoadingNotes(true);
    try {
      const userNotes = await getAllNotesForUserId(user.uid);
      
      // Transform to our Note format if needed
      const formattedNotes: Note[] = userNotes.map(note => ({
        id: note.id,
        title: note.title || 'Untitled Note',
        content: note.notes || 'No content',
        createdAt: note.createdAt ? new Date(note.createdAt.toDate()) : new Date(),
        category: note.topic || 'General'
      }));
      
      setNotes(formattedNotes);
      
      // Select first note if available
      if (formattedNotes.length > 0 && !selectedNote) {
        setSelectedNote(formattedNotes[0]);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      toast.error("Failed to load your notes");
    } finally {
      setLoadingNotes(false);
    }
  };
  
  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Load user's notes when component mounts or user changes
    loadUserNotes();
  }, [user?.uid]);

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
                                  <span>{video.channelTitle}</span> • <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
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
                          setSearchQuery("Khan Academy");
                          fetchVideos();
                        }}>
                          <Search className="w-4 h-4 mr-2" /> Try an Educational Channel
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
                          {loadingNotes ? (
                            <div className="space-y-3">
                              {[...Array(4)].map((_, i) => (
                                <div key={i} className="p-3 border rounded-md">
                                  <Skeleton className="h-5 w-3/4 mb-2" />
                                  <div className="flex justify-between">
                                    <Skeleton className="h-4 w-1/4" />
                                    <Skeleton className="h-4 w-1/4" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : notes.length > 0 ? (
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
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium mb-1 line-clamp-1">{note.category}</h4>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-7 w-7 p-0" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNote(note.id);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs bg-gray-100">
                                      {}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {note.createdAt.toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                              <FileText className="w-12 h-12 text-gray-300 mb-3" />
                              <p className="text-sm text-gray-500">No notes found</p>
                              <Button 
                                variant="link" 
                                size="sm"
                                onClick={() => setIsCreateNoteOpen(true)}
                                className="mt-2"
                              >
                                Create your first AI note
                              </Button>
                            </div>
                          )}
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
                                {/* <CardTitle className="text-xl">{selectedNote.category}</CardTitle> */}
                                <CardTitle className="text-xl text-quiz-purple">
                                  {selectedNote.category}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="prose max-w-none">
                              <NotesRenderer content={selectedNote.content} />
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
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.id}`}
                className="w-full h-full"
                allowFullScreen
                title={currentVideo.title}
              />
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-500" />
              Delete Note
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this note? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteNote}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorialPage;