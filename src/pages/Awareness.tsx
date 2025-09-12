import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/common/GlassCard";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  BookOpen,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  Globe,
  Heart,
  Droplets,
  Shield,
  AlertTriangle,
  Star,
  RefreshCw
} from "lucide-react";
import { useTranslation } from "react-i18next";




interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export function Awareness() {

  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(
    localStorage.getItem("appLang") || "en"
  );

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);             // update state
    i18n.changeLanguage(lang);            // tell i18n to switch
    localStorage.setItem("appLang", lang); // persist across refresh
  };



  const [progress, setProgress] = useState(0); // audio progress in %

  // ✅ Add a ref to control the audio element
  const audioRef = useRef<HTMLAudioElement>(null);

  // ✅ Your Firebase public download URL
  const audioUrl =
    "https://firebasestorage.googleapis.com/v0/b/water-outbreak-app.firebasestorage.app/o/english.mp3?alt=media&token=304b5921-771b-4013-a787-d1a738989833";




  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const current = audio.currentTime;
      const total = audio.duration || 1; // avoid NaN if duration not loaded yet
      setProgress((current / total) * 100);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);


  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "How long should you wash your hands to prevent infection?",
      options: ["5 seconds", "20 seconds", "40 seconds", "1 minute"],
      correct: 1,
      explanation: "Washing hands for at least 20 seconds with soap and water effectively removes germs and prevents infection."
    },
    {
      id: 2,
      question: "What is the safe pH range for drinking water?",
      options: ["5.0-6.0", "6.5-8.5", "8.5-10.0", "10.0-12.0"],
      correct: 1,
      explanation: "Safe drinking water should have a pH between 6.5 and 8.5 according to WHO standards."
    },
    {
      id: 3,
      question: "When should you seek immediate medical attention for diarrhea?",
      options: ["After 1 day", "After 2 days", "After 3 days", "Immediately if severe"],
      correct: 3,
      explanation: "Severe diarrhea with blood, high fever, or signs of dehydration requires immediate medical attention."
    }
  ];

  const healthTips = [
    {
      icon: Heart,
      title: "Personal Hygiene",
      description: "Wash hands frequently with soap for 20 seconds",
      color: "from-accent-coral to-accent-yellow"
    },
    {
      icon: Droplets,
      title: "Water Safety",
      description: "Boil water for 1 minute before drinking if unsure of quality",
      color: "from-accent-cyan to-accent-purple"
    },
    {
      icon: Shield,
      title: "Food Safety",
      description: "Cook food thoroughly and avoid raw or undercooked items",
      color: "from-accent-emerald to-accent-cyan"
    },
    {
      icon: AlertTriangle,
      title: "Symptom Awareness",
      description: "Report fever, diarrhea, or vomiting to health workers immediately",
      color: "from-accent-yellow to-accent-coral"
    }
  ];

  const startQuiz = () => {
    const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    setCurrentQuiz(randomQuestion);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return;

    if (selectedAnswer === currentQuiz.correct) {
      setQuizScore(prev => prev + 1);
    }
    setShowResult(true);
  };


  /*const playAudio = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
  }; */

  const playAudio = () => {
    if (!audioRef.current) return; // safety check

    if (isPlaying) {
      audioRef.current.pause(); // stop audio
    } else {
      audioRef.current.play();  // start audio
    }

    setIsPlaying(!isPlaying); // toggle state
  };



  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    { code: "te", name: "Telugu", nativeName: "తెలుగు" }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold gradient-text mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>

        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-8 animate-slide-in-right">
          <GlassCard className="inline-flex items-center space-x-4" hover>
            <Globe className="w-5 h-5 text-accent-cyan" />
            <span className="text-foreground font-medium">{t("language")}:</span>

            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}   // ✅ updated
              className="bg-white dark:bg-gray-800 text-black dark:text-white border rounded px-2 py-1"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="te">తెలుగు</option>
            </select>
          </GlassCard>
        </div>


        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio Guide */}
<GlassCard className="animate-bounce-in" hover>
  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
    <Volume2 className="w-6 h-6 text-accent-purple" />
    <span>{t("audio.title")}</span>
  </h3>
  <div className="space-y-4">
    <p className="text-muted-foreground">
      {t("audio.description")}
    </p>
    <div className="flex items-center space-x-4">
      <Button
        variant={isPlaying ? "warning" : "hero"}
        size="lg"
        onClick={playAudio}
        className="flex items-center space-x-2"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        <span>{isPlaying ? t("audio.pause") : t("audio.play")}</span>
      </Button>

      <div className="text-sm text-muted-foreground">
        {t("audio.duration")}
      </div>
    </div>

    {/* hidden audio element */}
    <audio ref={audioRef} src={audioUrl} preload="auto" />

    {isPlaying && (
      <div className="w-full bg-glass-light rounded-full h-2">
        <div
          className="bg-gradient-to-r from-accent-purple to-accent-coral h-2 rounded-full transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    )}
  </div>
</GlassCard>



            {/* Health Tips */}
<GlassCard className="animate-slide-in-right" style={{ animationDelay: "0.1s" }} hover>
  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
    <BookOpen className="w-6 h-6 text-accent-emerald" />
    <span>{t("healthTips.title")}</span>
  </h3>
  <div className="grid md:grid-cols-2 gap-4">
    {healthTips.map(({ icon: Icon, title, description, color }, index) => (
      <div
        key={title}
        className={`p-4 rounded-lg bg-gradient-to-r ${color} bg-opacity-20 border border-opacity-30 hover:scale-105 transition-all duration-300 animate-fade-in`}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <div className="flex items-start space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">{t(`healthTips.items.${index}.title`)}</h4>
            <p className="text-sm text-muted-foreground">{t(`healthTips.items.${index}.description`)}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</GlassCard>


            {/* Interactive Quiz */}
<GlassCard className="animate-slide-in-right" style={{ animationDelay: "0.2s" }} hover>
  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center space-x-2">
    <Award className="w-6 h-6 text-accent-yellow" />
    <span>{t("quiz.title")}</span>
    <div className="ml-auto flex items-center space-x-2 text-sm">
      <Star className="w-4 h-4 text-accent-yellow" />
      <span>{t("quiz.score")}: {quizScore}</span>
    </div>
  </h3>

  {!currentQuiz ? (
    <div className="text-center space-y-4">
      <p className="text-muted-foreground">{t("quiz.description")}</p>
      <Button
        variant="hero"
        size="lg"
        onClick={startQuiz}
        className="flex items-center space-x-2"
      >
        <Play className="w-5 h-5" />
        <span>{t("quiz.startButton")}</span>
      </Button>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-glass-light">
        <h4 className="font-semibold text-foreground mb-3">{currentQuiz.question}</h4>
        <div className="space-y-2">
          {currentQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(index)}
              disabled={showResult}
              className={`
                w-full p-3 rounded-lg text-left transition-all duration-300 border
                ${selectedAnswer === index
                  ? showResult
                    ? index === currentQuiz.correct
                      ? 'bg-gradient-to-r from-accent-emerald to-accent-cyan text-white border-accent-emerald'
                      : 'bg-gradient-to-r from-accent-coral to-accent-yellow text-white border-accent-coral'
                    : 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white border-accent-cyan'
                  : showResult && index === currentQuiz.correct
                  ? 'bg-gradient-to-r from-accent-emerald to-accent-cyan text-white border-accent-emerald'
                  : 'bg-glass-light text-muted-foreground border-border hover:bg-glass-medium hover:text-foreground'
                }
              `}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className="p-4 rounded-lg bg-gradient-to-r from-accent-emerald/20 to-accent-cyan/20 border border-accent-emerald/30 animate-bounce-in">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-accent-emerald" />
            <span className="font-semibold text-foreground">
              {selectedAnswer === currentQuiz.correct ? t("quiz.correct") : t("quiz.incorrect")}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{currentQuiz.explanation}</p>
        </div>
      )}

      <div className="flex space-x-2">
        {!showResult ? (
          <Button
            variant="hero"
            onClick={submitAnswer}
            disabled={selectedAnswer === null}
            className="flex-1"
          >
            {t("quiz.submitAnswer")}
          </Button>
        ) : (
          <Button
            variant="hero"
            onClick={startQuiz}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t("quiz.nextQuestion")}</span>
          </Button>
        )}
        <Button
          variant="glass"
          onClick={() => setCurrentQuiz(null)}
        >
          {t("quiz.exit")}
        </Button>
      </div>
    </div>
  )}
</GlassCard>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
<GlassCard className="animate-fade-in" hover>
  <h3 className="text-lg font-bold text-foreground mb-4">{t("learningProgress.title")}</h3>
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <span className="text-muted-foreground">{t("learningProgress.quizScore")}</span>
      <span className="text-foreground font-bold">{quizScore}/10</span>
    </div>
    <div className="w-full bg-glass-light rounded-full h-2">
      <div
        className="bg-gradient-to-r from-accent-emerald to-accent-cyan h-2 rounded-full transition-all duration-500"
        style={{ width: `${(quizScore / 10) * 100}%` }}
      ></div>
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="text-center p-2 rounded bg-glass-light">
        <div className="text-accent-cyan font-bold">4</div>
        <div className="text-muted-foreground">{t("learningProgress.modules")}</div>
      </div>
      <div className="text-center p-2 rounded bg-glass-light">
        <div className="text-accent-emerald font-bold">85%</div>
        <div className="text-muted-foreground">{t("learningProgress.completion")}</div>
      </div>
    </div>
  </div>
</GlassCard>


            {/* Learning Modules */}
<GlassCard hover>
  <h3 className="text-lg font-bold text-foreground mb-4">{t("learningModules.title")}</h3>
  <div className="space-y-3">
    {[
      { title: t("learningModules.waterSafety"), progress: 100, icon: Droplets, color: "text-accent-cyan" },
      { title: t("learningModules.diseasePrevention"), progress: 75, icon: Shield, color: "text-accent-emerald" },
      { title: t("learningModules.emergencyResponse"), progress: 50, icon: AlertTriangle, color: "text-accent-coral" },
      { title: t("learningModules.communityHealth"), progress: 25, icon: Users, color: "text-accent-purple" }
    ].map(({ title, progress, icon: Icon, color }) => (
      <div key={title} className="p-3 rounded-lg bg-glass-light hover:bg-glass-medium transition-all duration-300 cursor-pointer">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-medium text-foreground">{title}</span>
          </div>
          <span className="text-xs text-muted-foreground">{progress}%</span>
        </div>
        <div className="w-full bg-background rounded-full h-1">
          <div
            className={`h-1 rounded-full bg-gradient-to-r ${
              progress === 100
                ? "from-accent-emerald to-accent-cyan"
                : progress >= 75
                ? "from-accent-cyan to-accent-purple"
                : progress >= 50
                ? "from-accent-yellow to-accent-coral"
                : "from-accent-coral to-accent-yellow"
            }`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    ))}
  </div>
</GlassCard>


            {/* Resources */}
<GlassCard hover>
  <h3 className="text-lg font-bold text-foreground mb-4">{t("resources.title")}</h3>
  <div className="space-y-2">
    <Button variant="glass" className="w-full justify-start">
      <BookOpen className="w-4 h-4 mr-2" />
      {t("resources.healthGuidelines")}
    </Button>
    <Button variant="glass" className="w-full justify-start">
      <Volume2 className="w-4 h-4 mr-2" />
      {t("resources.audioLibrary")}
    </Button>
    <Button variant="glass" className="w-full justify-start">
      <Users className="w-4 h-4 mr-2" />
      {t("resources.communityForum")}
    </Button>
    <Button variant="glass" className="w-full justify-start">
      <Award className="w-4 h-4 mr-2" />
      {t("resources.certificates")}
    </Button>
  </div>
</GlassCard>


            {/* Quick Actions */}
<GlassCard hover>
  <h3 className="text-lg font-bold text-foreground mb-4">{t("quickActions.title")}</h3>
  <div className="space-y-2">
    <Button variant="hero" className="w-full justify-start">
      <Play className="w-4 h-4 mr-2" />
      {t("quickActions.startLearning")}
    </Button>
    <Button variant="success" className="w-full justify-start">
      <Award className="w-4 h-4 mr-2" />
      {t("quickActions.takeAssessment")}
    </Button>
    <Button variant="glass" className="w-full justify-start">
      <ArrowRight className="w-4 h-4 mr-2" />
      {t("quickActions.viewCertificates")}
    </Button>
  </div>
</GlassCard>

          </div>
        </div>
      </div>
    </div>
  );
}