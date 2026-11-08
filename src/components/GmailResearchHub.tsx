import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  Mail,
  Send,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Database,
  FileText,
  User as UserIcon,
  LogOut,
  Inbox,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Paperclip,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  auth,
  initAuth,
  googleSignIn,
  logout,
  saveEmailToFirestore,
  fetchUserSavedEmails,
  testConnection,
} from '../firebase';
import {
  fetchGmailProfile,
  listGmailMessages,
  getGmailMessage,
  sendGmailMessage,
  GmailMessageItem,
  GmailUserProfile,
} from '../utils/gmailClient';
import { useLanguage } from '../context/LanguageContext';

interface GmailResearchHubProps {
  onNotify?: (message: string, isError?: boolean) => void;
}

export const GmailResearchHub: React.FC<GmailResearchHubProps> = ({ onNotify }) => {
  const { language, t, isRTL } = useLanguage();

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<GmailUserProfile | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'inbox' | 'compose' | 'history'>('compose');

  // Inbox state
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageItem | null>(null);

  // Compose state
  const [toEmail, setToEmail] = useState('pouriarekavandi@gmail.com');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Firestore history state
  const [firestoreHistory, setFirestoreHistory] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Auth & Connection Initialization
  useEffect(() => {
    testConnection();

    const unsubscribe = initAuth(
      (authenticatedUser, token) => {
        setUser(authenticatedUser);
        if (token) {
          setAccessToken(token);
          loadProfile(token);
        }
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setProfile(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadProfile = async (token: string) => {
    try {
      const p = await fetchGmailProfile(token);
      setProfile(p);
    } catch (err) {
      console.warn('Could not fetch Gmail profile:', err);
    }
  };

  const handleSignIn = async () => {
    try {
      const { user: authedUser, accessToken: token } = await googleSignIn();
      setUser(authedUser);
      setAccessToken(token);
      loadProfile(token);
      if (onNotify) {
        onNotify(
          language === 'fa'
            ? `با موفقیت وارد شدید: ${authedUser.email}`
            : `Connected to Google Account: ${authedUser.email}`
        );
      }
    } catch (err: any) {
      console.error('Sign-in failure:', err);
      if (onNotify) {
        onNotify(err.message || 'Google Sign-In failed', true);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setAccessToken(null);
      setProfile(null);
      setMessages([]);
      setSelectedMessage(null);
      if (onNotify) {
        onNotify(language === 'fa' ? 'از حساب کاربری خارج شدید.' : 'Signed out of Google account.');
      }
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Fetch Inbox messages from Gmail
  const handleFetchMessages = async (query = '') => {
    if (!accessToken) {
      // Re-trigger sign in if access token is not in memory
      try {
        const { accessToken: token } = await googleSignIn();
        setAccessToken(token);
        fetchMessagesWithToken(token, query);
      } catch (err: any) {
        if (onNotify) onNotify('Please sign in with Google to read emails', true);
      }
      return;
    }

    fetchMessagesWithToken(accessToken, query);
  };

  const fetchMessagesWithToken = async (token: string, query = '') => {
    setIsLoadingMessages(true);
    try {
      const listData = await listGmailMessages(token, { query, maxResults: 10 });
      if (listData.messages && listData.messages.length > 0) {
        // Fetch details in parallel
        const detailPromises = listData.messages.slice(0, 10).map((m) => getGmailMessage(token, m.id));
        const detailedItems = await Promise.all(detailPromises);
        setMessages(detailedItems);
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Failed to load Gmail messages:', err);
      if (onNotify) {
        onNotify(`Could not fetch messages: ${err.message}`, true);
      }
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Load Firestore history
  const loadFirestoreHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const history = await fetchUserSavedEmails(user.uid);
      setFirestoreHistory(history);
    } catch (err) {
      console.warn('Error loading history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'inbox' && accessToken) {
      handleFetchMessages(searchQuery);
    } else if (activeSubTab === 'history' && user) {
      loadFirestoreHistory();
    }
  }, [activeSubTab, accessToken, user]);

  // Send email via Gmail API and save to Firestore
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail || !subject || !body) {
      if (onNotify) onNotify('Please complete all fields (To, Subject, and Body).', true);
      return;
    }

    let tokenToUse = accessToken;
    if (!tokenToUse) {
      try {
        const res = await googleSignIn();
        tokenToUse = res.accessToken;
        setAccessToken(tokenToUse);
        setUser(res.user);
      } catch (err: any) {
        if (onNotify) onNotify('Authentication required to send via Gmail.', true);
        return;
      }
    }

    setIsSending(true);
    try {
      const sendResult = await sendGmailMessage(tokenToUse, {
        to: toEmail,
        subject,
        body,
        fromEmail: user?.email || undefined,
      });

      // Save record to user's Firestore subcollection
      if (user) {
        await saveEmailToFirestore(user.uid, {
          to: toEmail,
          from: user.email || 'me',
          subject,
          body,
          snippet: body.slice(0, 120),
          type: 'sent',
        });
      }

      if (onNotify) {
        onNotify(t.gmail.sentSuccess[language]);
      }

      // Reset form
      setSubject('');
      setBody('');
    } catch (err: any) {
      console.error('Failed to send email via Gmail:', err);
      if (onNotify) {
        onNotify(`Send failed: ${err.message}`, true);
      }
    } finally {
      setIsSending(false);
    }
  };

  // Template auto-fill
  const applyTemplate = (tmpl: { subject: string; body: string; to?: string }) => {
    setSubject(tmpl.subject);
    setBody(tmpl.body);
    if (tmpl.to) setToEmail(tmpl.to);
    if (onNotify) {
      onNotify(language === 'fa' ? 'الگوی مکاتبه بارگذاری شد.' : 'Template loaded into editor.');
    }
  };

  const LAB_TEMPLATES = [
    {
      label: 'Reprint Request',
      labelFa: 'درخواست اصل مقاله',
      to: 'pouriarekavandi@gmail.com',
      subject: 'Research Inquiry & Reprint Request: Analytical Weight Functions in FGM Cylinders',
      body: `Dear Dr. Rekavandi,\n\nI have read your published research on analytical weight function formulations for functionally graded hollow cylinders under transient thermal shock. I would appreciate receiving an author reprint or Python post-processor scripts for numerical evaluation of stress intensity factors.\n\nThank you,\n${user?.displayName || '[Your Name]'}\n${user?.email || '[Your Institution]'}`,
    },
    {
      label: 'Graduate Research Position',
      labelFa: 'پذیرش پژوهشی دانشجویی',
      to: 'pouriarekavandi@gmail.com',
      subject: 'Inquiry Regarding Prospective MSc/PhD Research Opportunities (SWID-SHRK Lab)',
      body: `Dear Professor Hejazi Rekavandi,\n\nI am contacting you to inquire about open graduate research assistantships in your laboratory focusing on non-linear finite element analysis (Abaqus UMAT/VUMAT) and energy-absorbing cellular metamaterials.\n\nAttached are my academic CV and summary of research interests.\n\nSincerely,\n${user?.displayName || '[Your Name]'}\n${user?.email || '[Your Contact Information]'}`,
    },
    {
      label: 'Metamaterials Collaboration',
      labelFa: 'همکاری در متامتریال‌ها',
      to: 'pouriarekavandi@gmail.com',
      subject: 'Collaborative Testing Proposal: 3D AntiPrism Drop-Tower Impact Attenuation',
      body: `Dear SWID-SHRK Research Group,\n\nOur team is interested in exploring potential research synergy involving high-strain-rate impact testing, Split-Hopkinson pressure bar characterization, and numerical crashworthiness modeling.\n\nPlease let us know if you would be open to a brief virtual discussion.\n\nBest regards,\n${user?.displayName || '[Your Name]'}`,
    },
  ];

  return (
    <div className="space-y-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b dark:border-zinc-800 border-slate-200 pb-5">
        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider dark:text-[#00ff41] text-emerald-700 mb-1.5 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{t.gmail.badge[language]}</span>
          </div>
          <h2 className="font-section-title text-2xl sm:text-3xl font-bold uppercase tracking-wide dark:text-white text-slate-900">
            {t.gmail.title[language]}
          </h2>
          <p className="dark:text-zinc-400 text-slate-600 font-mono text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
            {t.gmail.subtitle[language]}
          </p>
        </div>

        {/* Authentication Button or User Status */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg dark:bg-zinc-900 bg-slate-100 border dark:border-zinc-700 border-slate-300">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-[#00ff41]" />
                )}
                <div className="text-left">
                  <span className="block font-bold text-[11px] dark:text-white text-slate-900 truncate max-w-[150px]">
                    {user.displayName || user.email}
                  </span>
                  <span className="text-[10px] text-zinc-400 block truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg border dark:border-zinc-700 border-slate-300 dark:bg-zinc-800 bg-white dark:hover:bg-red-950/40 hover:bg-red-50 hover:border-red-400 text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-pointer"
                title={t.gmail.signOut[language]}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.gmail.signOut[language]}</span>
              </button>
            </div>
          ) : (
            /* Official Google Sign-In Button as mandated by workspace integration standards */
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-white text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 font-medium text-xs shadow-xs transition-all cursor-pointer font-sans"
            >
              <svg className="w-4 h-4" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{t.gmail.signInWithGoogle[language]}</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-navigation Tabs */}
      <div className="flex items-center gap-2 p-1 rounded-xl dark:bg-[#0c1015] bg-slate-100 border dark:border-zinc-800 border-slate-200 font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('compose')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'compose'
              ? 'dark:bg-zinc-800 bg-white dark:text-[#00ff41] text-emerald-800 font-bold shadow-xs border dark:border-zinc-700 border-slate-300'
              : 'dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t.gmail.composeTab[language]}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inbox')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'inbox'
              ? 'dark:bg-zinc-800 bg-white dark:text-[#00ff41] text-emerald-800 font-bold shadow-xs border dark:border-zinc-700 border-slate-300'
              : 'dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>{t.gmail.inboxTab[language]}</span>
          {profile?.messagesTotal !== undefined && (
            <span className="text-[10px] opacity-70">({profile.messagesTotal})</span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
            activeSubTab === 'history'
              ? 'dark:bg-zinc-800 bg-white dark:text-[#00ff41] text-emerald-800 font-bold shadow-xs border dark:border-zinc-700 border-slate-300'
              : 'dark:text-zinc-400 text-slate-600 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>{t.gmail.historyTab[language]}</span>
        </button>
      </div>

      {/* Main Tab Views */}
      {activeSubTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
          {/* Email Composer Form */}
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-xl dark:bg-[#0c1015] bg-white border dark:border-zinc-800 border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
              <span className="font-bold dark:text-zinc-200 text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 dark:text-[#00ff41] text-emerald-600" />
                {t.gmail.composeTab[language]}
              </span>

              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-[#00ff41]" />
                <span>Authorized Gmail REST API</span>
              </div>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                  {t.gmail.toField[language]}
                </label>
                <input
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-3 py-2 text-xs font-mono dark:bg-[#070a0e] bg-slate-50 border dark:border-zinc-800 border-slate-300 rounded-lg dark:text-zinc-200 text-slate-900 focus:outline-none focus:border-[#00b8ff] dark:focus:border-[#00ff41]"
                />
              </div>

              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                  {t.gmail.subjectField[language]}
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject line..."
                  className="w-full px-3 py-2 text-xs font-mono dark:bg-[#070a0e] bg-slate-50 border dark:border-zinc-800 border-slate-300 rounded-lg dark:text-zinc-200 text-slate-900 focus:outline-none focus:border-[#00b8ff] dark:focus:border-[#00ff41]"
                />
              </div>

              <div>
                <label className="block text-zinc-500 dark:text-zinc-400 mb-1 font-bold">
                  {t.gmail.bodyField[language]}
                </label>
                <textarea
                  rows={8}
                  required
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message or select an academic template on the right..."
                  className="w-full px-3 py-2 text-xs font-mono dark:bg-[#070a0e] bg-slate-50 border dark:border-zinc-800 border-slate-300 rounded-lg dark:text-zinc-200 text-slate-900 focus:outline-none focus:border-[#00b8ff] dark:focus:border-[#00ff41] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-zinc-500">
                  {user ? (
                    <>Logged to Firestore: <strong className="text-zinc-400">/users/{user.uid}/emails</strong></>
                  ) : (
                    <span>Sign-in required to dispatch</span>
                  )}
                </span>

                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-black bg-[#00ff41] hover:bg-[#10b981] disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                >
                  <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-pulse' : ''}`} />
                  <span>{isSending ? t.gmail.sending[language] : t.gmail.sendBtn[language]}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Academic Templates */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl dark:bg-[#0c1015] bg-white border dark:border-zinc-800 border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold uppercase tracking-wider text-xs dark:text-zinc-200 text-slate-800 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.gmail.templatesTitle[language]}</span>
              </h3>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Click any pre-composed template to populate the editor with official laboratory correspondence:
              </p>

              <div className="space-y-2 pt-1">
                {LAB_TEMPLATES.map((tmpl, idx) => (
                  <div
                    key={idx}
                    onClick={() => applyTemplate(tmpl)}
                    className="p-3 rounded-lg border dark:border-zinc-800/80 border-slate-200 dark:hover:border-[#00b8ff] hover:border-sky-500 dark:bg-[#070a0e] bg-slate-50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between font-bold text-xs text-sky-700 dark:text-[#00b8ff]">
                      <span>{language === 'fa' ? tmpl.labelFa : tmpl.label}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] dark:text-zinc-400 text-slate-600 line-clamp-2 mt-1">
                      {tmpl.subject}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Firestore Persistence Notice */}
            <div className="p-4 rounded-xl dark:bg-[#0c1015] bg-emerald-50/50 border dark:border-zinc-800 border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold dark:text-[#00ff41] text-emerald-700">
                <Database className="w-3.5 h-3.5" />
                <span>Firestore Cloud Sync Active</span>
              </div>
              <p className="text-[11px] dark:text-zinc-400 text-slate-600 leading-relaxed">
                Sent inquiries and generated drafts are synchronized securely with the provisioned Firestore database (<code className="font-mono text-[10px]">ai-studio-swidshrk-...</code>).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inbox View */}
      {activeSubTab === 'inbox' && (
        <div className="p-5 sm:p-6 rounded-xl dark:bg-[#0c1015] bg-white border dark:border-zinc-800 border-slate-200 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b dark:border-zinc-800 border-slate-200">
            <span className="font-bold dark:text-zinc-200 text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Inbox className="w-4 h-4 dark:text-[#00ff41] text-emerald-600" />
              <span>{t.gmail.inboxTab[language]}</span>
            </span>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search className={`w-3.5 h-3.5 text-zinc-400 absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2`} />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFetchMessages(searchQuery);
                  }}
                  placeholder={t.gmail.searchPlaceholder[language]}
                  className={`w-full ${isRTL ? 'pr-8 pl-3' : 'pl-8 pr-3'} py-1.5 text-xs font-mono dark:bg-[#070a0e] bg-slate-50 border dark:border-zinc-800 border-slate-300 rounded-lg dark:text-zinc-200 text-slate-900 focus:outline-none`}
                />
              </div>

              <button
                onClick={() => handleFetchMessages(searchQuery)}
                disabled={isLoadingMessages}
                className="px-3 py-1.5 rounded-lg border dark:border-zinc-700 border-slate-300 dark:bg-zinc-800 bg-white hover:border-[#00ff41] transition-colors cursor-pointer flex items-center gap-1.5"
                title={t.gmail.refreshInbox[language]}
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingMessages ? 'animate-spin text-[#00ff41]' : ''}`} />
                <span className="hidden sm:inline">{t.gmail.refreshInbox[language]}</span>
              </button>
            </div>
          </div>

          {!user ? (
            <div className="p-8 text-center space-y-3">
              <Mail className="w-8 h-8 mx-auto text-zinc-500 opacity-60" />
              <h3 className="font-bold text-sm dark:text-zinc-200 text-slate-800">
                {t.gmail.notConnectedTitle[language]}
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                {t.gmail.notConnectedDesc[language]}
              </p>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 rounded-lg bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 font-bold transition-all cursor-pointer"
              >
                {t.gmail.signInWithGoogle[language]}
              </button>
            </div>
          ) : isLoadingMessages ? (
            <div className="p-8 text-center text-zinc-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#00ff41]" />
              <span>{t.gmail.loadingMessages[language]}</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <span>{t.gmail.noMessages[language]}</span>
            </div>
          ) : (
            <div className="divide-y dark:divide-zinc-800/80 divide-slate-100">
              {messages.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMessage(item)}
                  className="p-3.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs dark:text-white text-slate-900 truncate">
                        {item.from}
                      </span>
                      <span className="text-[10px] text-zinc-400">·</span>
                      <span className="text-[10px] text-zinc-400 truncate">{item.date}</span>
                    </div>

                    <h4 className="text-xs font-semibold dark:text-sky-300 text-sky-800 truncate">
                      {item.subject}
                    </h4>

                    <p className="text-[11px] dark:text-zinc-400 text-slate-600 line-clamp-1">
                      {item.snippet}
                    </p>
                  </div>

                  <span className="text-[10px] text-zinc-400 flex-none group-hover:text-sky-600">
                    Read ↗
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Firestore History View */}
      {activeSubTab === 'history' && (
        <div className="p-5 sm:p-6 rounded-xl dark:bg-[#0c1015] bg-white border dark:border-zinc-800 border-slate-200 shadow-sm space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
            <span className="font-bold dark:text-zinc-200 text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 dark:text-[#00ff41] text-emerald-600" />
              <span>Firestore Correspondence Records</span>
            </span>

            <button
              onClick={loadFirestoreHistory}
              disabled={isLoadingHistory}
              className="px-3 py-1.5 rounded-lg border dark:border-zinc-700 border-slate-300 dark:bg-zinc-800 bg-white hover:border-[#00ff41] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingHistory ? 'animate-spin text-[#00ff41]' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {!user ? (
            <div className="p-8 text-center text-zinc-400">
              Please sign in with Google to view your personal Firestore audit records.
            </div>
          ) : isLoadingHistory ? (
            <div className="p-8 text-center text-zinc-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#00ff41]" />
              <span>Querying Firestore...</span>
            </div>
          ) : firestoreHistory.length === 0 ? (
            <div className="p-8 text-center text-zinc-400">
              No saved email records found in your Firestore collection yet. Sent messages will be logged here automatically.
            </div>
          ) : (
            <div className="space-y-3">
              {firestoreHistory.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 rounded-lg dark:bg-[#070a0e] bg-slate-50 border dark:border-zinc-800 border-slate-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs dark:text-white text-slate-900">
                      {rec.subject}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded dark:bg-zinc-800 bg-white border dark:border-zinc-700 border-slate-200 dark:text-[#00ff41] text-emerald-700 font-bold uppercase">
                      {rec.type || 'sent'}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    <span>To: {rec.to}</span>
                    <span className="mx-2">·</span>
                    <span>Date: {rec.isoDate ? new Date(rec.isoDate).toLocaleString() : 'Recent'}</span>
                  </div>
                  <p className="text-xs dark:text-zinc-300 text-slate-700 whitespace-pre-wrap leading-relaxed mt-2 pt-2 border-t dark:border-zinc-800/60 border-slate-200">
                    {rec.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Message Viewer Modal */}
      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto dark:bg-[#0c1016] bg-white border dark:border-zinc-700 border-slate-300 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 font-mono text-xs"
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className="flex items-center justify-between pb-3 border-b dark:border-zinc-800 border-slate-200">
              <span className="font-bold uppercase tracking-wider dark:text-[#00ff41] text-emerald-700">
                Gmail Message Detail
              </span>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-zinc-400 hover:text-white p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h3 className="font-section-title text-base sm:text-lg font-bold dark:text-white text-slate-900">
              {selectedMessage.subject}
            </h3>

            <div className="space-y-1 text-zinc-500 text-[11px] p-3 rounded-lg dark:bg-[#070a0e] bg-slate-50 border dark:border-zinc-800 border-slate-200">
              <div><strong>From:</strong> {selectedMessage.from}</div>
              {selectedMessage.to && <div><strong>To:</strong> {selectedMessage.to}</div>}
              <div><strong>Date:</strong> {selectedMessage.date}</div>
            </div>

            <div className="pt-2 text-xs dark:text-zinc-200 text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[40vh] overflow-y-auto">
              {selectedMessage.bodyText || selectedMessage.snippet}
            </div>

            <div className="pt-4 border-t dark:border-zinc-800 border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  setToEmail(selectedMessage.from.match(/<([^>]+)>/)?.[1] || selectedMessage.from);
                  setSubject(`Re: ${selectedMessage.subject}`);
                  setSelectedMessage(null);
                  setActiveSubTab('compose');
                }}
                className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold cursor-pointer transition-colors"
              >
                Reply to Sender ↗
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="px-3.5 py-2 rounded-lg dark:bg-zinc-800 bg-slate-200 dark:text-zinc-200 text-slate-800 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
