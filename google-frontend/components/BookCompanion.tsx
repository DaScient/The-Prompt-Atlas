/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  bookParts, 
  glossaryTerms, 
  workbookExercises, 
  CompanionChapter, 
  CompanionPart,
  GlossaryItem,
  WorkbookItem
} from "../services/bookContext";
import { 
  BookOpen, 
  Bookmark, 
  Sparkles, 
  HelpCircle, 
  ArrowRight, 
  Users, 
  Building, 
  Globe, 
  Terminal, 
  Info,
  Calendar,
  Flame,
  Award
} from "lucide-react";

interface BookCompanionProps {
  onSelectPrompt: (promptText: string, level?: string, style?: string) => void;
  activeTopic: string;
}

export const BookCompanion: React.FC<BookCompanionProps> = ({ onSelectPrompt, activeTopic }) => {
  const [activeTab, setActiveTab] = useState<"blueprint" | "exercises" | "glossary">("blueprint");
  
  // Chapter State
  const [selectedPartIndex, setSelectedPartIndex] = useState(0);
  const [selectedChapterId, setSelectedChapterId] = useState(1);
  
  // Exercises state filter
  const [exerciseAudience, setExerciseAudience] = useState<"Individuals" | "Companies" | "Governments">("Individuals");
  
  // Selected Glossary term info
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<string>("Antifragility");

  // Retrieve current active chapter object
  const currentChapter = bookParts
    .flatMap(p => p.chapters)
    .find(c => c.id === selectedChapterId) || bookParts[0].chapters[0];

  const currentPart = bookParts.find(p => p.chapters.some(c => c.id === selectedChapterId)) || bookParts[0];

  const handleLaunchLine = (query: string) => {
    onSelectPrompt(query, "College", "Minimalist");
  };

  const filteredExercises = workbookExercises.filter(e => e.audience === exerciseAudience);

  return (
    <div className="w-full bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
      
      {/* Top Companion Header Bar */}
      <div className="px-6 py-5 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/25">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl text-amber-600 dark:text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-slate-800 dark:text-white text-base tracking-tight leading-none">
              PROMPT ATLAS COMPANION HUB
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider uppercase mt-1">
              Speculative Reading Guide & Interactive Workbook
            </p>
          </div>
        </div>

        {/* Core Multi-Tab Menu */}
        <div className="flex bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-white/5 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("blueprint")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "blueprint"
                ? "bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Blueprint Atlas</span>
          </button>
          
          <button
            onClick={() => setActiveTab("exercises")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "exercises"
                ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Workbook Drills</span>
          </button>
          
          <button
            onClick={() => setActiveTab("glossary")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "glossary"
                ? "bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Strange Glossary</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BLUEPRINT ATLAS CHAPTER EXPLORER */}
      {activeTab === "blueprint" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* Left Navigation Rails: Chapters Tree */}
          <div className="lg:col-span-4 border-r border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/10 p-5 space-y-4 max-h-[600px] overflow-y-auto scrolling-thin">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 dark:text-slate-500 block font-bold mb-1">
              Select Book Module
            </span>

            {bookParts.map((part, pIdx) => (
              <div key={part.partNumber} className="space-y-1.5">
                <div className="px-2 py-1 text-[10px] font-mono font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest bg-cyan-500/5 rounded">
                  {part.partNumber}: {part.title}
                </div>
                <div className="pl-1.5 space-y-1">
                  {part.chapters.map((chap) => (
                    <button
                      key={chap.id}
                      onClick={() => {
                        setSelectedPartIndex(pIdx);
                        setSelectedChapterId(chap.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                        selectedChapterId === chap.id
                          ? "bg-slate-100 dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 font-extrabold border-l-2 border-cyan-500 pl-2 shadow-sm"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950/20"
                      }`}
                    >
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 shrink-0 font-mono">
                        Ch{chap.id}
                      </span>
                      <span className="leading-tight truncate">{chap.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Reading View: Loaded Chapter content */}
          <div className="lg:col-span-8 p-6 md:p-8 space-y-6 max-h-[600px] overflow-y-auto scrolling-thin bg-white/40 dark:bg-slate-900/10">
            
            {/* Header info */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono font-bold tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
                {currentPart.partNumber} • Chapter {currentChapter.id}
              </span>
              <h2 className="text-xl md:text-2xl font-display font-extrabold text-slate-950 dark:text-white leading-tight">
                {currentChapter.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic mt-0.5">
                {currentChapter.subtitle}
              </p>
            </div>

            {/* Editorial Quote block (Centerpiece) */}
            <div className="relative p-6 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-slate-100 dark:border-white/5 shadow-inner leading-relaxed">
              <div className="absolute top-4 left-4 text-3xl font-serif text-cyan-500/20 leading-none pointer-events-none">“</div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-350 italic font-serif leading-relaxed text-center px-4">
                {currentChapter.quote}
              </p>
              <div className="absolute bottom-4 right-4 text-3xl font-serif text-cyan-500/20 leading-none pointer-events-none">”</div>
            </div>

            {/* Chapter overview summary */}
            <div className="space-y-1.5">
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">
                Philosophical Synopsis
              </span>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {currentChapter.summary}
              </p>
            </div>

            {/* Guiding Questions section */}
            <div className="space-y-2.5">
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                Guiding Questions to Ponder
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentChapter.guidingQuestions.map((q, qIndex) => (
                  <div key={qIndex} className="p-3 bg-slate-50/30 dark:bg-slate-950/10 border border-slate-100 dark:border-white/5 rounded-xl flex gap-2">
                    <span className="text-cyan-500 font-mono text-xs font-bold leading-none mt-0.5">?</span>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-medium">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Collapse Speculative Vignette Case Study block */}
            <div className="p-4 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 border border-purple-500/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <h4 className="text-xs uppercase font-mono tracking-wider font-extrabold text-purple-800 dark:text-purple-400">
                  Speculative Case Study: {currentChapter.caseStudyTitle}
                </h4>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                {currentChapter.caseStudyText}
              </p>
            </div>

            {/* Deployable prompts block */}
            <div className="space-y-3 pt-2">
              <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">
                Deployable Chapter Prompts
              </span>
              <div className="space-y-2">
                {currentChapter.prompts.map((p, pIndex) => (
                  <button
                    key={pIndex}
                    onClick={() => handleLaunchLine(p.query)}
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5 text-left hover:border-cyan-500/30 hover:bg-white dark:hover:bg-slate-950/80 transition-all flex items-start justify-between gap-4 group hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-1">
                      <span className="text-xs font-black text-slate-800 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {p.label}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-snug">
                        {p.description}
                      </p>
                      <div className="font-mono text-[9px] text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded truncate max-w-[450px] inline-block">
                        {p.query}
                      </div>
                    </div>
                    <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5 text-slate-400 group-hover:text-cyan-500 group-hover:border-cyan-500/20 rounded-xl transition-all shadow-sm shrink-0">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: APPENDIX B: WORKBOOK EXERCISES */}
      {activeTab === "exercises" && (
        <div className="p-6 md:p-8 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h4 className="font-display font-extrabold text-lg text-slate-950 dark:text-white tracking-tight leading-tight">
              Appendix B: Workbook Exercises
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-light leading-relaxed">
              These structured exercises from the book can be executed live. Select your target scope to filter exercises designed for personal, corporate, or state modeling.
            </p>
          </div>

          {/* Scope selection toggle */}
          <div className="flex justify-center border-b border-slate-100 dark:border-white/5 pb-4">
            <div className="flex bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 p-1 rounded-2xl">
              {[
                { label: "For Individuals", value: "Individuals", icon: Users },
                { label: "For Companies", value: "Companies", icon: Building },
                { label: "For Governments", value: "Governments", icon: Globe }
              ].map((scope) => {
                const Icon = scope.icon;
                return (
                  <button
                    key={scope.value}
                    onClick={() => setExerciseAudience(scope.value as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      exerciseAudience === scope.value
                        ? "bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-450 shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{scope.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered drills list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((ex, index) => (
              <div 
                key={index} 
                className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200 dark:border-white/5 flex flex-col justify-between gap-5 relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                    <Calendar className="w-3 h-3" /> Step Drill 0{index + 1}
                  </div>
                  <h3 className="font-display font-black text-sm text-slate-800 dark:text-white leading-tight">
                    {ex.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light leading-relaxed">
                    {ex.description}
                  </p>
                </div>

                <button
                  onClick={() => handleLaunchLine(ex.promptSeed)}
                  className="w-full flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-4 py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                >
                  <span className="truncate">Initialize Exercise Schema</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: APPENDIX D: GLOSSARY OF STRANGE FUTURES */}
      {activeTab === "glossary" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
          
          {/* Glossary Terms select grid */}
          <div className="lg:col-span-5 border-r border-slate-100 dark:border-white/5 bg-slate-50/20 dark:bg-slate-950/10 p-5 max-h-[600px] overflow-y-auto scrolling-thin">
            <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold mb-3">
              Speculative Lexicon Indices
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {glossaryTerms.map((g) => (
                <button
                  key={g.term}
                  onClick={() => setSelectedGlossaryTerm(g.term)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs transition-all flex flex-col gap-1 ${
                    selectedGlossaryTerm === g.term
                      ? "bg-slate-100 dark:bg-slate-900 border-l-2 border-purple-500 pl-3.5 shadow-sm text-purple-700 dark:text-purple-300 font-black"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/20"
                  }`}
                >
                  <span>{g.term}</span>
                  <span className="text-[9px] font-light text-slate-400 block truncate group-hover:text-slate-500">
                    {g.definition}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected glossary detail page */}
          {(() => {
            const item = glossaryTerms.find(g => g.term === selectedGlossaryTerm) || glossaryTerms[0];
            return (
              <div className="lg:col-span-7 p-6 md:p-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1 text-[9px] font-mono uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded font-black tracking-widest">
                       Appendix D • Dictionary of Strange Futures
                    </div>
                    <h2 className="text-2xl font-display font-black text-slate-950 dark:text-white pt-1">
                      {item.term}
                    </h2>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">
                       System Lexicon Definition
                    </span>
                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
                      {item.definition}
                    </p>
                  </div>

                  <div className="p-5 bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-white/5 rounded-2.5xl space-y-1.5 relative overflow-hidden">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-purple-500 block font-bold flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      Concrete Speculative Example
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light italic">
                      “{item.example}”
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-white/5 mt-auto">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block font-bold">
                    Interactive Concept Seed
                  </span>
                  <button
                    onClick={() => handleLaunchLine(item.promptSeed)}
                    className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold py-3.5 px-6 shadow-md hover:brightness-110 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Terminal className="w-4 h-4 shrink-0 text-purple-200" />
                      <span className="font-mono tracking-wider text-[11px] truncate">
                        {item.promptSeed}
                      </span>
                    </div>
                    <span className="shrink-0 font-extrabold bg-white/10 px-2 py-0.5 rounded leading-none text-[10px] ml-4">
                      Assemble Map →
                    </span>
                  </button>
                </div>
              </div>
            );
          })()}

        </div>
      )}

    </div>
  );
};
