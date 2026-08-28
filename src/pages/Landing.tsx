import { useState, useRef, useEffect, FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useScroll, useTransform } from "motion/react";
import {
  ChevronRight,
  ArrowRight,
  Users,
  CheckCircle2,
  Loader2,
  Menu,
  X,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Phone
} from "lucide-react";
import { db, collection, getDocs, addDoc, serverTimestamp } from "@/lib/firebase";
import { DEFAULT_CONTENT } from "@/lib/defaultContent";
import { SiteContentRecord } from "@/types";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const contactRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: records = [], isLoading } = useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "site_content"));
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as SiteContentRecord));
    },
  });

  const getSectionData = (key: string) => {
    const record = records.find((r) => r.section_key === key);
    if (record) return { ...(DEFAULT_CONTENT as any)[key], ...record.content };
    return (DEFAULT_CONTENT as any)[key] || {};
  };

  const content = {
    hero: getSectionData("hero"),
    about: getSectionData("about"),
    missionVision: getSectionData("missionVision"),
    objectives: getSectionData("objectives"),
    empowering: getSectionData("empowering"),
    whychoose: getSectionData("whychoose"),
    getInvolved: getSectionData("getInvolved"),
    education: getSectionData("education"),
    partnershipRewards: getSectionData("partnershipRewards"),
    thankYou: getSectionData("thankYou"),
    contact: getSectionData("contact"),
    navbar: getSectionData("navbar"),
    branding: getSectionData("branding"),
    seo: getSectionData("seo"),
  };

  const { scrollY } = useScroll();

  const headerBg = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.9)"]);
  const headerBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
  const headerShadow = useTransform(scrollY, [0, 50], ["none", "0 10px 30px -10px rgba(0,0,0,0.05)"]);

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      interest: formData.get("interest"),
      message: formData.get("message"),
      created_date: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "submissions"), data);
      setSubmitted(true);
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#071329] flex flex-col items-center justify-center z-50">
        <div className="relative flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-[-12px] rounded-full border border-blue-400/10 animate-ping duration-1000"></div>
            <div className="w-14 h-14 border-4 border-slate-800 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
          <div className="mt-8 text-center space-y-2">
            <h2 className="text-white text-lg font-black tracking-widest uppercase">Turn To Christ</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest animate-pulse">
              Loading Website Content...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <Helmet>
        <title>{content.seo.title}</title>
        <link rel="icon" type="image/x-icon" href={content.branding.favicon} />
        <meta name="description" content={content.seo.description} />
        <meta name="keywords" content={content.seo.keywords} />
        <meta property="og:title" content={content.seo.title} />
        <meta property="og:description" content={content.seo.description} />
        <meta property="og:image" content={content.seo.ogImage} />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* Navbar */}
      <motion.nav
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur, boxShadow: headerShadow }}
        className="fixed top-0 left-0 right-0 z-[100] h-20 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={`h-12 flex items-center justify-center overflow-hidden rounded-xl transition-all duration-300 p-1 ${isScrolled ? 'bg-transparent' : 'bg-white/10 backdrop-blur-sm shadow-sm'}`}>
                <img src={content.branding.headerLogo || content.navbar.logoUrl} className="h-full w-auto object-contain max-w-[180px]" />
             </div>
             <div className="flex flex-col -space-y-1">
                <span className={`text-lg font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`}>{content.navbar.logoText}</span>
                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{content.navbar.logoSub}</span>
             </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {content.navbar.links.map((link: any) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-[13px] font-bold transition-colors duration-300 ${isScrolled ? 'text-gray-600 hover:text-blue-600' : 'text-gray-100 hover:text-orange-400'}`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
             <button className="px-6 py-2 bg-orange-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20">
                <Users className="w-4 h-4" /> {content.navbar.ctaOrange}
             </button>
             <button
               onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
               className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all"
             >
                {content.navbar.ctaBlue}
             </button>
          </div>

          <button 
            className={`lg:hidden transition-colors duration-300 ${isScrolled ? 'text-gray-900' : 'text-white'}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-20 left-0 right-0 bg-white border-b border-gray-100 p-6 lg:hidden shadow-xl"
          >
            <div className="flex flex-col gap-4">
              {content.navbar.links.map((link: any) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-bold text-gray-900"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-50">
                <button className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold">
                   {content.navbar.ctaOrange}
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    contactRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold"
                >
                  {content.navbar.ctaBlue}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0a1a3a]">
        <div className="absolute inset-0">
           <img src={content.hero.imageUrl} className="w-full h-full object-cover opacity-30 select-none" />
           <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a3a] via-[#0a1a3a]/80 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/20">
                {content.hero.subtitle}
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">
                {content.hero.title}
              </h1>
              <div className="space-y-4">
                 <p className="text-xl text-blue-100 font-medium leading-relaxed max-w-xl">
                    {content.hero.description}
                 </p>
                 <div className="pl-4 border-l-2 border-orange-500 py-1">
                    <p className="text-lg text-orange-400 font-bold italic tracking-tight underline-offset-4 decoration-orange-500/30 underline decoration-2">
                       {content.hero.quote}
                    </p>
                 </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button
                onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-orange-600 text-white rounded-xl font-black text-lg hover:bg-orange-700 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-2xl shadow-orange-600/30"
              >
                {content.hero.ctaPrimary} <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 border-2 border-white/20 text-white rounded-xl font-black text-lg hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm"
              >
                {content.hero.ctaSecondary}
              </button>
              <button
                className="px-8 py-4 bg-blue-600/90 text-white rounded-xl font-black text-lg hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg"
              >
                <Users className="w-5 h-5" /> {content.hero.ctaBlue}
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 w-full leading-none z-20">
           <svg className="w-full h-12 fill-white" viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
           </svg>
        </div>
      </section>


      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="relative group">
               <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative">
                  <img src={content.about.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-all duration-700"></div>
                  
                  {/* Location badge */}
                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 border border-white/20">
                     <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                     <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{content.about.location}</span>
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                    {content.about.title}
                  </h2>
                  <p className="text-xl font-bold text-blue-600">
                    {content.about.subtitle}
                  </p>
               </div>
               <div className="text-gray-600 font-medium leading-relaxed whitespace-pre-line space-y-4">
                  {content.about.text}
               </div>
               
               <div className="grid grid-cols-2 gap-4 pt-4">
                  {content.about.stats.map((stat: any) => (
                    <div key={stat.label} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-center">
                      <p className="text-3xl font-black text-blue-700 tracking-tight">{stat.value}</p>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-5xl font-black text-gray-900 tracking-tight">
                {content.missionVision.title}
             </h2>
             <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
             {/* Mission Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="p-10 bg-blue-700 text-white rounded-[40px] shadow-2xl relative overflow-hidden"
             >
                <div className="relative z-10 space-y-6">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                   </div>
                   <h3 className="text-3xl font-black tracking-tight">{content.missionVision.mission.title}</h3>
                   <p className="text-lg text-blue-50 font-medium leading-relaxed">
                      {content.missionVision.mission.text}
                   </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             </motion.div>

             {/* Vision Card */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="p-10 border-2 border-blue-600 rounded-[40px] shadow-xl relative overflow-hidden bg-white"
             >
                <div className="relative z-10 space-y-6">
                   <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">👁️</span>
                   </div>
                   <h3 className="text-3xl font-black text-blue-600 tracking-tight">{content.missionVision.vision.title}</h3>
                   <p className="text-lg text-gray-600 font-medium leading-relaxed">
                      {content.missionVision.vision.text}
                   </p>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 opacity-50"></div>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                 {content.objectives.title}
              </h2>
              <p className="text-gray-500 font-medium max-w-2xl mx-auto italic">
                 {content.objectives.subtitle}
              </p>
              <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {content.objectives.list.map((item: any, i: number) => (
                <div key={i} className="p-10 bg-white rounded-[40px] shadow-sm border border-gray-100 flex flex-col gap-6 hover:shadow-xl transition-all">
                   <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-xl">
                      {i + 1}
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{item.title}</h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                         {item.text}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Empowering Students Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-20">
           <div className="text-center space-y-4 animate-in fade-in duration-700">
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                 {content.empowering.title}
              </h2>
              <p className="text-gray-500 font-medium max-w-3xl mx-auto">
                 {content.empowering.subtitle}
              </p>
              <div className="w-20 h-2 bg-blue-600 mx-auto rounded-full"></div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.empowering.list.map((item: any, i: number) => (
                <motion.div 
                   whileHover={{ y: -10 }}
                   key={i} 
                   className="group bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                >
                   <div className="aspect-[16/10] overflow-hidden">
                      <img src={item.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   </div>
                   <div className="p-8 space-y-4">
                      <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                         {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed">
                         {item.description}
                      </p>
                   </div>
                </motion.div>
              ))}
           </div>

           {/* Scholarship Highlight Card */}
           <div className="relative rounded-[50px] overflow-hidden bg-blue-900 text-white min-h-[400px] flex items-center shadow-3xl">
              <img src={content.empowering.fullCard.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/60 to-transparent"></div>
              <div className="relative z-10 p-12 md:p-20 max-w-2xl space-y-8">
                 <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl">
                    🎓
                 </div>
                 <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight">{content.empowering.fullCard.title}</h2>
                    <p className="text-xl text-blue-100 font-medium leading-relaxed">
                       {content.empowering.fullCard.description}
                    </p>
                 </div>
                 <button className="px-10 py-4 bg-white text-blue-900 rounded-full font-black text-lg hover:bg-blue-50 transition-all flex items-center gap-3">
                    Learn More <ArrowRight className="w-5 h-5" />
                 </button>
              </div>
           </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{content.whychoose.subtitle}</span>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                 {content.whychoose.title}
              </h2>
              <p className="text-gray-500 font-medium max-w-3xl mx-auto">
                 {content.whychoose.description}
              </p>
              <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
           </div>

           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="grid grid-cols-2 gap-4">
                 {content.whychoose.points.map((point: any, i: number) => (
                   <div key={i} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 space-y-4 hover:shadow-xl transition-all">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                         <span className="text-xl">
                            {["✝️", "📚", "🤝", "🌱"][i]}
                         </span>
                      </div>
                      <h4 className="text-lg font-black text-gray-900 tracking-tight">{point.title}</h4>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                        {point.text}
                      </p>
                   </div>
                 ))}
              </div>

              <div className="relative group">
                 <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl">
                    <img src={content.whychoose.imageUrl} className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute bottom-6 left-6 -translate-x-1/2 translate-y-1/2 md:translate-x-0 md:translate-y-0 md:-left-8 md:bottom-12 bg-blue-600 p-8 rounded-[30px] shadow-2xl text-center space-y-1 min-w-[200px]">
                    <p className="text-4xl font-black text-white">{content.whychoose.badgeText}</p>
                    <p className="text-xs font-bold text-blue-100 uppercase tracking-widest leading-none">{content.whychoose.badgeSub}</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section id="get-involved" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                 {content.getInvolved.title}
              </h2>
              <p className="text-gray-500 font-medium italic">
                 {content.getInvolved.subtitle}
              </p>
              <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {content.getInvolved.list.map((item: any, i: number) => (
                <div key={i} className="p-10 bg-white rounded-[40px] shadow-lg text-center space-y-6 hover:shadow-2xl transition-all">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl mx-auto flex items-center justify-center text-4xl">
                      {["📢", "👩‍🏫", "💛"][i]}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{item.title}</h3>
                   <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {item.text}
                   </p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={contactRef} id="contact" className="py-24 bg-white relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
           <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-16 text-center space-y-10">
              <div className="space-y-4">
                 <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                    {content.contact.title}
                 </h2>
                 <p className="text-gray-500 font-medium underline underline-offset-8 decoration-blue-200">
                    {content.contact.subtitle}
                 </p>
              </div>

              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-12">
                   <div className="w-20 h-20 bg-green-50 rounded-full mx-auto flex items-center justify-center text-green-500 text-4xl">
                      ✅
                   </div>
                   <p className="text-2xl font-black text-gray-900">Message Received!</p>
                   <button onClick={() => setSubmitted(false)} className="text-blue-600 font-bold hover:underline">Send another message</button>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="grid md:grid-cols-2 gap-8 text-left">
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Name *</label>
                      <input required name="name" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" placeholder="Your name" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Email *</label>
                      <input required name="email" type="email" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" placeholder="you@email.com" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone (Optional)</label>
                      <input name="phone" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold" placeholder="+1 234 567 8900" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">I want to... *</label>
                      <select name="interest" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold appearance-none">
                         <option>Select an option</option>
                         <option value="attend_event">Attend an Event</option>
                         <option value="volunteer">Volunteer / Speaker</option>
                         <option value="scholarship">Scholarship Support</option>
                         <option value="partnership">Partnership / Organisation</option>
                         <option value="other">Other</option>
                      </select>
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Message (Optional)</label>
                      <textarea name="message" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold min-h-[120px]" placeholder="Tell us more about how you'd like to get involved..."></textarea>
                   </div>
                   <div className="md:col-span-2 pt-4">
                      <button disabled={isSubmitting} type="submit" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20">
                         {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Send Message"}
                      </button>
                   </div>
                </form>
              )}
           </div>
        </div>
      </section>

      {/* Education Banner */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
           <div className="space-y-4 max-w-xl">
              <h2 className="text-4xl font-black tracking-tight uppercase leading-none">
                 {content.education.title}
              </h2>
              <div className="flex flex-col gap-3">
                 {content.education.points.map((point: string, i: number) => (
                    <div key={i} className="flex items-start gap-3">
                       <CheckCircle2 className="w-5 h-5 text-blue-300 mt-0.5 flex-shrink-0" />
                       <p className="text-lg font-bold text-blue-50 leading-tight">{point}</p>
                    </div>
                 ))}
              </div>
           </div>
           <div className="hidden lg:block w-px h-32 bg-white/20"></div>
           <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-xs font-black text-blue-300 uppercase tracking-[0.2em]">Our Commitment</p>
              <p className="text-3xl font-black">Transforming Communities</p>
           </div>
        </div>
      </section>

      {/* Partnership Rewards Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-5xl font-black text-gray-900 tracking-tight uppercase tracking-tighter">
                 {content.partnershipRewards.title}
              </h2>
              <p className="text-gray-500 font-medium italic">
                 {content.partnershipRewards.subtitle}
              </p>
              <div className="w-16 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              {content.partnershipRewards.list.map((item: any, i: number) => (
                <div key={i} className="p-10 bg-gray-50 rounded-[40px] shadow-sm border border-gray-100 space-y-6 hover:shadow-xl transition-all h-full">
                   <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      {i === 0 ? <Users className="w-7 h-7" /> : i === 1 ? <span className="text-2xl">$</span> : <span className="text-2xl">🎓</span>}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight">{item.title}</h3>
                   <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {item.text}
                   </p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-24 px-6">
         <div className="max-w-7xl mx-auto bg-blue-700 rounded-[50px] p-12 md:p-24 text-center text-white space-y-12 shadow-3xl shadow-blue-700/30 relative overflow-hidden">
            <div className="relative z-10 space-y-8">
               <h2 className="text-4xl md:text-5xl font-black tracking-tight">{content.thankYou.title}</h2>
               <div className="max-w-3xl mx-auto space-y-8">
                  <p className="text-xl md:text-2xl font-bold leading-relaxed opacity-90">
                    {content.thankYou.text}
                  </p>
                  <p className="text-lg opacity-70 leading-relaxed italic">
                    {content.thankYou.subtext}
                  </p>
               </div>
               <div className="pt-8">
                  <button className="px-12 py-5 bg-orange-500 text-white rounded-full font-black text-xl hover:bg-orange-600 transition-all shadow-2xl shadow-orange-500/40">
                     {content.thankYou.cta}
                  </button>
               </div>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c1626] text-white py-24 relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16 relative z-10">
            <div className="space-y-8 col-span-1 md:col-span-2">
               <div className="flex items-center gap-3">
                  <div className="h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-xl p-1 shadow-sm">
                     <img src={content.branding.footerLogo || content.branding.headerLogo || content.navbar.logoUrl} className="h-full w-auto object-contain max-w-[180px]" />
                  </div>
                  <div className="flex flex-col -space-y-1">
                     <span className="text-xl font-black tracking-tight">{content.navbar.logoText}</span>
                     <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">{content.navbar.logoSub}</span>
                  </div>
               </div>
               <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm">
                  {content.hero.subtitle} — committed to fostering holistic development among students.
               </p>
               <div className="flex items-center gap-4">
                  {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                    <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors">
                       <Icon className="w-4 h-4 text-gray-400" />
                    </a>
                  ))}
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Contact Us</h4>
               <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-bold text-gray-300">{content.contact.email}</span>
               </div>
            </div>

            <div className="space-y-6">
               <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Phone Numbers</h4>
               <div className="space-y-4">
                  {content.contact.phones.map((phone: any) => (
                    <div key={phone.label} className="flex gap-3">
                       <Phone className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                       <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-300">{phone.value}</span>
                          <span className="text-[10px] font-bold text-gray-500 uppercase">({phone.label})</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 pt-16 mt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-bold text-gray-500">
               © {new Date().getFullYear()} {content.navbar.logoText} Commission. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
               <Link to="/admin" className="text-[10px] font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest">Admin Dashboard</Link>
               <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  Made with <span className="text-red-500 text-sm">❤️</span> for the Gospel
               </p>
            </div>
         </div>

         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] -translate-x-1/3 translate-y-1/2"></div>
      </footer>
    </div>
  );
}
