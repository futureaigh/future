import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Settings,
  Inbox,
  LogOut,
  User,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import {
  db,
  auth,
  login,
  logout,
  collection,
  query,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDoc,
  onAuthStateChanged
} from "@/lib/firebase";
import { DEFAULT_CONTENT } from "@/lib/defaultContent";
import { handleFirestoreError, OperationType, cn } from "@/lib/utils";
import { SiteContentRecord, ContactSubmission } from "@/types";
import SectionEditor from "@/components/admin/SectionEditor";
import { toast } from "sonner";

const INTEREST_LABELS = {
  attend_event: "Attend an Event",
  volunteer: "Volunteer / Speaker",
  scholarship: "Scholarship Support",
  financial_support: "Financial Support",
  partnership: "Partnership / Organisation",
  other: "Other",
};

const SECTIONS = [
  { key: "navbar", label: "Navbar / Header", emoji: "🔝" },
  { key: "branding", label: "Branding (Logos & Favicon)", emoji: "🖼️" },
  { key: "seo", label: "SEO Metadata", emoji: "🔍" },
  { key: "hero", label: "Hero Section", emoji: "🏠" },
  { key: "about", label: "About Section", emoji: "ℹ️" },
  { key: "missionVision", label: "Mission & Vision", emoji: "🎯" },
  { key: "objectives", label: "Key Objectives", emoji: "🚩" },
  { key: "empowering", label: "Empowering Students", emoji: "🎓" },
  { key: "whychoose", label: "Why Choose TTC", emoji: "⭐" },
  { key: "getInvolved", label: "Get Involved", emoji: "🤝" },
  { key: "education", label: "Investing in Education", emoji: "📚" },
  { key: "partnershipRewards", label: "Partnership Rewards", emoji: "🎁" },
  { key: "thankYou", label: "Thank You Note", emoji: "🙏" },
  { key: "contact", label: "Contact & Footer", emoji: "📞" },
];

export default function Admin() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [tab, setTab] = useState("content");
  const [user, setUser] = useState(auth.currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Check if admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', u.uid));
          const isWhitelisted = u.email === 'nokofinespace@gmail.com';
          setIsAdmin(adminDoc.exists() || isWhitelisted);
        } catch (e) {
          setIsAdmin(u.email === 'nokofinespace@gmail.com');
        }
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
  }, []);

  const { data: submissions = [] } = useQuery({
    queryKey: ["contact-submissions"],
    queryFn: async () => {
      try {
        const q = query(collection(db, "submissions"), orderBy("created_date", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ContactSubmission));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "submissions");
        return [];
      }
    },
    enabled: isAdmin,
  });

  const { data: records = [], isLoading: contentLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      try {
        const snapshot = await getDocs(collection(db, "site_content"));
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SiteContentRecord));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, "site_content");
        return [];
      }
    },
    enabled: isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: async ({ sectionKey, content }: { sectionKey: string; content: any }) => {
      const existing = records.find((r) => r.section_key === sectionKey);
      try {
        if (existing) {
          await updateDoc(doc(db, "site_content", existing.id), {
            content,
            updated_at: serverTimestamp(),
          });
        } else {
          await addDoc(collection(db, "site_content"), {
            section_key: sectionKey,
            content,
            updated_at: serverTimestamp(),
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `site_content/${sectionKey}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
      toast.success("Section updated successfully!");
    },
  });

  const getSectionData = (key: string) => {
    const record = records.find((r) => r.section_key === key);
    if (record) return { ...(DEFAULT_CONTENT as any)[key], ...record.content };
    return (DEFAULT_CONTENT as any)[key] || {};
  };

  if (authLoading || (user && isAdmin && contentLoading)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-50/50 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Syncing Content...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 text-sm">Please sign in with your authorized Google account to manage the website content.</p>
          </div>
          <button
            onClick={() => login()}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all hover:bg-gray-800 active:scale-[0.98]"
          >
            <img src={getSectionData('branding').adminLogo || "https://www.google.com/favicon.ico"} className="w-5 h-5 object-contain" alt="Login" />
            Sign in with Google
          </button>
          <Link to="/" className="block text-xs text-gray-400 font-medium hover:text-gray-600 pt-2 transition-colors">
            Back to public site
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 text-center space-y-6 border-t-4 border-red-500">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Unauthorized Access</h1>
            <p className="text-gray-500 text-sm">Your account ({user.email}) is not authorized to access this portal.</p>
          </div>
          <button
            onClick={() => logout()}
            className="w-full px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold transition-all hover:bg-gray-200"
          >
            Sign in with a different account
          </button>
          <Link to="/" className="block text-xs text-gray-400 font-medium hover:text-gray-600 pt-2 transition-colors">
            Back to public site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans">
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-10 flex items-center justify-center overflow-hidden">
                {getSectionData('branding').adminLogo ? (
                  <img src={getSectionData('branding').adminLogo} className="h-full w-auto object-contain max-w-[120px]" />
                ) : (
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black p-1 shadow-inner text-sm">TTC</div>
                )}
              </div>
              <span className="font-extrabold text-gray-900 tracking-tight text-xs uppercase hidden sm:inline">Admin Portal</span>
            </div>

            <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 hover:bg-gray-100/80 active:scale-[0.98] text-gray-600 hover:text-gray-900 font-extrabold text-[11px] rounded-xl transition-all uppercase tracking-wider"
              id="back-to-home-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-2xl">
            <button
              onClick={() => setTab("content")}
              className={cn(
                "flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all",
                tab === "content" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Settings className="w-4 h-4" /> Content
            </button>
            <button
              onClick={() => setTab("submissions")}
              className={cn(
                "flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all",
                tab === "submissions" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              )}
            >
              <Inbox className="w-4 h-4" /> Enquiries
              {submissions.length > 0 && (
                <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {submissions.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Admin User</p>
                <p className="text-xs font-bold text-gray-900 leading-none">{user.email}</p>
             </div>
             <button
              onClick={() => logout()}
              className="w-10 h-10 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
             >
              <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {tab === "submissions" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Active Enquiries</h1>
              <p className="text-sm text-gray-500 mt-2">Incoming messages from the website 'Get Involved' form.</p>
            </div>

            {submissions.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Inbox className="w-6 h-6 text-gray-300" />
                </div>
                <p className="text-gray-400 font-medium">No submissions to display yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {submissions.map((s) => (
                  <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <h3 className="font-black text-gray-900">{s.name}</h3>
                           <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {INTEREST_LABELS[s.interest] || s.interest}
                           </span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-gray-400 font-medium">
                          <span className="flex items-center gap-1.5"><User className="w-3 h-3" /> {s.email}</span>
                          {s.phone && <span className="hidden sm:inline opacity-30">•</span>}
                          {s.phone && <span>{s.phone}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                         {s.created_date?.toDate ? s.created_date.toDate().toLocaleDateString() : 'Just now'}
                      </span>
                    </div>
                    {s.message && (
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 leading-relaxed italic">"{s.message}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "content" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Manage Content</h1>
              <p className="text-sm text-gray-500 mt-2">Update the live text, images and sections of your organization website.</p>
            </div>

            <div className="space-y-4">
              {SECTIONS.map((section) => (
                <div
                  key={section.key}
                  className={cn(
                    "bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300",
                    openSection === section.key ? "ring-2 ring-blue-500/10 shadow-xl shadow-gray-200/50" : "hover:border-gray-200"
                  )}
                >
                  <button
                    onClick={() => setOpenSection(openSection === section.key ? null : section.key)}
                    className="w-full flex items-center justify-between px-8 py-6 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-300">
                         {section.emoji}
                      </div>
                      <div className="text-left">
                        <span className="block font-black text-gray-900 text-lg tracking-tight leading-none mb-1">
                          {section.label}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                           {section.key.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-full transition-all",
                      openSection === section.key ? "bg-blue-600 text-white rotate-180" : "text-gray-300 group-hover:text-gray-600"
                    )}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {openSection === section.key && (
                    <div className="px-8 pb-8 border-t border-gray-50 animate-in slide-in-from-top-4 duration-300">
                      <div className="pt-8">
                        <SectionEditor
                          key={section.key}
                          sectionKey={section.key}
                          data={getSectionData(section.key)}
                          onSave={(content) => saveMutation.mutate({ sectionKey: section.key, content })}
                          isSaving={saveMutation.isPending}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
