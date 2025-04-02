"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/dashboard/SideBar";
import { Search, Filter, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";

// Secure environment variable handling
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

// Enhanced type definitions
interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  publishedAt: string;
}

export default function TutorialPage() {
  // State management
  const [collapsed, setCollapsed] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch videos with improved error handling and loading state
  const fetchVideos = useCallback(async () => {
    // Validate API key and channel ID
    if (!API_KEY || !CHANNEL_ID) {
      toast.error("Configuration Error",{
        title: "Configuration Error",
        description: "YouTube API configuration is missing",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Construct search query
      const query = `${selectedChapter || searchQuery} ${selectedClass} ${selectedSubject}`.trim();
      
      // First, search for videos
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&q=${query}&part=snippet&type=video&maxResults=20&order=relevance`
      );
      
      const searchData = await searchResponse.json();
      
      // Transform search results into tutorial objects
      const fetchedTutorials: Tutorial[] = searchData.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.high.url,
        videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
        publishedAt: item.snippet.publishedAt
      })) || [];

      setTutorials(fetchedTutorials);
      
      // Show toast if no results found
      if (fetchedTutorials.length === 0) {
        toast({
          title: "No Results",
          description: "No tutorials found for your search",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error fetching tutorials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tutorials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedClass, selectedSubject, selectedChapter, searchQuery]);

  // Reset dependent fields when class changes
  useEffect(() => {
    setSelectedSubject("");
    setSelectedChapter("");
  }, [selectedClass]);

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-black overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={`flex-1 transition-all duration-500 ease-in-out ${collapsed ? "ml-20" : "ml-64"}`}>
        <div className="p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-4xl font-bold text-blue-700">Educational Tutorials</h1>
              <p className="text-gray-600 mt-2">Find the perfect learning resource</p>
            </div>
          </motion.div>

          {/* Filtering Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Class Selector */}
            <Select 
              value={selectedClass} 
              onValueChange={setSelectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(educationalContent).map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Subject Selector */}
            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
              disabled={!selectedClass}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {selectedClass ? 
                  Object.keys(educationalContent[selectedClass]).map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  )) : []
                }
              </SelectContent>
            </Select>

            {/* Chapter Selector */}
            <Select 
              value={selectedChapter} 
              onValueChange={setSelectedChapter}
              disabled={!selectedClass || !selectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
                {selectedClass && selectedSubject ? 
                  educationalContent[selectedClass][selectedSubject].map((chapter) => (
                    <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                  )) : []
                }
              </SelectContent>
            </Select>

            {/* Search Input */}
            <div className="flex">
              <Input
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 mr-2"
              />
              <Button 
                onClick={fetchVideos}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </motion.div>

          {/* Tutorials Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-6 w-3/4" />
                  </CardContent>
                </Card>
              ))
            ) : (
              tutorials.map((tutorial) => (
                <Card 
                  key={tutorial.id} 
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-lg truncate">{tutorial.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative aspect-video mb-4">
                      <img 
                        src={tutorial.thumbnailUrl} 
                        alt={tutorial.title} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <PlayCircle className="text-white w-16 h-16" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {tutorial.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => window.open(tutorial.videoUrl, '_blank')}
                    >
                      Watch Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}