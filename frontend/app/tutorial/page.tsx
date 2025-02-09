"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Search } from "lucide-react";
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

const API_KEY = "AIzaSyBJIx6IBWpX66SrLHNpHjHjAPwNkW51La0";
const CHANNEL_ID = "UCSIRmKsrk-tYW8p736ZYhfg";

interface Tutorial {
  id: string;
  title: string;
  videoUrl: string;
}

const classes = ["Class 9", "Class 10"];
const subjects = ["Maths", "Science"];
const chapters = {
  "Class 9": {
    Maths: [
      "Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables",
      "Introduction to Euclid's Geometry", "Lines and Angles", "Triangles", "Quadrilaterals",
      "Circles", "Heron's Formula", "Surface Areas and Volumes", "Statistics"
    ],
    Science: [
      "Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules",
      "Structure of The Atom", "The Fundamental Unit of Life", "Tissues",
      "Diversity in Living Organisms", "Motion", "Force and Laws of Motion",
      "Gravitation", "Work and Energy", "Sound", "Why Do We Fall ill",
      "Natural Resources", "Improvement in Food Resources"
    ]
  },
  "Class 10": {
    Maths: [
      "Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables",
      "Quadratic Equations", "Arithmetic Progressions", "Triangles", "Coordinate Geometry",
      "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles",
      "Constructions", "Areas Related to Circles", "Surface Areas and Volumes",
      "Statistics", "Probability"
    ],
    Science: [
      "Chemical reactions and equations", "Acids, Bases and Salt", "Metals and Non-metals",
      "Carbon and Its Compounds", "Life Processes", "Control and Coordination",
      "How Do Organisms Reproduce?", "Heredity and Evolution", "Light Reflection and Refraction",
      "The Human Eye and Colourful World", "Electricity", "Magnetic Effects of Electric Current",
      "Our Environment"
    ]
  }
};

export default function TutorialPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);

  useEffect(() => {
    fetchRecentVideos();
  }, []);

  const fetchRecentVideos = async () => {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&type=video&maxResults=50`);
      const data = await res.json();
      setTutorials(data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        videoUrl: `https://www.youtube.com/embed/${item.id.videoId}`
      })) || []);
    } catch (error) {
      console.error("Error fetching recent videos:", error);
    }
  };

  const fetchSearchResults = async () => {
    const query = `${selectedChapter || searchQuery} ${selectedClass} ${selectedSubject}`.trim();
    if (!query) return;
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&q=${query}&type=playlist&maxResults=10`);
      const data = await res.json();
      if (data.items?.length > 0) {
        const playlistId = data.items[0].id.playlistId;
        const playlistRes = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=50`);
        const playlistData = await playlistRes.json();
        setTutorials(playlistData.items?.map((item: any) => ({
          id: item.snippet?.resourceId?.videoId,
          title: item.snippet.title,
          videoUrl: `https://www.youtube.com/embed/${item.snippet?.resourceId?.videoId}`
        })) || []);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-black overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      
      <main className={`relative flex-1 transition-all duration-500 ease-in-out ${collapsed ? "ml-20" : "ml-64"}`}>
        <div className="p-8 max-w-7xl mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-1">
              <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow-sm">Tutorials</h1>
              <p className="text-lg text-black opacity-80">Browse educational content</p>
            </div>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedSubject} 
              onValueChange={setSelectedSubject}
              disabled={!selectedClass}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedChapter} 
              onValueChange={setSelectedChapter}
              disabled={!selectedClass || !selectedSubject}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Select Chapter" />
              </SelectTrigger>
              <SelectContent>
                {selectedClass && selectedSubject && chapters[selectedClass]?.[selectedSubject]?.map((chapter) => (
                  <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 flex-1">
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={fetchSearchResults}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {tutorials.map((tutorial) => (
              <motion.div
                key={tutorial.id}
                className="bg-white rounded-xl shadow-lg border border-blue-600 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4">
                  <h3 className="text-xl font-bold text-blue-700 mb-4">{tutorial.title}</h3>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <iframe
                      className="absolute w-full h-full"
                      src={tutorial.videoUrl}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}