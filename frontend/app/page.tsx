"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuroraBackground from "@/components/ui/AuroraBackground"
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Trophy, 
  Brain,
  Sparkles,
  BarChart,
  Clock,
  CheckCircle,
  Youtube,
  PenLine,
  Target, 
  Bookmark,
  BookMarked,
  ChevronRight,
  Code,
  Star,
  ChevronDown,
  ClipboardListIcon,
  CheckCircleIcon,
  BookmarkIcon,
  BookOpenIcon,
} from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function Landing() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
  
    const handleNavigation = (path: string) => {
      startTransition(() => {
        router.push(path);
      });
    };
  const features = [
    {
      title: "Custom Quizzes",
      description: "Generate quizzes tailored to your specific needs and learning goals, covering any topic or subject.",
      icon: <GraduationCap className="h-6 w-6 text-primary" />
    },
    {
      title: "Practice Sessions",
      description: "Reinforce your knowledge with focused practice sessions designed to target your weak areas.",
      icon: <BookOpen className="h-6 w-6 text-primary" />
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed statistics and performance tracking.",
      icon: <Trophy className="h-6 w-6 text-primary" />
    }
  ];

  const process = [
    {
      title: "Discover Topics",
      description: "Choose from a wide range of subjects and dive into what matters to you most.",
      icon: BookOpenIcon,
    },
    {
      title: "Generate Quizzes",
      description: "Let AI create tailored quizzes to test and sharpen your understanding.",
      icon: ClipboardListIcon,
    },
    {
      title: "Practice Smart",
      description: "Reinforce weak areas with targeted practice sessions and track progress.",
      icon: CheckCircleIcon,
    },
    {
      title: "Bookmark & Note",
      description: "Save tricky questions, take smart notes, and revisit them anytime.",
      icon: BookmarkIcon,
    },
  ];
  
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      }
    })
  };
  // Animation variants
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariant = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}

      <AuroraBackground className="min-h-screen flex flex-col items-center justify-center relative">
      {isPending && (
        <div className="z-50 fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
        </div>
      )}   
        <div className="absolute top-5 left-5 z-50 flex items-center">
          <div className="h-8 w-8 bg-primary rounded-lg flex-shrink-0 flex items-center justify-center mr-2">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-3xl text-gradient">EduAssist</span>
        </div>
        
        <div className="absolute top-5 right-20 z-50">
            <Button className="text-lg font-semibold" variant="ghost" onClick={()=>handleNavigation('/login')} >Login</Button>
        </div>
        
        <div className="container px-4 mx-auto max-w-7xl z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center mb-4"
            >
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                Transform your learning experience
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Master any subject with <br />
              <span className="text-gradient">personalized quizzes</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              EduAssist combines AI-powered quizzes and personalized practice sessions to help you learn faster, retain more, and achieve your academic goals.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
                <Button size="lg" onClick={()=>handleNavigation('/login')} className="relative overflow-hidden group">
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ArrowRight className="h-6 w-6 rotate-90" />
          </motion.div>
        </motion.div>
      </AuroraBackground>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features to Enhance Your Learning</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our platform combines AI technology with proven learning methods to help you master any subject efficiently.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* AI Quiz Generator Feature */}
            <motion.div 
              className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-xl shadow-lg"
              variants={itemVariant}
            >
              <div className="w-14 h-14 bg-quiz-purple/10 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-7 w-7 text-quiz-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Powered Quizzes</h3>
              <p className="text-gray-600 mb-4">
                Generate customized quizzes on any topic using our advanced AI. Test your knowledge and track your progress.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Personalized difficulty levels</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Instant feedback and scoring</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Track improvement over time</span>
                </li>
              </ul>
            </motion.div>
            
            {/* Practice Sessions Feature */}
            <motion.div 
              className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-lg"
              variants={itemVariant}
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Focused Practice Sessions</h3>
              <p className="text-gray-600 mb-4">
                Target your weak areas with specialized practice sessions. Our AI adapts to your learning needs.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Identifies your weak topics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Customized learning paths</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Progressive difficulty adjustment</span>
                </li>
              </ul>
            </motion.div>
            
            {/* AI Notes Generator Feature */}
            <motion.div 
              className="bg-gradient-to-br from-white to-green-50 p-8 rounded-xl shadow-lg"
              variants={itemVariant}
            >
              <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                <PenLine className="h-7 w-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI-Generated Study Notes</h3>
              <p className="text-gray-600 mb-4">
                Create comprehensive study notes on any topic instantly using our Gemini-powered AI assistant.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Concise and accurate summaries</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Custom formatting options</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Easy to save and share</span>
                </li>
              </ul>
            </motion.div>
            
            {/* Educational Video Search Feature */}
            <motion.div 
              className="bg-gradient-to-br from-white to-red-50 p-8 rounded-xl shadow-lg"
              variants={itemVariant}
            >
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                <Youtube className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Educational Video Search</h3>
              <p className="text-gray-600 mb-4">
                Find the most relevant educational videos on your topic from trusted sources across the web.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Smart educational content filtering</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Integrated learning experience</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Save videos for later viewing</span>
                </li>
              </ul>
            </motion.div>
            
            {/* Bookmark System Feature */}
            <motion.div 
              className="bg-gradient-to-br from-white to-amber-50 p-8 rounded-xl shadow-lg"
              variants={itemVariant}
            >
              <div className="w-14 h-14 bg-amber-500/10 rounded-full flex items-center justify-center mb-6">
                <BookMarked className="h-7 w-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Question Bookmarking</h3>
              <p className="text-gray-600 mb-4">
                Save important questions for later review. Build your personal collection of learning materials.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Organize by topic and difficulty</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Custom study sessions from bookmarks</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Track mastery of bookmarked items</span>
                </li>
              </ul>
            </motion.div>
            
            {/* Progress Tracking Feature */}
            <motion.div 
              className="bg-gradient-to-br from-white to-indigo-50 p-8 rounded-xl shadow-lg"
              variants={itemVariant}
            >
              <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                <GraduationCap className="h-7 w-7 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Weakness Identification</h3>
              <p className="text-gray-600 mb-4">
                Automatically identify your weak topics through quiz performance and get recommendations to improve.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Detailed performance analytics</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Topic mastery visualization</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" /> 
                  <span>Personalized improvement plans</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 px-4 bg-secondary relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <motion.h2 
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={0}
            >
              How EduAssist Helps You Learn Better
            </motion.h2>
            <motion.p 
              className="text-base text-muted-foreground max-w-2xl mx-auto mt-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              From personalized quizzes to smart notes — everything you need to master any topic, all in one place.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
            {process.map((step, index) => (
              <motion.div 
                key={index}
                className="relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
                custom={index}
              >
                <div className="flex flex-col items-center text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative shadow-md">
                    <step.icon className="h-7 w-7 text-primary" />
                    <div className="absolute -right-2 -top-2 w-7 h-7 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>

                {/* Connecting Line */}
                {index < process.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent"
                    style={{ width: 'calc(100% - 4rem)' }}
                  ></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.8), transparent 60%)"
          }}
        ></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={0}
            >
              Ready to transform your learning experience?
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mb-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              Join thousands of students who are already improving their grades with EduAssist.
            </motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={2}
            >
                <Button onClick={()=>handleNavigation('/login')} size="lg" className="relative overflow-hidden group">
                  <span className="relative z-10">Get Started Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-8 w-8 bg-primary rounded-lg flex-shrink-0 flex items-center justify-center mr-2">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-medium text-xl text-gradient">EduAssist</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EduAssist. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
