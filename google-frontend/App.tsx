/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { GeneratedImage, ComplexityLevel, VisualStyle, Language, SearchResultItem } from './types';
import { 
  researchTopicForPrompt, 
  generateInfographicImage, 
  editInfographicImage,
} from './services/geminiService';
import { getSimulatedResult } from './services/simulatedAssets';
import Infographic from './components/Infographic';
import Loading from './components/Loading';
import IntroScreen from './components/IntroScreen';
import SearchResults from './components/SearchResults';
import { BookCompanion } from './components/BookCompanion';
import { 
  Search, 
  AlertCircle, 
  History, 
  GraduationCap, 
  Palette, 
  Microscope, 
  Atom, 
  Compass, 
  Globe, 
  Sun, 
  Moon, 
  ExternalLink, 
  Terminal, 
  Copy, 
  Check, 
  Layers, 
  Flame, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [topic, setTopic] = useState('');
  const [complexityLevel, setComplexityLevel] = useState<ComplexityLevel>('High School');
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('Default');
  const [language, setLanguage] = useState<Language>('English');
  
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [loadingFacts, setLoadingFacts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [imageHistory, setImageHistory] = useState<GeneratedImage[]>([]);
  const [currentSearchResults, setCurrentSearchResults] = useState<SearchResultItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [engineMode, setEngineMode] = useState<'live' | 'simulated'>('simulated');
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Pre-configured Navigational Exploration Charts
  const atlasCharts = [
    {
      title: "Quantum Superposition",
      prompt: "How quantum particles exist in multiple states simultaneously",
      level: "College" as ComplexityLevel,
      style: "Futuristic" as VisualStyle,
      language: "English" as Language,
      icon: Atom,
      color: "from-cyan-500 to-indigo-500",
      description: "Visualizes state wavefunctions and probabilistic matrices as glowing neon cyber HUD blueprints."
    },
    {
      title: "Citric Acid ATP Cycle",
      prompt: "The molecular respiration cycle and ATP energy generation inside mitochondrial machines",
      level: "High School" as ComplexityLevel,
      style: "Cartoon" as VisualStyle,
      language: "English" as Language,
      icon: Microscope,
      color: "from-amber-500 to-orange-500",
      description: "Maps cellular energy production using vibrant, highly readable educational comic vector graphics."
    },
    {
      title: "Lithospheric Subduction",
      prompt: "Tectonic lithosphere plates squeezing magma and colliding to form oceanic mountain chains",
      level: "Expert" as ComplexityLevel,
      style: "Sketch" as VisualStyle,
      icon: Compass,
      language: "English" as Language,
      color: "from-emerald-500 to-teal-500",
      description: "Drafts geological cross-sections as rough dry-point ink technical blueprints on aged parchment."
    },
    {
      title: "Alexandria Library Scrolls",
      prompt: "The architectural cataloging systems and papyrus scrolls of the ancient Library of Alexandria",
      level: "Elementary" as ComplexityLevel,
      style: "Vintage" as VisualStyle,
      icon: Globe,
      language: "English" as Language,
      color: "from-pink-500 to-rose-500",
      description: "Illustrates ancient knowledge architecture as a gorgeous 19th-century scientific lithograph engraving."
    }
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLaunchChart = (chart: typeof atlasCharts[0]) => {
    if (isLoading) return;
    setTopic(chart.prompt);
    setComplexityLevel(chart.level);
    setVisualStyle(chart.style);
    setLanguage(chart.language);
    
    // Auto-scroll to search input and pulse
    const scrollTarget = document.getElementById('search-input-form');
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCopyText = (txt: string, id: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!topic.trim()) {
        setError("Please enter a topic to explore.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep(1);
    setLoadingFacts([]);
    setCurrentSearchResults([]);
    setLoadingMessage(`Scanning Web Secrets & Grounding Fact Bases...`);

    try {
      if (engineMode === 'simulated') {
        // Run Simulated Mode locally and perform visual steps
        await new Promise(resolve => setTimeout(resolve, 800));
        const simResult = getSimulatedResult(topic, complexityLevel, visualStyle, language);
        setLoadingFacts(simResult.facts);
        setCurrentSearchResults(simResult.searchResults);
        
        setLoadingStep(2);
        setLoadingMessage(`Drawing vector diagram nodes...`);
        await new Promise(resolve => setTimeout(resolve, 600));

        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          data: simResult.svgContent,
          prompt: topic,
          timestamp: Date.now(),
          level: complexityLevel,
          style: visualStyle,
          language: language,
          promptAnalysis: simResult.promptAnalysis
        };
        setImageHistory([newImage, ...imageHistory]);
      } else {
        // Step 1: Research, Search Ground, and Perform structured Prompt Analysis on Server
        const researchResult = await researchTopicForPrompt(topic, complexityLevel, visualStyle, language);
        
        setLoadingFacts(researchResult.facts);
        setCurrentSearchResults(researchResult.searchResults);
        
        setLoadingStep(2);
        setLoadingMessage(`Materializing Imagery From Configured prompt...`);
        
        // Step 2: Call Image Generation endpoint securely
        const base64Data = await generateInfographicImage(researchResult.imagePrompt);
        
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          data: base64Data,
          prompt: topic,
          timestamp: Date.now(),
          level: complexityLevel,
          style: visualStyle,
          language: language,
          promptAnalysis: researchResult.promptAnalysis
        };

        setImageHistory([newImage, ...imageHistory]);
      }
    } catch (err: any) {
      console.error(err);
      if (err.isQuotaLimit || err.message?.includes("quota") || err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
        setQuotaExceeded(true);
        setError("API Quota Exhausted: Server cannot reach the Gemini API model. We have automatically activated the high-fidelity Simulated Engine for you!");
        setEngineMode('simulated');
        
        // Load the simulated result immediately so user has zero downtime
        const simResult = getSimulatedResult(topic, complexityLevel, visualStyle, language);
        setLoadingFacts(simResult.facts);
        setCurrentSearchResults(simResult.searchResults);
        const autoImage: GeneratedImage = {
          id: Date.now().toString(),
          data: simResult.svgContent,
          prompt: topic,
          timestamp: Date.now(),
          level: complexityLevel,
          style: visualStyle,
          language: language,
          promptAnalysis: simResult.promptAnalysis
        };
        setImageHistory([autoImage, ...imageHistory]);
      } else {
        setError(err.message || 'The Prompt Atlas materialized state was disrupted. Please check your network and retry.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const handleEdit = async (editPrompt: string) => {
    if (imageHistory.length === 0) return;
    const currentImage = imageHistory[0];
    setIsLoading(true);
    setError(null);
    setLoadingStep(2);
    setLoadingMessage(`Modifying Materialized Vector: "${editPrompt}"...`);

    try {
      if (engineMode === 'simulated') {
        await new Promise(resolve => setTimeout(resolve, 900));
        const combinedTopic = `${currentImage.prompt} (${editPrompt})`;
        const simResult = getSimulatedResult(combinedTopic, currentImage.level || complexityLevel, currentImage.style || visualStyle, currentImage.language || language);
        
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          data: simResult.svgContent,
          prompt: editPrompt,
          timestamp: Date.now(),
          level: currentImage.level,
          style: currentImage.style,
          language: currentImage.language,
          promptAnalysis: {
            ...simResult.promptAnalysis,
            optimizedPrompt: `${simResult.promptAnalysis.optimizedPrompt}\n--adjusted "${editPrompt}"`
          }
        };
        setImageHistory([newImage, ...imageHistory]);
      } else {
        const base64Data = await editInfographicImage(currentImage.data, editPrompt);
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          data: base64Data,
          prompt: editPrompt,
          timestamp: Date.now(),
          level: currentImage.level,
          style: currentImage.style,
          language: currentImage.language,
          promptAnalysis: currentImage.promptAnalysis
        };
        setImageHistory([newImage, ...imageHistory]);
      }
    } catch (err: any) {
      console.error(err);
      if (err.isQuotaLimit || err.message?.includes("quota") || err.message?.includes("429") || err.message?.includes("RESOURCE_EXHAUSTED")) {
        setQuotaExceeded(true);
        setError("API Quota Exhausted during edit. Switch to Simulated Map engine to prototype designs locally.");
      } else {
        setError(err.message || 'Image transformation encountered an error. Try a different refine instruction.');
      }
    } finally {
      setIsLoading(false);
      setLoadingStep(0);
    }
  };

  const restoreImage = (img: GeneratedImage) => {
     const newHistory = imageHistory.filter(i => i.id !== img.id);
     setImageHistory([img, ...newHistory]);
     if (img.promptAnalysis) {
       // Restore search results if available
       setCurrentSearchResults([]);
     }
  };

  return (
    <>
    {showIntro ? (
      <IntroScreen onComplete={() => setShowIntro(false)} />
    ) : (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-cyan-505 selection:text-white pb-10 relative overflow-x-hidden animate-in fade-in duration-1000 transition-colors">
      
      {/* Space Backdrop / Grids */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-1 dark:from-slate-900/60 via-slate-50 dark:via-slate-950 to-white dark:to-black z-0 transition-colors"></div>
      <div className="fixed inset-0 opacity-[0.03] dark:opacity-10 z-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
      }}></div>

      {/* Cybernetic Header */}
      <header className="border-b border-slate-200 dark:border-white/5 sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-950/70 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 group">
            <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur opacity-20 dark:opacity-40 group-hover:opacity-60 transition-opacity"></div>
                <div className="bg-slate-100 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-white/10 relative z-10 shadow-sm">
                   <Compass className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col">
                <span className="font-display font-bold text-lg md:text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                  THE PROMPT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-orange-400">ATLAS</span>
                </span>
                <span className="text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">Navigational Exploration Agent</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
              {/* Engine Selector Toggle */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 rounded-xl p-0.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => {
                    setEngineMode('live');
                    setError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide transition-all ${engineMode === 'live' ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  title="Connect directly to server-side Google Gemini models"
                >
                  Live Gemini
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEngineMode('simulated');
                    setError(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide transition-all ${engineMode === 'simulated' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                  title="Run offline visual simulation with zero quota limits"
                >
                  Simulation
                </button>
              </div>

              <span className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-mono border border-slate-200 dark:border-white/5 uppercase tracking-wider">
                <Terminal className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
                {engineMode === 'live' ? 'Cloud Link' : 'Local Micro-Engine'}
              </span>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-cyan-650 dark:hover:text-cyan-300 transition-all border border-slate-200 dark:border-white/5 shadow-sm hover:scale-105"
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 py-6 md:py-10 relative z-10">
        
        <div id="search-input-form" className={`max-w-6xl mx-auto transition-all duration-500 ${imageHistory.length > 0 ? 'mb-6 md:mb-10' : 'min-h-[40vh] flex flex-col justify-center'}`}>
          
          {/* Welcome Branding */}
          {!imageHistory.length && (
            <div className="text-center mb-8 md:mb-12 space-y-4 md:space-y-6 animate-in slide-in-from-bottom-6 duration-700 fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[9px] md:text-10px font-extrabold tracking-widest uppercase shadow-sm">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-bounce" /> Explore the architecture of thought & machine vision synthesis
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light text-slate-950 dark:text-white tracking-tight leading-[0.95]">
                Mapping the <br/>
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-orange-400">Recursive Century</span>
              </h1>
              
              <p className="text-xs md:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                Connect your logical queries with real-time Google search grounding and view the prompt architecture used to generate high-fidelity learning diagrams.
              </p>
            </div>
          )}

          {/* Core Input Form with Glow */}
          <form onSubmit={handleGenerate} className={`relative z-20 transition-all duration-300 ${isLoading ? 'opacity-50 pointer-events-none scale-95 blur-sm' : 'scale-100'}`}>
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-orange-500 rounded-3xl opacity-10 dark:opacity-20 group-hover:opacity-30 transition duration-500 blur-xl"></div>
                
                <div className="relative bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/5 p-3 rounded-2xl shadow-2xl">
                    
                    {/* TextInput */}
                    <div className="relative flex items-center">
                        <Search className="absolute left-4 md:left-6 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Draft a query (e.g., How black holes distort spacetime, Photosynthesis cycle)..."
                            className="w-full pl-12 md:pl-16 pr-4 py-3 md:py-5 bg-transparent border-none outline-none text-sm md:text-xl placeholder:text-slate-400 font-medium text-slate-950 dark:text-white"
                        />
                    </div>

                    {/* Controls Rack */}
                    <div className="flex flex-col md:flex-row gap-3 pt-3 border-t border-slate-100 dark:border-white/5 mt-3">
                    
                      {/* Audience level */}
                      <div className="flex-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-white/5 px-4 py-2.5 flex items-center gap-3 hover:border-cyan-500/20 transition-colors">
                          <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm">
                              <GraduationCap className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col w-full">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Complexity</label>
                              <select 
                                  value={complexityLevel} 
                                  onChange={(e) => setComplexityLevel(e.target.value as ComplexityLevel)}
                                  className="bg-transparent border-none text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-cyan-500 transition-colors"
                              >
                                  <option value="Elementary">Elementary (Ages 6-10)</option>
                                  <option value="High School">High School (Textbook)</option>
                                  <option value="College">College (Academic)</option>
                                  <option value="Expert">Expert (Technical Blueprint)</option>
                              </select>
                          </div>
                      </div>

                      {/* Aesthetic selector */}
                      <div className="flex-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-white/5 px-4 py-2.5 flex items-center gap-3 hover:border-purple-500/20 transition-colors">
                           <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-purple-600 dark:text-purple-400 shrink-0 shadow-sm">
                              <Palette className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col w-full">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Visual Aesthetic</label>
                              <select 
                                  value={visualStyle} 
                                  onChange={(e) => setVisualStyle(e.target.value as VisualStyle)}
                                  className="bg-transparent border-none text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-purple-500 transition-colors"
                              >
                                  <option value="Default">Standard Scientific Illustration</option>
                                  <option value="Minimalist">Bauhaus Minimalist</option>
                                  <option value="Realistic">Photorealistic Cinematic Model</option>
                                  <option value="Cartoon">Cel-Shaded Comic Novel</option>
                                  <option value="Vintage">19th-Century Scientific Lithograph</option>
                                  <option value="Futuristic">Cyberpunk Hologram HUD</option>
                                  <option value="3D Render">3D Isometric Claymorphism</option>
                                  <option value="Sketch">Da Vinci Technical Notebook</option>
                              </select>
                          </div>
                      </div>

                      {/* Language Selection */}
                      <div className="flex-1 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/60 dark:border-white/5 px-4 py-2.5 flex items-center gap-3 hover:border-orange-500/20 transition-colors">
                           <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-orange-600 dark:text-orange-400 shrink-0 shadow-sm">
                              <Globe className="w-4 h-4" />
                          </div>
                          <div className="flex flex-col w-full">
                              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Language Output</label>
                              <select 
                                  value={language} 
                                  onChange={(e) => setLanguage(e.target.value as Language)}
                                  className="bg-transparent border-none text-sm font-extrabold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 w-full hover:text-orange-500 transition-colors"
                              >
                                  <option value="English">English</option>
                                  <option value="Spanish">Español (Spanish)</option>
                                  <option value="French">Français (French)</option>
                                  <option value="German">Deutsch (German)</option>
                                  <option value="Mandarin">中文 (Mandarin)</option>
                                  <option value="Japanese">日本語 (Japanese)</option>
                                  <option value="Hindi">हिन्दी (Hindi)</option>
                                  <option value="Arabic">العربية (Arabic)</option>
                                  <option value="Portuguese">Português (Portuguese)</option>
                                  <option value="Russian">Русский (Russian)</option>
                              </select>
                          </div>
                      </div>

                      {/* Launch Trigger */}
                      <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full md:w-auto px-8 bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-xl font-bold hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 py-3 shadow-[0_4px_14px_rgba(6,182,212,0.3)] disabled:opacity-40"
                      >
                          <Compass className="w-4 h-4 animate-spin-slow" />
                          <span>LAUNCH MAP</span>
                      </button>

                    </div>
                </div>
            </div>
          </form>

          {/* Interactive Navigational Charts Library - Display only when history is empty */}
          {!imageHistory.length && (
            <div className="mt-12 md:mt-20 animate-in fade-in slide-in-from-bottom-8 delay-300 duration-1000">
              <div className="flex items-center gap-2 mb-6 justify-center">
                <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 font-mono">Curated Exploration Pathways</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {atlasCharts.map((chart, index) => {
                  const ChartIcon = chart.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleLaunchChart(chart)}
                      className="group p-5 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 text-left hover:border-cyan-500/30 dark:hover:bg-slate-900/80 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col items-start gap-4 hover:-translate-y-1"
                    >
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${chart.color} text-white group-hover:scale-110 transition-transform`}>
                        <ChartIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight text-sm">
                          {chart.title}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs font-light mt-1.5 leading-relaxed line-clamp-3">
                          {chart.description}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 font-mono tracking-widest mt-auto uppercase">Assemble Prompt →</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {isLoading && <Loading status={loadingMessage} step={loadingStep} facts={loadingFacts} />}

        {error && (
          <div className="max-w-4xl mx-auto mt-6 p-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl flex items-start gap-4 text-red-900 dark:text-red-300 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-red-400 mt-0.5" />
            <div className="flex-1 text-sm font-medium">
                <p>{error}</p>
            </div>
          </div>
        )}

        {quotaExceeded && (
          <div className="max-w-4xl mx-auto mt-6 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl text-slate-900 dark:text-slate-100 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-amber-600/20 rounded-xl text-amber-500 shrink-0">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display font-extrabold text-sm uppercase tracking-wider text-amber-600 dark:text-amber-450">API Quota Exhausted (429)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                  The shared server-side key has reached its Google AI Studio free tier limits. Don't worry! We have automatically enabled the <strong>Simulated Map Engine</strong> so you can continue creating beautiful diagrams.
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-500 space-y-1">
                  <p className="text-amber-600 dark:text-amber-400">💡 <strong>To restore Live server-side generations:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-400">
                    <li>Open <strong>Settings</strong> (Gear Icon) in the AI Studio panel.</li>
                    <li>Verify your billing configuration or specify a personal active API Key in the <strong>Secrets/API Keys</strong> menu.</li>
                    <li>Switch the engine mode in the header back to <strong>Live Gemini API</strong>.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Navigational Output Dashboard */}
        {imageHistory.length > 0 && !isLoading && (
            <div className="max-w-7xl mx-auto mt-6 gap-8 grid grid-cols-1 xl:grid-cols-12 items-start">
                
                {/* Visual Chart Left Panel */}
                <div className="xl:col-span-8 space-y-6">
                  <Infographic 
                      image={imageHistory[0]} 
                      onEdit={handleEdit} 
                      isEditing={isLoading}
                  />
                  <SearchResults results={currentSearchResults} />
                </div>

                {/* Prompt Engineering Teardown Right Panel */}
                <div className="xl:col-span-4 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-2xl p-6 shadow-2xl backdrop-blur-md mt-8 relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-700">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500"></div>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <Terminal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-mono">Prompt Architecture Teardown</h3>
                  </div>

                  {imageHistory[0].promptAnalysis ? (
                    <div className="space-y-6">
                      
                      {/* Demonstrated Framework */}
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block mb-2">Demonstrated Strategy</span>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 font-bold text-xs border border-cyan-100 dark:border-cyan-500/15">
                          <Flame className="w-3.5 h-3.5 text-orange-500" />
                          {imageHistory[0].promptAnalysis.framework}
                        </div>
                      </div>

                      {/* Structural Role Alignment */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block">Agent Persona & Context</span>
                        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-200/50 dark:border-white/5 font-medium leading-relaxed">
                          {imageHistory[0].promptAnalysis.role}
                        </p>
                      </div>

                      {/* Negative constraints and limits */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block">Structural/Aesthetic Limits</span>
                        <p className="text-xs md:text-sm text-slate-800 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/50 p-3 rounded-lg border border-slate-200/50 dark:border-white/5 font-medium leading-relaxed">
                          {imageHistory[0].promptAnalysis.constraints}
                        </p>
                      </div>

                      {/* Expert Prompt tips */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block">Navigation Pro-Tips</span>
                        <div className="space-y-2">
                          {imageHistory[0].promptAnalysis.tips.map((tip, tIdx) => (
                            <div key={tIdx} className="flex gap-2.5 items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0"></div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Optimized Copyable prompt Box */}
                      <div className="space-y-2 border-t border-slate-100 dark:border-white/5 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500">Copy Engineered Prompt</span>
                          <button 
                            type="button"
                            onClick={() => handleCopyText(imageHistory[0].promptAnalysis!.optimizedPrompt, "active")}
                            className="p-1.5 rounded bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors shrink-0"
                            title="Copy to clipboard"
                          >
                            {copiedPromptId === "active" ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-950/95 dark:bg-black/80 font-mono text-[10px] text-cyan-300/90 leading-normal p-4 rounded-xl border border-white/5 select-all max-h-[150px] overflow-y-auto whitespace-pre-wrap relative scrolling-thin scroll-smooth select-all">
                          {imageHistory[0].promptAnalysis.optimizedPrompt}
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-center gap-3">
                      <Lightbulb className="w-8 h-8 opacity-40 text-amber-500" />
                      <p className="text-xs text-slate-500 max-w-xs font-light">
                        Prompt Engineering logs are available for newly assembled diagrams. Re-run your query to inspect prompt structures.
                      </p>
                    </div>
                  )}

                </div>

            </div>
        )}

        {/* Book Companion Interactive Hub Centerpiece */}
        <div className="max-w-7xl mx-auto mt-12 mb-12 relative z-20">
          <BookCompanion 
            activeTopic={topic}
            onSelectPrompt={(selectedText) => {
              setTopic(selectedText);
              // Focus the search input and request a launch automatically
              const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (searchInput) {
                searchInput.focus();
                // Scroll smoothly to form
                const scrollTarget = document.getElementById('search-input-form');
                if (scrollTarget) {
                  scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            }}
          />
        </div>

        {/* Historical Sessions Archives */}
        {imageHistory.length > 1 && (
            <div className="max-w-7xl mx-auto mt-16 md:mt-24 border-t border-slate-200 dark:border-white/5 pt-12 transition-colors">
                <div className="flex items-center gap-2 mb-8 justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Session History
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wide">Click to restore previous materialization</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                    {imageHistory.slice(1).map((img) => (
                        <div 
                            key={img.id} 
                            onClick={() => restoreImage(img)}
                            className="group relative cursor-pointer rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 hover:border-cyan-500/40 transition-all shadow-md bg-white dark:bg-slate-900/40 backdrop-blur-sm"
                        >
                            <img src={img.data} alt={img.prompt} className="w-full aspect-video object-cover opacity-95 dark:opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950 via-slate-900/95 to-transparent p-4 pt-12 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <p className="text-xs text-white font-extrabold truncate mb-1.5 font-display">{img.prompt}</p>
                                <div className="flex gap-1.5 flex-wrap">
                                    {img.level && <span className="text-[8px] text-cyan-200 dark:text-cyan-300 uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-cyan-900/40 border border-cyan-500/10">{img.level}</span>}
                                    {img.style && <span className="text-[8px] text-purple-200 dark:text-purple-300 uppercase font-bold tracking-wide px-1.5 py-0.5 rounded bg-purple-900/40 border border-purple-500/10">{img.style}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>

      {/* Corporate Reference Footer */}
      <footer className="mt-20 border-t border-slate-200 dark:border-white/5 py-8 text-center text-xs text-slate-400 dark:text-slate-600 font-mono space-y-2.5 relative z-25">
        <p className="text-[10px] tracking-wide uppercase">
          Copyright © 2026 |{" "}
          <a href="mailto:promptatlas@dascient.com" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-bold">
            DaScient, Inc.
          </a>{" "}
          |{" "}
          <a href="mailto:promptatlas@dascient.com" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors font-bold">
            promptatlas@dascient.com
          </a>
        </p>
        <div className="flex justify-center items-center gap-4 text-[9px] uppercase tracking-wider font-semibold">
          <a href="https://github.com/DaScient/The-Prompt-Atlas" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
            GitHub Repo <ExternalLink className="w-3 h-3" />
          </a>
          <span className="opacity-30 dark:opacity-20">•</span>
          <a href="https://promptatlas.dascient.org/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors flex items-center gap-1">
            Official Site <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>

    </div>
    )}
    </>
  );
};

export default App;
