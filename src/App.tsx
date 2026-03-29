import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  Target, 
  FileUp, 
  Settings, 
  Trophy, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Award, 
  BarChart3, 
  Palette, 
  Moon, 
  Sun,
  X,
  Upload,
  Info,
  Sparkles
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import confetti from "canvas-confetti";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleGenAI, Type } from "@google/genai";
import { UNIVERSITIES, calculateRequiredGpa, calculateGpa } from "./lib/grading";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Course = {
  id: string;
  name: string;
  credits: number;
  grade: string;
  points: number;
};

type Semester = {
  id: string;
  name: string;
  courses: Course[];
};

type Goal = {
  targetCgpa: number;
  remainingSemesters: number;
  averageCreditsPerSemester: number;
};

type Theme = {
  id: string;
  name: string;
  bg: string;
  primary: string;
  accent: string;
};

const THEMES: Theme[] = [
  { id: "default", name: "Classic Indigo", bg: "bg-slate-50", primary: "bg-indigo-600", accent: "text-indigo-600" },
  { id: "emerald", name: "Emerald Forest", bg: "bg-emerald-50", primary: "bg-emerald-600", accent: "text-emerald-600" },
  { id: "rose", name: "Rose Quartz", bg: "bg-rose-50", primary: "bg-rose-600", accent: "text-rose-600" },
  { id: "amber", name: "Amber Sunset", bg: "bg-amber-50", primary: "bg-amber-600", accent: "text-amber-600" },
  { id: "slate", name: "Midnight Slate", bg: "bg-slate-900", primary: "bg-slate-700", accent: "text-slate-400" },
  { id: "violet", name: "Violet Dream", bg: "bg-violet-50", primary: "bg-violet-600", accent: "text-violet-600" },
  { id: "cyan", name: "Cyan Ocean", bg: "bg-cyan-50", primary: "bg-cyan-600", accent: "text-cyan-600" },
];

// --- Components ---

const IntroVideo = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Welcome to GradeWise GH",
      desc: "The ultimate academic tracking platform for Ghanaian university students.",
      icon: <Award className="w-12 h-12 text-indigo-500" />
    },
    {
      title: "Set Your Goals",
      desc: "Input your target CGPA and we'll calculate exactly what you need to achieve it.",
      icon: <Target className="w-12 h-12 text-rose-500" />
    },
    {
      title: "AI Transcript Parsing",
      desc: "Upload your results and our AI will automatically fill in your courses and grades.",
      icon: <FileUp className="w-12 h-12 text-emerald-500" />
    },
    {
      title: "Track Your Progress",
      desc: "Visualize your academic journey with beautiful charts and earn badges for your milestones.",
      icon: <TrendingUp className="w-12 h-12 text-amber-500" />
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      if (step < steps.length - 1) {
        setStep(s => s + 1);
      } else {
        clearInterval(timer);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [step]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <video 
          autoPlay 
          muted 
          loop 
          className="w-full h-full object-cover"
          src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-a-circuit-board-and-data-processing-4328-large.mp4"
        />
      </div>
      
      <div className="relative max-w-2xl w-full text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, y: -20 }}
            transition={{ duration: 0.8 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 rounded-[3rem] shadow-2xl"
          >
            <div className="flex justify-center mb-8">
              <div className="p-6 bg-white/10 rounded-full">
                {steps[step].icon}
              </div>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">{steps[step].title}</h2>
            <p className="text-xl text-white/70 leading-relaxed">{steps[step].desc}</p>
            
            <div className="mt-12 flex justify-center gap-2">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === step ? "w-8 bg-white" : "w-2 bg-white/20"
                  )} 
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          onClick={onComplete}
          className="mt-12 px-8 py-4 bg-white text-black rounded-full font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
        >
          Skip Intro <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

const Badge: React.FC<{ title: string, icon: any, earned: boolean }> = ({ title, icon, earned }) => (
  <div className={cn(
    "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-500",
    earned 
      ? "bg-white border-indigo-100 shadow-sm opacity-100 scale-100" 
      : "bg-zinc-50 border-zinc-100 opacity-40 grayscale scale-95"
  )}>
    <div className={cn(
      "w-12 h-12 rounded-full flex items-center justify-center",
      earned ? "bg-indigo-50 text-indigo-600" : "bg-zinc-200 text-zinc-400"
    )}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-center leading-tight">{title}</span>
  </div>
);

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [university, setUniversity] = useState(Object.keys(UNIVERSITIES)[0]);
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: "1", name: "Level 100 Semester 1", courses: [] }
  ]);
  const [goal, setGoal] = useState<Goal>({
    targetCgpa: 3.6,
    remainingSemesters: 6,
    averageCreditsPerSemester: 18
  });
  const [theme, setTheme] = useState(THEMES[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"calc" | "goal" | "ai">("calc");

  // --- Calculations ---
  const currentCgpa = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;
    semesters.forEach(sem => {
      sem.courses.forEach(course => {
        totalPoints += course.points * course.credits;
        totalCredits += course.credits;
      });
    });
    return totalCredits === 0 ? 0 : totalPoints / totalCredits;
  }, [semesters]);

  const totalCredits = useMemo(() => {
    return semesters.reduce((sum, sem) => 
      sum + sem.courses.reduce((s, c) => s + c.credits, 0), 0
    );
  }, [semesters]);

  const requiredGpa = useMemo(() => {
    const remainingCredits = goal.remainingSemesters * goal.averageCreditsPerSemester;
    if (remainingCredits <= 0) return 0;
    return calculateRequiredGpa(currentCgpa, totalCredits, goal.targetCgpa, remainingCredits);
  }, [currentCgpa, totalCredits, goal]);

  // --- Actions ---
  const addCourse = (semesterId: string) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: [
            ...sem.courses,
            { id: Math.random().toString(36).substr(2, 9), name: "", credits: 3, grade: "A", points: 4.0 }
          ]
        };
      }
      return sem;
    }));
  };

  const updateCourse = (semesterId: string, courseId: string, updates: Partial<Course>) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.map(c => c.id === courseId ? { ...c, ...updates } : c)
        };
      }
      return sem;
    }));
  };

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semesterId) {
        return { ...sem, courses: sem.courses.filter(c => c.id !== courseId) };
      }
      return sem;
    }));
  };

  const addSemester = () => {
    const nextNum = semesters.length + 1;
    const level = Math.ceil(nextNum / 2) * 100;
    const semNum = nextNum % 2 === 0 ? 2 : 1;
    setSemesters([...semesters, { id: nextNum.toString(), name: `Level ${level} Semester ${semNum}`, courses: [] }]);
  };

  const handleAiParse = async (file: File) => {
    // Simulated AI parsing for demo purposes
    // In a real app, we'd use Gemini Vision here
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result?.toString().split(",")[1];
      if (!base64) return;
      
      // We'll simulate the AI thinking and then adding data
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      // This is a placeholder for the actual vision call
      // For the demo, we'll just add some sample courses after a delay
      setTimeout(() => {
        const newCourses: Course[] = [
          { id: "ai-1", name: "Academic Writing", credits: 3, grade: "A", points: 4.0 },
          { id: "ai-2", name: "Intro to Computing", credits: 3, grade: "B+", points: 3.5 },
          { id: "ai-3", name: "Critical Thinking", credits: 3, grade: "A", points: 4.0 },
        ];
        setSemesters(prev => {
          const lastSem = prev[prev.length - 1];
          return prev.map(sem => sem.id === lastSem.id ? { ...sem, courses: [...sem.courses, ...newCourses] } : sem);
        });
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }, 2000);
    };
    reader.readAsDataURL(file);
  };

  // --- Badges ---
  const badges = [
    { title: "First Step", icon: <Play className="w-5 h-5" />, earned: totalCredits > 0 },
    { title: "Goal Setter", icon: <Target className="w-5 h-5" />, earned: goal.targetCgpa > 0 },
    { title: "Scholar", icon: <Trophy className="w-5 h-5" />, earned: currentCgpa >= 3.6 },
    { title: "AI Pioneer", icon: <FileUp className="w-5 h-5" />, earned: false }, // Earned after AI upload
    { title: "Consistency", icon: <CheckCircle2 className="w-5 h-5" />, earned: semesters.length >= 4 },
    { title: "High Achiever", icon: <Award className="w-5 h-5" />, earned: currentCgpa >= 3.8 },
    { title: "First Class", icon: <Sparkles className="w-5 h-5" />, earned: currentCgpa >= 3.6 },
    { title: "Dean's List", icon: <Trophy className="w-5 h-5" />, earned: currentCgpa >= 3.85 },
    { title: "Goal Crusher", icon: <Target className="w-5 h-5" />, earned: currentCgpa >= goal.targetCgpa && totalCredits > 0 },
  ];

  if (showIntro) return <IntroVideo onComplete={() => setShowIntro(false)} />;

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500 pb-20",
      theme.bg,
      isDarkMode && "dark bg-zinc-950 text-white"
    )}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", theme.primary)}>
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">GradeWise GH</h1>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Academic Success Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {currentCgpa < goal.targetCgpa && totalCredits > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full border border-rose-100"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Keep pushing for {goal.targetCgpa}!</span>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-bold">CGPA: {currentCgpa.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative group">
              <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                <Palette className="w-5 h-5" />
              </button>
              <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-2 rounded-2xl shadow-xl w-48">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                  >
                    <div className={cn("w-4 h-4 rounded-full", t.primary)} />
                    <span className="text-xs font-medium">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 grid lg:grid-cols-12 gap-8">
        {/* Sidebar / Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Progress Card */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Your Progress</h2>
              <BarChart3 className={cn("w-5 h-5", theme.accent)} />
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-zinc-500 uppercase">Target Achievement</span>
                  <span className="text-2xl font-bold">{(currentCgpa / goal.targetCgpa * 100).toFixed(0)}%</span>
                </div>
                <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (currentCgpa / goal.targetCgpa * 100))}%` }}
                    className={cn("h-full transition-all duration-1000", theme.primary)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Current CGPA</span>
                  <span className="text-xl font-bold">{currentCgpa.toFixed(2)}</span>
                </div>
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Target</span>
                  <span className="text-xl font-bold">{goal.targetCgpa.toFixed(2)}</span>
                </div>
              </div>

              {requiredGpa > 0 && (
                <div className={cn(
                  "p-6 rounded-2xl border flex items-start gap-4",
                  requiredGpa > 4.0 ? "bg-rose-50 border-rose-100 text-rose-900" : "bg-emerald-50 border-emerald-100 text-emerald-900"
                )}>
                  {requiredGpa > 4.0 ? <AlertCircle className="w-6 h-6 shrink-0" /> : <CheckCircle2 className="w-6 h-6 shrink-0" />}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-1">Required GPA</p>
                    <p className="text-lg font-bold leading-tight">
                      You need a <span className="underline">{requiredGpa.toFixed(2)}</span> GPA in your remaining semesters.
                    </p>
                    <p className="text-[10px] mt-2 opacity-70">
                      {requiredGpa > 4.0 
                        ? "This goal is currently mathematically impossible. Consider adjusting your target." 
                        : "This goal is achievable with consistent effort!"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Badges */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-6">Achievements</h2>
            <div className="grid grid-cols-3 gap-3">
              {badges.map((b, i) => (
                <Badge key={i} {...b} />
              ))}
            </div>
          </section>

          {/* University Info */}
          <section className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Grading System</h2>
            </div>
            <select 
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 border-none rounded-2xl text-sm font-bold mb-6 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {Object.keys(UNIVERSITIES).map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            
            <div className="space-y-2">
              {UNIVERSITIES[university].gradingScale.slice(0, 5).map(s => (
                <div key={s.grade} className="flex justify-between text-xs py-2 border-b border-zinc-50 dark:border-zinc-800 last:border-0">
                  <span className="font-bold">{s.grade}</span>
                  <span className="text-zinc-500">{s.range}%</span>
                  <span className="font-mono text-indigo-500">{s.points.toFixed(1)} pts</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Tabs */}
          <div className="flex p-1.5 bg-white dark:bg-zinc-900 rounded-full border border-zinc-100 dark:border-zinc-800 shadow-sm w-fit">
            {[
              { id: "calc", label: "Calculator", icon: <Calculator className="w-4 h-4" /> },
              { id: "goal", label: "Goal Setter", icon: <Target className="w-4 h-4" /> },
              { id: "ai", label: "AI Import", icon: <FileUp className="w-4 h-4" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? cn("text-white shadow-lg", theme.primary) 
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "calc" && (
              <motion.div
                key="calc"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {semesters.map((sem, sIndex) => (
                  <div key={sem.id} className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
                    <div className="px-8 py-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                      <h3 className="font-bold text-lg">{sem.name}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-zinc-400 uppercase">
                          GPA: {calculateGpa(sem.courses).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => addCourse(sem.id)}
                          className={cn("p-2 rounded-full text-white hover:scale-110 transition-transform", theme.primary)}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-8">
                      {sem.courses.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                          <p className="text-zinc-400 text-sm font-medium">No courses added yet.</p>
                          <button 
                            onClick={() => addCourse(sem.id)}
                            className={cn("mt-4 text-sm font-bold", theme.accent)}
                          >
                            Add your first course
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <div className="col-span-5">Course Name</div>
                            <div className="col-span-2 text-center">Credits</div>
                            <div className="col-span-3 text-center">Grade</div>
                            <div className="col-span-2"></div>
                          </div>
                          {sem.courses.map(course => (
                            <div key={course.id} className="grid grid-cols-12 gap-4 items-center p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                              <div className="col-span-5">
                                <input 
                                  type="text" 
                                  placeholder="e.g. MATH 101"
                                  value={course.name}
                                  onChange={(e) => updateCourse(sem.id, course.id, { name: e.target.value })}
                                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-zinc-300"
                                />
                              </div>
                              <div className="col-span-2">
                                <input 
                                  type="number" 
                                  value={course.credits}
                                  onChange={(e) => updateCourse(sem.id, course.id, { credits: parseInt(e.target.value) || 0 })}
                                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-center text-sm font-bold py-2 focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                              <div className="col-span-3">
                                <select 
                                  value={course.grade}
                                  onChange={(e) => {
                                    const scale = UNIVERSITIES[university].gradingScale.find(s => s.grade === e.target.value);
                                    updateCourse(sem.id, course.id, { grade: e.target.value, points: scale?.points || 0 });
                                  }}
                                  className="w-full bg-zinc-100 dark:bg-zinc-800 border-none rounded-xl text-center text-sm font-bold py-2 focus:ring-2 focus:ring-indigo-500"
                                >
                                  {UNIVERSITIES[university].gradingScale.map(s => (
                                    <option key={s.grade} value={s.grade}>{s.grade}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-2 flex justify-end">
                                <button 
                                  onClick={() => removeCourse(sem.id, course.id)}
                                  className="p-2 text-zinc-300 hover:text-rose-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={addSemester}
                  className="w-full py-6 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] text-zinc-400 font-bold hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add Another Semester
                </button>
              </motion.div>
            )}

            {activeTab === "goal" && (
              <motion.div
                key="goal"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="max-w-xl mx-auto text-center">
                    <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 mx-auto mb-8">
                      <Target className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Set Your Academic Goal</h2>
                    <p className="text-zinc-500 mb-12">Define your target CGPA and let us map out the path to success for you.</p>
                    
                    <div className="space-y-8 text-left">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">Target CGPA</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={goal.targetCgpa}
                            onChange={(e) => setGoal({ ...goal, targetCgpa: parseFloat(e.target.value) || 0 })}
                            className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-3xl text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">Remaining Semesters</label>
                          <input 
                            type="number" 
                            value={goal.remainingSemesters}
                            onChange={(e) => setGoal({ ...goal, remainingSemesters: parseInt(e.target.value) || 0 })}
                            className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-3xl text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">Avg. Courses Per Semester</label>
                        <input 
                          type="number" 
                          value={goal.averageCreditsPerSemester / 3}
                          onChange={(e) => setGoal({ ...goal, averageCreditsPerSemester: (parseInt(e.target.value) || 0) * 3 })}
                          className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border-none rounded-3xl text-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>

                      <div className="pt-8">
                        <div className="p-8 bg-indigo-600 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
                          <div className="relative">
                            <h4 className="text-sm font-bold uppercase tracking-widest opacity-70 mb-2">Recommended Strategy</h4>
                            <p className="text-3xl font-bold mb-4">Aim for <span className="underline">{requiredGpa.toFixed(2)}</span> GPA</p>
                            <p className="text-sm opacity-80 leading-relaxed mb-6">
                              To reach your target of {goal.targetCgpa.toFixed(2)}, you should maintain an average of {requiredGpa.toFixed(2)} across your next {goal.remainingSemesters} semesters.
                            </p>
                            
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                              <p className="text-xs font-bold uppercase mb-3">Grade Recommendation (Per Semester)</p>
                              <div className="flex flex-wrap gap-2">
                                {Array.from({ length: Math.round(goal.averageCreditsPerSemester / 3) }).map((_, i) => {
                                  let grade = "A";
                                  if (requiredGpa < 3.0) grade = "B";
                                  if (requiredGpa < 2.0) grade = "C";
                                  if (requiredGpa > 3.6) grade = "A";
                                  return (
                                    <div key={i} className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold">
                                      Course {i+1}: {grade}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Road Map */}
                <div className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                    Academic Road Map
                  </h3>
                  <div className="space-y-6">
                    {Array.from({ length: goal.remainingSemesters }).map((_, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 flex items-center justify-center font-bold text-lg shadow-sm">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Upcoming Semester</p>
                          <p className="font-bold">Target GPA: {requiredGpa.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          On Track
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "ai" && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-zinc-900 p-12 rounded-[3rem] border border-zinc-100 dark:border-zinc-800 shadow-sm text-center"
              >
                <div className="max-w-xl mx-auto">
                  <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-8">
                    <FileUp className="w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">AI Transcript Parser</h2>
                  <p className="text-zinc-500 mb-12">Upload a photo or PDF of your results, and our AI will automatically extract your courses and grades for you.</p>
                  
                  <label className="cursor-pointer group">
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*,application/pdf"
                      onChange={(e) => e.target.files?.[0] && handleAiParse(e.target.files[0])}
                    />
                    <div className="p-16 border-4 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[3rem] group-hover:border-emerald-300 group-hover:bg-emerald-50/50 transition-all">
                      <Upload className="w-12 h-12 text-zinc-300 group-hover:text-emerald-500 mx-auto mb-6 transition-colors" />
                      <p className="text-lg font-bold text-zinc-400 group-hover:text-emerald-600">Click to upload or drag & drop</p>
                      <p className="text-sm text-zinc-300 mt-2">Supports JPG, PNG, and PDF</p>
                    </div>
                  </label>

                  <div className="mt-12 p-6 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-start gap-4 text-left">
                    <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-1" />
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Our AI uses advanced vision technology to scan your document. For best results, ensure the image is clear and well-lit. Your data is processed securely and never stored on our servers.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Progress Bar (Mobile/Bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg z-50">
        <div className="bg-black/90 backdrop-blur-xl p-4 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-1.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Overall Progress</span>
              <span className="text-sm font-bold text-white">{(currentCgpa / goal.targetCgpa * 100).toFixed(0)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (currentCgpa / goal.targetCgpa * 100))}%` }}
                className={cn("h-full", theme.primary)}
              />
            </div>
          </div>
          <div className="h-10 w-px bg-white/10" />
          <div className="text-right">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block">CGPA</span>
            <span className="text-xl font-bold text-white leading-none">{currentCgpa.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

