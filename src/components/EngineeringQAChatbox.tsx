import React, { useState, useEffect, useMemo } from 'react';
import {
  EngineeringQuestion,
  EngineeringDiscipline,
  QuestionReply,
  TabKey,
} from '../types';
import { INITIAL_ENGINEERING_QUESTIONS } from '../data/initialQA';
import { generateLabAssistantResponse } from '../utils/labAssistantEngine';
import { MarkdownMessage } from './MarkdownMessage';
import {
  MessageSquare,
  Send,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Tag,
  UserCheck,
  Bot,
  Layers,
  Rocket,
  Compass,
  Cpu,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  AlertCircle,
  HelpCircle,
  PlusCircle,
  KeyRound,
  RotateCcw,
  Copy,
} from 'lucide-react';

interface EngineeringQAChatboxProps {
  onNotify?: (message: string, isError?: boolean) => void;
  onSelectTab?: (tab: TabKey) => void;
}

const STORAGE_KEY = 'swid_shrk_engineering_qa_v1';

export const EngineeringQAChatbox: React.FC<EngineeringQAChatboxProps> = ({
  onNotify,
  onSelectTab,
}) => {
  // Load questions from localStorage or default seed
  const [questions, setQuestions] = useState<EngineeringQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_ENGINEERING_QUESTIONS;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (e) {
      console.warn('Failed to save QA data to localStorage', e);
    }
  }, [questions]);

  // Filtering & Search states
  const [selectedDiscipline, setSelectedDiscipline] = useState<EngineeringDiscipline>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'answered' | 'open'>('all');

  // Director Mode State (Allows Dr. Pouria to post verified answers directly)
  const [isDirectorMode, setIsDirectorMode] = useState(false);
  const [directorKeyInput, setDirectorKeyInput] = useState('');
  const [showDirectorModal, setShowDirectorModal] = useState(false);

  // New Question Form state
  const [showAskForm, setShowAskForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDiscipline, setNewDiscipline] = useState<EngineeringDiscipline>('Aerospace & Hypersonics');
  const [newName, setNewName] = useState('');
  const [newAffiliation, setNewAffiliation] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  // Answering / Replying state
  const [activeReplyQuestionId, setActiveReplyQuestionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthorName, setReplyAuthorName] = useState('');
  const [isDraftingAI, setIsDraftingAI] = useState(false);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Upvoted tracker
  const [upvotedIds, setUpvotedIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expand / collapse tracking for long engineering answers
  const [expandedReplyIds, setExpandedReplyIds] = useState<Record<string, boolean>>({});
  const [copiedReplyId, setCopiedReplyId] = useState<string | null>(null);

  const toggleReplyExpand = (replyId: string) => {
    setExpandedReplyIds((prev) => ({
      ...prev,
      [replyId]: !prev[replyId],
    }));
  };

  const expandAllRepliesForQuestion = (q: EngineeringQuestion, expand: boolean) => {
    setExpandedReplyIds((prev) => {
      const next = { ...prev };
      q.replies.forEach((r) => {
        next[r.id] = expand;
      });
      return next;
    });
  };

  const handleCopyReply = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedReplyId(id);
    onNotify?.('Technical explanation copied to clipboard');
    setTimeout(() => setCopiedReplyId(null), 2000);
  };

  const disciplines: EngineeringDiscipline[] = [
    'All',
    'Aerospace & Hypersonics',
    'Solid Mechanics & Structures',
    'Fluids & Thermal Sciences',
    'Metamaterials & Advanced Composites',
    'Biomechanics & Biomaterials',
    'Robotics & Control Systems',
    'Computational FEA & CFD',
  ];

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesDiscipline =
        selectedDiscipline === 'All' || q.discipline === selectedDiscipline;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'answered' && q.status === 'Answered by Dr. Pouria') ||
        (statusFilter === 'open' && q.status !== 'Answered by Dr. Pouria');

      const qTerm = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !qTerm ||
        q.title.toLowerCase().includes(qTerm) ||
        q.content.toLowerCase().includes(qTerm) ||
        q.authorName.toLowerCase().includes(qTerm) ||
        (q.authorAffiliation && q.authorAffiliation.toLowerCase().includes(qTerm)) ||
        q.tags.some((t) => t.toLowerCase().includes(qTerm)) ||
        q.replies.some((r) => r.content.toLowerCase().includes(qTerm));

      return matchesDiscipline && matchesStatus && matchesSearch;
    });
  }, [questions, selectedDiscipline, statusFilter, searchQuery]);

  // Handle upvoting
  const handleToggleUpvote = (id: string) => {
    const isUpvoted = upvotedIds[id];
    setUpvotedIds((prev) => ({ ...prev, [id]: !isUpvoted }));

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          return {
            ...q,
            upvotes: isUpvoted ? q.upvotes - 1 : q.upvotes + 1,
          };
        }
        return q;
      })
    );

    if (onNotify) {
      onNotify(isUpvoted ? 'Removed upvote.' : 'Question upvoted! Thank you.');
    }
  };

  // Handle director mode activation
  const handleActivateDirectorMode = () => {
    // Simple verification check for Pouria
    const trimmed = directorKeyInput.trim().toLowerCase();
    if (
      trimmed === 'pouria' ||
      trimmed === 'director' ||
      trimmed === 'pouriarekavandi@gmail.com' ||
      trimmed === 'swid-shrk'
    ) {
      setIsDirectorMode(true);
      setShowDirectorModal(false);
      setDirectorKeyInput('');
      if (onNotify) onNotify('Director Mode active: You can now post official answers as Dr. Pouria.');
    } else {
      if (onNotify) onNotify('Invalid key. Enter "pouria" or "swid-shrk" to access director answering.', true);
    }
  };

  // Handle submitting new question
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !newName.trim()) {
      if (onNotify) onNotify('Please fill in your name, question title, and question details.', true);
      return;
    }

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newQ: EngineeringQuestion = {
      id: `q-${Date.now()}`,
      title: newTitle.trim(),
      discipline: newDiscipline,
      authorName: newName.trim(),
      authorAffiliation: newAffiliation.trim() || 'Engineering Researcher / Visitor',
      authorEmail: newEmail.trim() || undefined,
      content: newContent.trim(),
      createdAt: new Date().toISOString(),
      status: 'Open for Discussion',
      upvotes: 1,
      tags: tagsArray.length > 0 ? tagsArray : [newDiscipline.split(' ')[0]],
      replies: [],
    };

    setQuestions((prev) => [newQ, ...prev]);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setShowAskForm(false);
    setExpandedQuestionId(newQ.id);

    if (onNotify) {
      onNotify('Your engineering question has been posted to the chatbox! Dr. Pouria will review and answer.');
    }
  };

  // Generate technical AI draft for Dr. Pouria to review & post
  const handleGenerateAIDraft = (targetQuestion: EngineeringQuestion) => {
    setIsDraftingAI(true);
    setTimeout(() => {
      try {
        const fullPrompt = `${targetQuestion.title}. Details: ${targetQuestion.content}`;
        const aiResponse = generateLabAssistantResponse(fullPrompt, 'research_specialist');
        setReplyText(
          `### Engineering Principles & Analytical Assessment\n\n${aiResponse.text}\n\n*References & Computational Grounding:*\n• Direct inquiry addressed by Dr. Pouria Hejazi Rekavandi, SWID-SHRK Aerospace & Mechanics Laboratory.`
        );
        if (onNotify) onNotify('AI technical draft generated for Dr. Pouria. Review, edit, and publish!');
      } catch (err) {
        console.error('Draft error:', err);
      } finally {
        setIsDraftingAI(false);
      }
    }, 400);
  };

  // Handle submitting reply
  const handleSubmitReply = (questionId: string) => {
    if (!replyText.trim()) return;

    const isDirector = isDirectorMode;
    const authorName = isDirector
      ? 'Dr. Pouria Hejazi Rekavandi'
      : replyAuthorName.trim() || 'Visiting Mechanical Engineer';

    const authorRole = isDirector
      ? 'Lab Director & PI · SWID-SHRK Lab'
      : 'Community Contributor';

    const newReply: QuestionReply = {
      id: `rep-${Date.now()}`,
      authorName,
      authorRole,
      authorEmail: isDirector ? 's.s.hejazirekavandi@gmail.com' : undefined,
      isDirector,
      content: replyText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            status: isDirector ? 'Answered by Dr. Pouria' : q.status,
            replies: [...q.replies, newReply],
          };
        }
        return q;
      })
    );

    setReplyText('');
    setActiveReplyQuestionId(null);
    if (onNotify) {
      onNotify(
        isDirector
          ? 'Official answer by Dr. Pouria successfully published!'
          : 'Your response was added to the discussion.'
      );
    }
  };

  // Copy question link / text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onNotify) onNotify('Question copied to clipboard.');
  };

  // Reset to original data
  const handleResetData = () => {
    if (window.confirm('Reset the Q&A board to the original verified question threads?')) {
      setQuestions(INITIAL_ENGINEERING_QUESTIONS);
      localStorage.removeItem(STORAGE_KEY);
      if (onNotify) onNotify('Q&A repository reset to initial verified archive.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero Header */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 dark:bg-gradient-to-r dark:from-zinc-950 dark:via-[#091017] dark:to-zinc-950 bg-gradient-to-r from-sky-50 via-emerald-50/50 to-slate-100 border dark:border-zinc-800 border-slate-300 shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider dark:bg-[#00ff41]/10 dark:text-[#00ff41] bg-emerald-100 text-emerald-800 border dark:border-[#00ff41]/30 border-emerald-400">
              <MessageSquare className="w-3.5 h-3.5" />
              Direct Engineering Q&amp;A Chatbox
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-section-title font-bold uppercase tracking-wide dark:text-white text-slate-900 flex items-center gap-2">
              <span className="text-[#00ff41] font-mono select-none">//</span>
              <span>Ask Dr. Pouria: Mechanical &amp; Aerospace Q&amp;A</span>
            </h1>
            <p className="text-xs sm:text-sm font-mono dark:text-zinc-300 text-slate-700 leading-relaxed">
              Have a technical question in <strong>Hypersonics, Supersonic Aerodynamics, Multiaxial Fatigue, Fracture Mechanics, AntiPrism Metamaterials, Abaqus FEA Modeling, or Neural Biomechanics</strong>? Post your inquiry here. Dr. Pouria Hejazi Rekavandi answers questions directly in this interactive chatbox.
            </p>
          </div>

          {/* Action CTAs: Ask Question & Director Access */}
          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2.5 flex-none">
            <button
              onClick={() => setShowAskForm((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg dark:bg-[#00ff41] dark:hover:bg-[#00ff41]/90 dark:text-black bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              {showAskForm ? 'Close Question Form' : 'Ask a Question'}
            </button>

            <button
              onClick={() => {
                if (isDirectorMode) {
                  setIsDirectorMode(false);
                  if (onNotify) onNotify('Director Mode turned off.');
                } else {
                  setShowDirectorModal(true);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all border cursor-pointer ${
                isDirectorMode
                  ? 'dark:bg-[#00b8ff]/20 dark:border-[#00b8ff] dark:text-[#00b8ff] bg-sky-100 border-sky-400 text-sky-800'
                  : 'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 bg-white border-slate-300 text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              {isDirectorMode ? 'Director Mode (Active ✓)' : 'Pouria Answering Mode'}
            </button>
          </div>
        </div>

        {/* Director Mode Active Notice */}
        {isDirectorMode && (
          <div className="mt-4 p-3 rounded-lg dark:bg-[#00b8ff]/10 bg-sky-100 border dark:border-[#00b8ff]/30 border-sky-300 text-xs font-mono flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 dark:text-[#00b8ff] text-sky-800 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Logged in as Dr. Pouria Hejazi Rekavandi (PI). Any answer you post will carry the verified Director badge.</span>
            </div>
            <button
              onClick={() => setIsDirectorMode(false)}
              className="text-[11px] underline dark:text-zinc-400 text-slate-600 hover:dark:text-white hover:text-black cursor-pointer"
            >
              Exit Mode
            </button>
          </div>
        )}
      </div>

      {/* Director Login Modal */}
      {showDirectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-xl p-6 dark:bg-[#090d12] bg-white border dark:border-zinc-700 border-slate-300 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b dark:border-zinc-800 border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-bold dark:text-[#00ff41] text-emerald-700 text-sm uppercase">
                <ShieldCheck className="w-4 h-4" />
                Director Verification
              </div>
              <button
                onClick={() => setShowDirectorModal(false)}
                className="text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="dark:text-zinc-300 text-slate-600 leading-relaxed">
              Dr. Pouria, enter your laboratory access key or director email (<code>pouria</code> or <code>pouriarekavandi@gmail.com</code>) to unlock official verified answering:
            </p>
            <input
              type="text"
              value={directorKeyInput}
              onChange={(e) => setDirectorKeyInput(e.target.value)}
              placeholder="Enter key or email..."
              className="w-full px-3 py-2 rounded dark:bg-black bg-slate-100 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleActivateDirectorMode();
              }}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowDirectorModal(false)}
                className="px-3 py-1.5 rounded dark:bg-zinc-800 bg-slate-200 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleActivateDirectorMode}
                className="px-4 py-1.5 rounded dark:bg-[#00ff41] bg-emerald-600 text-black font-bold uppercase tracking-wider cursor-pointer"
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Form Collapsible */}
      {showAskForm && (
        <form
          onSubmit={handleSubmitQuestion}
          className="rounded-xl p-5 sm:p-6 dark:bg-zinc-900/90 bg-white border-2 dark:border-[#00ff41]/40 border-emerald-500 shadow-lg space-y-4 font-mono text-xs animate-fade-in"
        >
          <div className="flex items-center justify-between border-b dark:border-zinc-800 border-slate-200 pb-3">
            <h3 className="text-sm font-bold uppercase dark:text-white text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#00ff41]" />
              Submit Engineering Question to Dr. Pouria
            </h3>
            <span className="text-[10px] text-zinc-400">All fields marked * are required</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold dark:text-zinc-300 text-slate-700">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Dr. Sarah Jenkins"
                className="w-full px-3 py-2 rounded dark:bg-black bg-slate-50 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold dark:text-zinc-300 text-slate-700">
                Affiliation / University / Company
              </label>
              <input
                type="text"
                value={newAffiliation}
                onChange={(e) => setNewAffiliation(e.target.value)}
                placeholder="e.g. Lockheed Martin / MIT / Purdue"
                className="w-full px-3 py-2 rounded dark:bg-black bg-slate-50 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold dark:text-zinc-300 text-slate-700">
                Email Address (Optional, for notifications)
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="your.email@organization.edu"
                className="w-full px-3 py-2 rounded dark:bg-black bg-slate-50 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold dark:text-zinc-300 text-slate-700">
                Mechanical &amp; Aerospace Discipline *
              </label>
              <select
                value={newDiscipline}
                onChange={(e) => setNewDiscipline(e.target.value as any)}
                className="w-full px-3 py-2 rounded dark:bg-black bg-slate-50 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
              >
                {disciplines
                  .filter((d) => d !== 'All')
                  .map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold dark:text-zinc-300 text-slate-700">
              Question Title / Specific Research Challenge *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Non-proportional fatigue life prediction under out-of-phase multiaxial stress"
              className="w-full px-3 py-2 rounded dark:bg-black bg-slate-50 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold dark:text-zinc-300 text-slate-700">
              Detailed Question, Boundary Conditions, or Simulation Context *
            </label>
            <textarea
              required
              rows={4}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Explain your problem in detail: material specifications, equations, loading conditions, Abaqus error messages, or theoretical challenges..."
              className="w-full px-3 py-2 rounded dark:bg-black bg-slate-50 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
            />
          </div>

          <div>
            <label className="block mb-1 font-bold dark:text-zinc-300 text-slate-700">
              Keywords / Tags (comma separated)
            </label>
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="e.g. Abaqus VUMAT, Fatigue, Viscoelasticity, Scramjet"
              className="w-full px-3 py-2 rounded dark:bg-black bg-slate-50 border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAskForm(false)}
              className="px-4 py-2 rounded dark:bg-zinc-800 bg-slate-200 text-slate-700 dark:text-zinc-300 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded dark:bg-[#00ff41] bg-emerald-600 text-black font-bold uppercase tracking-wider cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              Post to Chatbox
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-4 p-4 rounded-xl dark:bg-zinc-900/60 bg-slate-100 border dark:border-zinc-800 border-slate-300">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, questions, Abaqus, fatigue, hypersonics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg text-xs font-mono dark:bg-black bg-white dark:text-white text-slate-900 border dark:border-zinc-700 border-slate-300 focus:outline-none focus:border-[#00ff41]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-mono">
            <span className="text-zinc-400 text-[11px] uppercase mr-1">Status:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                statusFilter === 'all'
                  ? 'dark:bg-[#00ff41] bg-emerald-600 text-black'
                  : 'dark:bg-zinc-800 bg-white dark:text-zinc-300 text-slate-700'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setStatusFilter('answered')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                statusFilter === 'answered'
                  ? 'dark:bg-[#00b8ff] bg-sky-600 text-white'
                  : 'dark:bg-zinc-800 bg-white dark:text-zinc-300 text-slate-700'
              }`}
            >
              Answered by Dr. Pouria ({questions.filter((q) => q.status === 'Answered by Dr. Pouria').length})
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                statusFilter === 'open'
                  ? 'dark:bg-amber-400 bg-amber-500 text-black'
                  : 'dark:bg-zinc-800 bg-white dark:text-zinc-300 text-slate-700'
              }`}
            >
              Open ({questions.filter((q) => q.status !== 'Answered by Dr. Pouria').length})
            </button>
          </div>
        </div>

        {/* Discipline Tag Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-zinc-400 text-[10px] font-mono uppercase flex items-center gap-1 flex-none mr-1">
            <Filter className="w-3 h-3 text-[#00ff41]" />
            Discipline:
          </span>
          {disciplines.map((d) => {
            const count =
              d === 'All'
                ? questions.length
                : questions.filter((q) => q.discipline === d).length;
            const isSelected = selectedDiscipline === d;
            return (
              <button
                key={d}
                onClick={() => setSelectedDiscipline(d)}
                className={`flex-none px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer border ${
                  isSelected
                    ? 'dark:bg-[#00ff41]/20 dark:border-[#00ff41] dark:text-[#00ff41] bg-emerald-100 border-emerald-500 text-emerald-800 font-bold'
                    : 'dark:bg-black/50 dark:border-zinc-800 dark:text-zinc-400 bg-white border-slate-300 text-slate-600 hover:border-zinc-500'
                }`}
              >
                {d} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Questions Feed / Chatbox Stream */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 rounded-xl border dark:border-zinc-800 border-slate-300 dark:bg-zinc-950 bg-slate-50 font-mono space-y-3">
            <HelpCircle className="w-8 h-8 mx-auto dark:text-zinc-600 text-slate-400" />
            <p className="dark:text-zinc-400 text-slate-600 text-sm">
              No engineering questions found matching your filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedDiscipline('All');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#00ff41] hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id || activeReplyQuestionId === q.id;
            const isUpvoted = upvotedIds[q.id];

            return (
              <article
                key={q.id}
                className="rounded-xl border transition-all duration-200 dark:bg-[#080d12] bg-white dark:border-zinc-800 border-slate-200 hover:border-zinc-600 shadow-sm overflow-hidden"
              >
                {/* Question Header Card */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold dark:bg-zinc-800 bg-slate-100 dark:text-zinc-300 text-slate-700 border dark:border-zinc-700 border-slate-300">
                        {q.discipline}
                      </span>
                      {q.status === 'Answered by Dr. Pouria' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold dark:bg-[#00b8ff]/20 dark:text-[#00b8ff] bg-sky-100 text-sky-800 border dark:border-[#00b8ff]/40 border-sky-300">
                          <ShieldCheck className="w-3 h-3 text-[#00b8ff]" />
                          Answered by Dr. Pouria
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold dark:bg-amber-500/20 dark:text-amber-400 bg-amber-100 text-amber-800 border dark:border-amber-500/40 border-amber-300">
                          <Clock className="w-3 h-3" />
                          Open for Discussion
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-mono">
                      <span>{new Date(q.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <button
                        onClick={() => handleCopy(q.id, `${q.title}\n\n${q.content}`)}
                        className="p-1 hover:text-white cursor-pointer transition-colors"
                        title="Copy question"
                      >
                        {copiedId === q.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-base sm:text-lg font-bold font-mono dark:text-white text-slate-900 leading-snug">
                    {q.title}
                  </h2>

                  {/* Question Body */}
                  <div className="dark:text-zinc-300 text-slate-700 text-xs sm:text-sm font-mono leading-relaxed whitespace-pre-wrap">
                    {q.content}
                  </div>

                  {/* Tags */}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {q.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono dark:bg-zinc-900 bg-slate-100 dark:text-zinc-400 text-slate-600 border dark:border-zinc-800 border-slate-300"
                        >
                          <Tag className="w-2.5 h-2.5 text-[#00ff41]" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Author Details & Quick Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t dark:border-zinc-800/80 border-slate-200 text-xs font-mono">
                    <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                      <span className="font-bold dark:text-zinc-200 text-slate-800">
                        Asked by {q.authorName}
                      </span>
                      {q.authorAffiliation && (
                        <span>• {q.authorAffiliation}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Upvote button */}
                      <button
                        onClick={() => handleToggleUpvote(q.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer border ${
                          isUpvoted
                            ? 'dark:bg-[#00ff41]/20 dark:border-[#00ff41] dark:text-[#00ff41] bg-emerald-100 border-emerald-500 text-emerald-800 font-bold'
                            : 'dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span>{q.upvotes}</span>
                      </button>

                      {/* Reply / Answer CTA */}
                      <button
                        onClick={() => {
                          setActiveReplyQuestionId(
                            activeReplyQuestionId === q.id ? null : q.id
                          );
                          setExpandedQuestionId(q.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border ${
                          isDirectorMode
                            ? 'dark:bg-[#00ff41] dark:text-black bg-emerald-600 text-white border-transparent'
                            : 'dark:bg-zinc-900 bg-white dark:text-zinc-300 text-slate-700 border-zinc-700'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>
                          {isDirectorMode
                            ? 'Answer as Dr. Pouria'
                            : `Replies (${q.replies.length})`}
                        </span>
                      </button>

                      {/* Toggle Expand */}
                      <button
                        onClick={() =>
                          setExpandedQuestionId(
                            expandedQuestionId === q.id ? null : q.id
                          )
                        }
                        className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand thread'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Thread: Answers & Conversation */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 dark:bg-[#05090e] bg-slate-50 border-t dark:border-zinc-800 border-slate-200 space-y-4 font-mono text-xs">
                    {/* Replies List Header & Quick Actions */}
                    <div className="space-y-4">
                      {q.replies.length === 0 ? (
                        <div className="p-4 rounded-lg border border-dashed dark:border-zinc-800 border-slate-300 text-center text-zinc-500">
                          No answers or comments yet. Dr. Pouria or another researcher can answer below.
                        </div>
                      ) : (
                        <>
                          {/* Header bar when long answers are present */}
                          {q.replies.some((r) => r.content.length > 350 || r.content.split('\n').length > 6) && (
                            <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1 pb-1">
                              <span className="font-semibold uppercase tracking-wider text-[10px] dark:text-zinc-400 text-slate-500">
                                {q.replies.length} {q.replies.length === 1 ? 'Technical Explanation' : 'Explanations & Follow-ups'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const allExpanded = q.replies.every((r) => !!expandedReplyIds[r.id]);
                                  expandAllRepliesForQuestion(q, !allExpanded);
                                }}
                                className="text-[11px] font-mono dark:text-[#00b8ff] text-sky-600 hover:underline cursor-pointer flex items-center gap-1 font-bold"
                              >
                                {q.replies.every((r) => !!expandedReplyIds[r.id]) ? (
                                  <>
                                    <ChevronUp className="w-3.5 h-3.5" /> Collapse All Answers
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3.5 h-3.5" /> Expand All Answers
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {q.replies.map((rep) => {
                            const isLong = rep.content.length > 350 || rep.content.split('\n').length > 6;
                            const isExpanded = !isLong || !!expandedReplyIds[rep.id];
                            const wordCount = Math.ceil(rep.content.length / 5);
                            const readTimeMin = Math.max(1, Math.ceil(rep.content.length / 800));

                            return (
                              <div
                                key={rep.id}
                                className={`p-4 sm:p-5 rounded-xl border space-y-3 transition-all ${
                                  rep.isDirector
                                    ? 'dark:bg-zinc-900/90 bg-white border-2 dark:border-[#00b8ff]/60 border-sky-400 shadow-sm'
                                    : 'dark:bg-black/60 bg-white border dark:border-zinc-800 border-slate-300'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b dark:border-zinc-800 border-slate-200 pb-2">
                                  <div className="flex items-center gap-2">
                                    {rep.isDirector && (
                                      <div className="w-5 h-5 rounded-full bg-[#00b8ff] text-black flex items-center justify-center font-bold text-[10px]">
                                        ✓
                                      </div>
                                    )}
                                    <div>
                                      <span className="font-bold dark:text-white text-slate-900 text-xs">
                                        {rep.authorName}
                                      </span>
                                      <span className="ml-2 text-[10px] dark:text-[#00b8ff] text-sky-700 font-bold">
                                        {rep.authorRole}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-zinc-500 text-[10px]">
                                    {new Date(rep.createdAt).toLocaleDateString([], {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>

                                {/* Markdown Formatted Answer with Expand/Collapse Clamping */}
                                <div className="relative">
                                  <div
                                    className={`dark:text-zinc-200 text-slate-800 leading-relaxed text-xs sm:text-sm transition-all duration-300 ${
                                      !isExpanded
                                        ? 'max-h-52 sm:max-h-60 overflow-hidden select-none'
                                        : 'max-h-none'
                                    }`}
                                  >
                                    <MarkdownMessage content={rep.content} onSelectTab={onSelectTab} />
                                  </div>

                                  {/* Fade gradient mask when collapsed */}
                                  {isLong && !isExpanded && (
                                    <div
                                      className={`pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${
                                        rep.isDirector
                                          ? 'dark:from-[#18181b] dark:via-[#18181b]/95 from-white via-white/95 to-transparent'
                                          : 'dark:from-[#05090e] dark:via-[#05090e]/95 from-slate-50 via-slate-50/95 to-transparent'
                                      }`}
                                    />
                                  )}
                                </div>

                                {/* Expand/Collapse and Action Controls for Long Answers */}
                                {isLong && (
                                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t dark:border-zinc-800/80 border-slate-200 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => toggleReplyExpand(rep.id)}
                                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                                        isExpanded
                                          ? 'dark:bg-zinc-800/80 dark:hover:bg-zinc-700 bg-slate-100 hover:bg-slate-200 dark:text-zinc-300 text-slate-700 dark:border-zinc-700 border-slate-300'
                                          : 'dark:bg-[#00b8ff]/15 dark:hover:bg-[#00b8ff]/25 dark:text-[#00b8ff] dark:border-[#00b8ff]/50 bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-300 shadow-sm'
                                      }`}
                                      aria-expanded={isExpanded}
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="w-3.5 h-3.5" />
                                          <span>Show Less</span>
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3.5 h-3.5" />
                                          <span>Read Full Detailed Explanation</span>
                                          <span className="text-[10px] font-normal opacity-80">
                                            ({wordCount} words · ~{readTimeMin} min read)
                                          </span>
                                        </>
                                      )}
                                    </button>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => handleCopyReply(rep.id, rep.content)}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono text-zinc-400 hover:text-white dark:bg-zinc-800/60 bg-slate-100 border dark:border-zinc-700/80 border-slate-300 transition-colors cursor-pointer"
                                        title="Copy technical explanation markdown"
                                      >
                                        {copiedReplyId === rep.id ? (
                                          <>
                                            <Check className="w-3 h-3 text-[#00ff41]" />
                                            <span className="text-[#00ff41]">Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3 h-3" />
                                            <span>Copy Answer</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>

                    {/* Answer / Reply Input Box */}
                    {activeReplyQuestionId === q.id && (
                      <div className="mt-4 pt-4 border-t dark:border-zinc-800 border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold uppercase text-[11px] flex items-center gap-1.5 dark:text-[#00ff41] text-emerald-700">
                            {isDirectorMode ? (
                              <>
                                <ShieldCheck className="w-4 h-4 text-[#00b8ff]" />
                                Post Official Answer as Dr. Pouria Hejazi Rekavandi
                              </>
                            ) : (
                              <>
                                <MessageSquare className="w-3.5 h-3.5" />
                                Add Reply / Follow-Up Question
                              </>
                            )}
                          </span>

                          {/* AI Co-Pilot drafting button for Dr. Pouria */}
                          {isDirectorMode && (
                            <button
                              type="button"
                              onClick={() => handleGenerateAIDraft(q)}
                              disabled={isDraftingAI}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] dark:bg-[#00b8ff]/20 dark:text-[#00b8ff] bg-sky-100 text-sky-800 border dark:border-[#00b8ff]/40 border-sky-300 font-bold cursor-pointer hover:scale-105 transition-all"
                            >
                              <Bot className="w-3.5 h-3.5" />
                              {isDraftingAI ? 'Drafting Technical Response...' : 'AI Assistant Co-Draft'}
                            </button>
                          )}
                        </div>

                        {!isDirectorMode && (
                          <div>
                            <input
                              type="text"
                              value={replyAuthorName}
                              onChange={(e) => setReplyAuthorName(e.target.value)}
                              placeholder="Your Name (e.g. Elena Rostami, PhD Candidate)..."
                              className="w-full px-3 py-1.5 rounded dark:bg-black bg-white border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41]"
                            />
                          </div>
                        )}

                        <textarea
                          rows={5}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder={
                            isDirectorMode
                              ? 'Write Dr. Pouria\'s authoritative answer: analytical formulations, Abaqus settings, microstructural mechanisms, equations, and literature recommendations...'
                              : 'Write your follow-up inquiry or technical comment...'
                          }
                          className="w-full px-3.5 py-2.5 rounded-lg dark:bg-black bg-white border dark:border-zinc-700 border-slate-300 dark:text-white text-slate-900 focus:outline-none focus:border-[#00ff41] font-mono leading-relaxed resize-y"
                        />

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500">
                            Supports Markdown formatting (e.g., **bold**, ### headers, equations)
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveReplyQuestionId(null)}
                              className="px-3 py-1.5 rounded dark:bg-zinc-800 bg-slate-200 text-slate-700 dark:text-zinc-300 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSubmitReply(q.id)}
                              disabled={!replyText.trim()}
                              className="flex items-center gap-1.5 px-4 py-1.5 rounded dark:bg-[#00ff41] bg-emerald-600 text-black font-bold uppercase tracking-wider cursor-pointer disabled:opacity-40"
                            >
                              <Send className="w-3.5 h-3.5" />
                              {isDirectorMode ? 'Publish Official Answer' : 'Post Reply'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Footer helper note with Reset Data option */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl dark:bg-zinc-950 bg-slate-100 border dark:border-zinc-800 border-slate-300 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
          <span>
            Dr. Pouria personally reviews questions across all mechanical &amp; aerospace disciplines.
          </span>
        </div>
        <button
          onClick={handleResetData}
          className="flex items-center gap-1 text-[11px] text-zinc-500 hover:dark:text-zinc-300 hover:text-slate-800 cursor-pointer underline"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Q&amp;A Archive to Default
        </button>
      </div>
    </div>
  );
};
