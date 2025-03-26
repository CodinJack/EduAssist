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
  Clock 
} from "lucide-react";

export default function Landing() {
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
  
  const stats = [
    {
      value: "500K+",
      label: "Students"
    },
    {
      value: "10M+",
      label: "Quizzes Taken"
    },
    {
      value: "95%",
      label: "Improved Grades"
    },
    {
      value: "1000+",
      label: "Topics"
    }
  ];

  const process = [
    {
      title: "Identify Needs",
      description: "We analyze your knowledge gaps and learning style",
      icon: Brain
    },
    {
      title: "Create Quizzes",
      description: "AI generates personalized quizzes for optimal learning",
      icon: Sparkles
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics",
      icon: BarChart
    },
    {
      title: "Continuous Learning",
      description: "Adapt and improve based on your performance",
      icon: Clock
    }
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

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <AuroraBackground className="min-h-screen flex flex-col items-center justify-center relative">
        
        <div className="absolute top-5 left-5 z-50 flex items-center">
          <div className="h-8 w-8 bg-primary rounded-lg flex-shrink-0 flex items-center justify-center mr-2">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="font-medium text-xl text-gradient">EduAssist</span>
        </div>
        
        <div className="absolute top-5 right-20 z-50">
          <Link href="/login">
            <Button variant="ghost">Login</Button>
          </Link>
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
              <Link href="/login">
                <Button size="lg" className="relative overflow-hidden group">
                  <span className="relative z-10">Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </Link>
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
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={0}
            >
              How EduAssist Works
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              Our platform uses advanced technology to create a personalized learning experience tailored to your needs.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow glass-morphism"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
                custom={index + 2}
              >
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-secondary">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                className="relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUpVariants}
                custom={index}
              >
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={0}
            >
              Our Learning Process
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              custom={1}
            >
              EduAssist adapts to your learning style and helps you focus on areas where you need improvement
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 relative">
                    <step.icon className="h-8 w-8 text-primary" />
                    <div className="absolute -right-1 -top-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" style={{ width: 'calc(100% - 4rem)' }}></div>
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
              <Link href="/login">
                <Button size="lg" className="relative overflow-hidden group">
                  <span className="relative z-10">Get Started Now</span>
                  <ArrowRight className="ml-2 h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
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
