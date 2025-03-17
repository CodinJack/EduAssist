"use client";

import { useState, useEffect } from "react";
import { TextField, Button, MenuItem, Select, Card, CardContent, Typography, Box, Grid, Radio, RadioGroup, FormControlLabel } from "@mui/material";

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

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export default function PracticePage() {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("https://api.gemini.com/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class: selectedClass, subject: selectedSubject, chapter: selectedChapter, topic: searchQuery })
      });
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <Box sx={{ padding: "24px", maxWidth: "1200px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>Practice Questions</Typography>

      <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
        <Select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} displayEmpty>
          <MenuItem value="" disabled>Select Class</MenuItem>
          {classes.map((cls) => (<MenuItem key={cls} value={cls}>{cls}</MenuItem>))}
        </Select>

        <Select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} displayEmpty disabled={!selectedClass}>
          <MenuItem value="" disabled>Select Subject</MenuItem>
          {selectedClass && subjects.map((subject) => (<MenuItem key={subject} value={subject}>{subject}</MenuItem>))}
        </Select>

        <Select value={selectedChapter} onChange={(e) => setSelectedChapter(e.target.value)} displayEmpty disabled={!selectedClass || !selectedSubject}>
          <MenuItem value="" disabled>Select Chapter</MenuItem>
          {selectedClass && selectedSubject && chapters[selectedClass][selectedSubject].map((chapter) => (
            <MenuItem key={chapter} value={chapter}>{chapter}</MenuItem>
          ))}
        </Select>

        <TextField placeholder="Enter topic name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} fullWidth />
        <Button variant="contained" onClick={fetchQuestions}>Search</Button>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: "16px" }}>
        {questions.map((question) => (
          <Grid item xs={12} key={question.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{question.question}</Typography>
                <RadioGroup>
                  {question.options.map((option, index) => (
                    <FormControlLabel key={index} value={option} control={<Radio />} label={option} />
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
