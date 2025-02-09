"use client";

import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, Card, CardContent, Typography, Box } from "@mui/material";

const API_KEY = "AIzaSyBJIx6IBWpX66SrLHNpHjHjAPwNkW51La0";
const CHANNEL_ID = "UCSIRmKsrk-tYW8p736ZYhfg";

interface Tutorial {
  id: string;
  title: string;
  videoUrl: string;
}

const classes = ["Class 9", "Class 10"];
const subjects = ["Maths", "Science"];
const chapters: { [key: string]: { [key: string]: string[] } } = {
  "Class 9": {
    Maths: [
      "Number Systems", "Polynomials", "Coordinate Geometry", "Linear Equations in Two Variables", "Introduction to Euclid’s Geometry", 
      "Lines and Angles", "Triangles", "Quadrilaterals", "Circles", "Heron’s Formula", "Surface Areas and Volumes", "Statistics"
    ],
    Science: [
      "Matter in Our Surroundings", "Is Matter Around Us Pure", "Atoms and Molecules", "Structure of The Atom", "The Fundamental Unit of Life", 
      "Tissues", "Diversity in Living Organisms", "Motion", "Force and Laws of Motion", "Gravitation", "Work and Energy", "Sound", 
      "Why Do We Fall ill", "Natural Resources", "Improvement in Food Resources"
    ]
  },
  "Class 10": {
    Maths: [
      "Real Numbers", "Polynomials", "Pair of Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progressions", 
      "Triangles", "Coordinate Geometry", "Introduction to Trigonometry", "Some Applications of Trigonometry", "Circles", 
      "Constructions", "Areas Related to Circles", "Surface Areas and Volumes", "Statistics", "Probability"
    ],
    Science: [
      "Chemical reactions and equations", "Acids, Bases and Salt", "Metals and Non-metals", "Carbon and Its Compounds", "Life Processes", 
      "Control and Coordination", "How Do Organisms Reproduce?", "Heredity and Evolution", "Light Reflection and Refraction", 
      "The Human Eye and Colourful World", "Electricity", "Magnetic Effects of Electric Current", "Our Environment"
    ]
  }
};

export default function TutorialPage() {
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
    const query = `${selectedChapter || searchQuery} ${selectedClass} ${selectedSubject} `.trim();
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
    <Box sx={{ padding: "24px", maxWidth: "1200px", margin: "auto", textAlign:"center"}}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontFamily: "'Poppins', sans-serif", 
          fontWeight: "600",
          color: "#2C3E50", 
          textTransform: "uppercase", 
          letterSpacing: "1.5px", 
          textAlign: "center", 
        }}
      >
        Tutorial Section
      </Typography>

      
      <Box sx={{ display: "flex", gap: "16px", flexWrap: "", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
      <Select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>Select Class</MenuItem>
          {classes.map((cls) => (
            <MenuItem key={cls} value={cls}>{cls}</MenuItem>
          ))}
        </Select>

        <Select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          displayEmpty
          disabled={!selectedClass}
        >
          <MenuItem value="" disabled>Select Subject</MenuItem>
          {subjects.map((subject) => (
            <MenuItem key={subject} value={subject}>{subject}</MenuItem>
          ))}
        </Select>

        <Select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          displayEmpty
          disabled={!selectedClass || !selectedSubject}
        >
          <MenuItem value="" disabled>Select Chapter</MenuItem>
          {selectedClass && selectedSubject && chapters[selectedClass]?.[selectedSubject]?.map((chapter) => (
            <MenuItem key={chapter} value={chapter}>{chapter}</MenuItem>
          ))}
        </Select>

        <TextField
          placeholder="Enter topic name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <Button
            variant="contained"
            color="primary"
            onClick={fetchSearchResults}
            sx={{
              fontSize: "1 rem", // Increases text size
              padding: "12px 24px", // Adds more padding
              minWidth: "150px", // Ensures a minimum width
              borderRadius: "8px", // Makes the button look smoother
            }}
          >
          Search
        </Button>
      
      </Box>

      
      <Box sx={{ justifyContent:"center " ,display: "", overflowX: "auto", gap: "16px", marginTop: "16px", paddingBottom: "16px" }}>
        {tutorials.map((tutorial) => (
          <Card key={tutorial.id} sx={{ minWidth: "300px" }}>
            <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0.5rem",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "'Pacifico', cursive",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#00000",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                  textAlign: "center",
                }}
              >
                {tutorial.title}
              </Typography>

              <iframe
                style={{
                  width: "60%", // Increased for better alignment
                  height: "250px",
                  borderRadius: "10px",
                  margin: "1rem",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
                src={tutorial.videoUrl}
                allowFullScreen
              ></iframe>
            </Box>

            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
