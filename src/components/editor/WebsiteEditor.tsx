import { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Save, 
  Eye, 
  Settings2, 
  Type, 
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Loader2,
  Globe,
  LayoutDashboard,
  Layers,
  MousePointer2,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Undo2,
  Redo2,
  Sparkles,
  Library,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  X,
  BarChart3,
  BookOpen,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import ErrorBoundary from '../ui/ErrorBoundary';

import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

// Import Landing Components for Real Preview
import Hero from '../landing/Hero';
import Courses from '../landing/Courses';
import HybridLearning from '../landing/HybridLearning';
import WhySkillabs from '../landing/WhySkillabs';
import HowItWorks from '../landing/HowItWorks';
import CTA from '../landing/CTA';
import Stats from '../landing/Stats';
import ApplicationForm from '../landing/ApplicationForm';
import Footer from '../layout/Footer';

interface Section {
  id: string;
  type: 'hero' | 'courses' | 'hybrid' | 'why' | 'how' | 'cta' | 'stats' | 'apply' | 'footer';
  content: any;
}

interface PortalConfig {
  welcomeMessage: string;
  announcement: string;
}

interface SiteConfig {
  brandColor: string;
  logoText: string;
  showAnnouncement: boolean;
}

const initialSections: Section[] = [
  { id: 'hero-1', type: 'hero', content: { title: 'Master Lifelong Skills with Skillabs', subtitle: 'Expert-led sessions in WSC Coaching, Coding & Robotics, and Public Speaking', ctaPrimary: 'Get Started', ctaSecondary: 'Explore Courses' } },
  { id: 'stats-1', type: 'stats', content: { stats: [{ label: 'Active Students', value: '2,500+' }, { label: 'Expert Mentors', value: '50+' }, { label: 'Courses Offered', value: '12+' }, { label: 'Success Rate', value: '98%' }] } },
  { id: 'courses-1', type: 'courses', content: { title: 'Explore Our Expert-Led Courses', subtitle: 'Choose from our specialized programs designed to build real-world skills.' } },
  { id: 'hybrid-1', type: 'hybrid', content: { title: 'The Best of Both Worlds: Hybrid Learning', description: 'At Skillabs, we believe learning should fit your lifestyle.' } },
  { id: 'why-1', type: 'why', content: { title: 'Why Choose Skillabs?', subtitle: 'We provide a premium educational experience that focuses on your long-term success.' } },
  { id: 'how-1', type: 'how', content: { title: 'How It Works', subtitle: 'Start your skill journey in four simple steps.' } },
  { id: 'apply-1', type: 'apply', content: { title: 'Start Your Journey', description: 'Fill out the form below and our team will get back to you within 24 hours.' } },
  { id: 'cta-1', type: 'cta', content: { title: 'Unlock Your Potential with Skillabs.', subtitle: 'Join our community of lifelong learners and master the skills that matter.' } },
  { id: 'footer-1', type: 'footer', content: { description: 'Empowering individuals with lifelong skills through expert-led hybrid learning. Learn. Achieve. Become.', email: 'hello@skillabs.edu', phone: '+1 (555) 123-4567', address: '123 Skill St, Education City', socialLinks: { instagram: '#', twitter: '#', linkedin: '#' } } },
];

const sectionComponents: Record<string, any> = {
  hero: Hero,
  courses: Courses,
  hybrid: HybridLearning,
  why: WhySkillabs,
  how: HowItWorks,
  cta: CTA,
  stats: Stats,
  apply: ApplicationForm,
  footer: Footer,
};

const librarySections = [
  { type: 'hero', name: 'Hero Header', icon: Layout, description: 'Main introduction section with CTA' },
  { type: 'stats', name: 'Statistics', icon: BarChart3, description: 'Display key metrics and numbers' },
  { type: 'courses', name: 'Course Grid', icon: BookOpen, description: 'Showcase your available courses' },
  { type: 'hybrid', name: 'Hybrid Info', icon: Globe, description: 'Explain your learning model' },
  { type: 'why', name: 'Features', icon: Sparkles, description: 'Highlight benefits and features' },
  { type: 'how', name: 'Process Steps', icon: Layers, description: 'Explain how the platform works' },
  { type: 'apply', name: 'Application Form', icon: FileText, description: 'Lead generation form' },
  { type: 'cta', name: 'Call to Action', icon: MousePointer2, description: 'Final push for conversion' },
  { type: 'footer', name: 'Footer', icon: Layout, description: 'Contact info and social links' },
];

export default function WebsiteEditor() {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [portalConfig, setPortalConfig] = useState<PortalConfig>({
    welcomeMessage: "You're making great progress. Keep it up!",
    announcement: "New Robotics Workshop starting next week!"
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    brandColor: '#F27D26',
    logoText: 'Skillabs',
    showAnnouncement: true
  });
  const [activeRail, setActiveRail] = useState<'library' | 'structure' | 'portal' | 'config' | 'courses'>('structure');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isHistoryAction, setIsHistoryAction] = useState(false);

  // Save to history when sections change
  useEffect(() => {
    if (!loading && sections.length > 0 && !isHistoryAction) {
      const currentSections = JSON.stringify(sections);
      const lastHistory = history[historyIndex];
      if (currentSections !== lastHistory) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(currentSections);
        // Limit history to 50 steps
        if (newHistory.length > 50) newHistory.shift();
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
    setIsHistoryAction(false);
  }, [sections, loading]);

  const undo = () => {
    if (historyIndex > 0) {
      setIsHistoryAction(true);
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setSections(JSON.parse(history[prevIndex]));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setIsHistoryAction(true);
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSections(JSON.parse(history[nextIndex]));
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.warn('Editor loading timed out, forcing render.');
        setLoading(false);
      }
    }, 8000); // 8 second fallback for slow connections

    const unsubscribe = onSnapshot(doc(db, 'config', 'landing-page'), (doc) => {
      try {
        if (doc.exists()) {
          const data = doc.data();
          if (data.sections && Array.isArray(data.sections)) setSections(data.sections);
          if (data.portal) setPortalConfig(prev => ({ ...prev, ...data.portal }));
          if (data.site) setSiteConfig(prev => ({ ...prev, ...data.site }));
        }
        setLoading(false);
        setError(null);
        clearTimeout(timeoutId);
      } catch (err) {
        console.error('Data Processing Error:', err);
        setError('Failed to process landing page data.');
        setLoading(false);
      }
    }, (err) => {
      console.error('Editor Load Error:', err);
      setError('Failed to connect to the database. Please check your connection.');
      setLoading(false);
      clearTimeout(timeoutId);
    });

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const addSection = (type: string) => {
    const newId = `${type}-${Date.now()}`;
    const template = initialSections.find(s => s.type === type) || { content: { title: `New ${type} Section` } };
    const newSection: Section = {
      id: newId,
      type: type as any,
      content: JSON.parse(JSON.stringify(template.content))
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newId);
    setActiveRail('structure');
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
    if (activeSectionId === id) setActiveSectionId(null);
  };

  const updateSectionContent = (id: string, newContent: any) => {
    setSections(sections.map(s => s.id === id ? { ...s, content: { ...s.content, ...newContent } } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'config', 'landing-page'), { 
        sections,
        portal: portalConfig,
        site: siteConfig,
        updatedAt: new Date().toISOString()
      });
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      handleFirestoreError(error, OperationType.WRITE, 'config/landing-page');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999]">
        <div className="text-center">
          <div className="relative mb-8">
            <Loader2 className="w-16 h-16 text-accent animate-spin mx-auto" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Initializing Editor</h2>
          <p className="text-primary/60 font-medium max-w-xs mx-auto">Preparing your creative workspace. This will only take a moment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999] p-6">
        <div className="max-w-md w-full text-center p-8 bg-red-50 rounded-3xl border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-4">Connection Issue</h2>
          <p className="text-primary/60 mb-8">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F0F2F5] flex overflow-hidden z-[9999]">
      {/* Left Rail - Canva Style */}
      <div className="w-[72px] bg-primary flex flex-col items-center py-6 gap-4 z-20">
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-accent/20">
          <Sparkles size={24} className="text-white" />
        </div>
        
        <button 
          onClick={() => { setActiveRail('library'); setSidebarOpen(true); }}
          className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
            activeRail === 'library' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <Library size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Elements</span>
        </button>

        <button 
          onClick={() => { setActiveRail('structure'); setSidebarOpen(true); }}
          className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
            activeRail === 'structure' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <Layers size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Layers</span>
        </button>

        <button 
          onClick={() => { setActiveRail('portal'); setSidebarOpen(true); }}
          className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
            activeRail === 'portal' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Portal</span>
        </button>

        <button 
          onClick={() => { setActiveRail('config'); setSidebarOpen(true); }}
          className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
            activeRail === 'config' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <Palette size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Brand</span>
        </button>

        <button 
          onClick={() => { setActiveRail('courses'); setSidebarOpen(true); }}
          className={cn(
            "w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 transition-all",
            activeRail === 'courses' ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
          )}
        >
          <BookOpen size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Courses</span>
        </button>

        <div className="mt-auto flex flex-col gap-4">
          <a 
            href="/" 
            target="_blank" 
            className="w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 text-white/40 hover:text-white transition-all"
          >
            <ExternalLink size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Live</span>
          </a>
        </div>
      </div>

      {/* Secondary Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div 
            initial={{ x: -320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -320, opacity: 0 }}
            className="w-80 bg-white border-r border-gray-200 flex flex-col z-10 shadow-xl"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-primary text-xl">
                {activeRail === 'library' ? 'Elements' : activeRail === 'structure' ? 'Page Structure' : activeRail === 'portal' ? 'Portal Editor' : activeRail === 'config' ? 'Brand Config' : 'Course Management'}
              </h3>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <ChevronLeft size={20} className="text-primary/40" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeRail === 'library' && (
                <div className="grid grid-cols-1 gap-3">
                  {librarySections.map((item) => (
                    <button 
                      key={item.type}
                      onClick={() => addSection(item.type)}
                      className="p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-accent hover:bg-accent/5 transition-all text-left group flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary/40 group-hover:text-accent group-hover:scale-110 transition-all">
                        <item.icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary">{item.name}</p>
                        <p className="text-[10px] text-primary/40 leading-tight">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {activeRail === 'structure' && (
                <div className="space-y-6">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                          {sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  onClick={() => setActiveSectionId(section.id)}
                                  className={cn(
                                    'p-4 rounded-xl border transition-all cursor-pointer group flex items-center gap-3',
                                    activeSectionId === section.id 
                                      ? 'bg-primary text-white border-primary shadow-lg' 
                                      : 'bg-white border-gray-100 hover:border-accent/30 hover:shadow-md',
                                    snapshot.isDragging && 'shadow-2xl ring-2 ring-accent z-50'
                                  )}
                                >
                                  <div {...provided.dragHandleProps} className={cn("transition-colors", activeSectionId === section.id ? "text-white/40" : "text-gray-300 group-hover:text-accent")}>
                                    <GripVertical size={16} />
                                  </div>
                                  <div className="flex-1">
                                    <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-0.5", activeSectionId === section.id ? "text-white/60" : "text-primary/40")}>{section.type}</p>
                                    <p className="text-sm font-bold truncate">{section.content.title || section.type}</p>
                                  </div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                                    className={cn("p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100", activeSectionId === section.id ? "text-white/60 hover:bg-white/10" : "text-red-400 hover:bg-red-50")}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )}

              {activeRail === 'portal' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest block">Welcome Message</label>
                    <textarea
                      value={portalConfig.welcomeMessage}
                      onChange={(e) => setPortalConfig({ ...portalConfig, welcomeMessage: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-accent min-h-[120px] resize-none text-primary font-medium"
                      placeholder="Enter welcome message..."
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest block">Global Announcement</label>
                    <textarea
                      value={portalConfig.announcement}
                      onChange={(e) => setPortalConfig({ ...portalConfig, announcement: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-accent min-h-[120px] resize-none text-primary font-medium"
                      placeholder="Enter announcement..."
                    />
                  </div>
                </div>
              )}

              {activeRail === 'config' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest block">Brand Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={siteConfig.brandColor}
                        onChange={(e) => setSiteConfig({ ...siteConfig, brandColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border-none cursor-pointer"
                      />
                      <input 
                        type="text" 
                        value={siteConfig.brandColor}
                        onChange={(e) => setSiteConfig({ ...siteConfig, brandColor: e.target.value })}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-mono text-primary font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest block">Logo Text</label>
                    <input 
                      type="text" 
                      value={siteConfig.logoText}
                      onChange={(e) => setSiteConfig({ ...siteConfig, logoText: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-primary font-medium"
                    />
                  </div>
                </div>
              )}

              {activeRail === 'courses' && (
                <div className="space-y-6">
                  <div className="p-4 bg-accent/5 border border-accent/10 rounded-2xl mb-6 text-center">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-4">
                      <BookOpen size={24} />
                    </div>
                    <p className="text-sm font-bold text-primary mb-2">Manage Courses</p>
                    <p className="text-xs text-primary/60 mb-6">Add, edit, or delete courses. Changes reflect instantly on the landing page.</p>
                    <Link 
                      to="/portal/admin/courses" 
                      className="w-full py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-accent/20"
                    >
                      <BookOpen size={16} />
                      Open Course Manager
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <ChevronRight size={20} className="text-primary/40" />
              </button>
            )}
            <div className="flex items-center gap-2 text-primary/40">
              <span className="text-sm font-medium">Website Editor</span>
              <ChevronRight size={14} />
              <span className="text-sm font-bold text-primary">Landing Page</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button onClick={() => setViewMode('desktop')} className={cn('p-2 rounded-lg transition-all', viewMode === 'desktop' ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary')}>
                <Monitor size={18} />
              </button>
              <button onClick={() => setViewMode('tablet')} className={cn('p-2 rounded-lg transition-all', viewMode === 'tablet' ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary')}>
                <Tablet size={18} />
              </button>
              <button onClick={() => setViewMode('mobile')} className={cn('p-2 rounded-lg transition-all', viewMode === 'mobile' ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary')}>
                <Smartphone size={18} />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-3">
              <button 
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-primary/40 hover:text-primary transition-all disabled:opacity-20"
              >
                <Undo2 size={20} />
              </button>
              <button 
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-primary/40 hover:text-primary transition-all disabled:opacity-20"
              >
                <Redo2 size={20} />
              </button>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1.5 hover:bg-white rounded-lg transition-all text-primary/60 hover:text-primary"
              >
                <X size={12} className="rotate-45" />
              </button>
              <span className="text-[10px] font-bold text-primary w-10 text-center">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(150, zoom + 10))}
                className="p-1.5 hover:bg-white rounded-lg transition-all text-primary/60 hover:text-primary"
              >
                <Plus size={12} />
              </button>
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-accent text-white font-bold text-sm rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </header>

        {/* The Canvas */}
        <div className="flex-1 overflow-auto p-12 flex justify-center items-start bg-[#F0F2F5]">
          <div 
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className={cn(
              "bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] transition-all duration-500 origin-top min-h-full",
              viewMode === 'desktop' ? "w-full" : viewMode === 'tablet' ? "w-[768px]" : "w-[375px]"
            )}
          >
            {/* Real Component Preview */}
            <div className="pointer-events-auto min-h-screen">
              <ErrorBoundary>
                {sections.map((section) => {
                  const Component = sectionComponents[section.type];
                  if (!Component) {
                    console.warn(`Missing component for section type: ${section.type}`);
                    return null;
                  }
                  return (
                    <div 
                      key={section.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSectionId(section.id);
                      }}
                      className={cn(
                        "relative cursor-pointer border-2 border-transparent transition-all",
                        activeSectionId === section.id ? "border-accent ring-8 ring-accent/5" : "hover:border-accent/30"
                      )}
                    >
                      {activeSectionId === section.id && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-[10px] font-bold px-3 py-1 rounded-full z-50 shadow-lg flex items-center gap-2">
                          <MousePointer2 size={10} />
                          Editing {section.type}
                        </div>
                      )}
                      <ErrorBoundary fallback={
                        <div className="p-12 bg-gray-100 text-center border-2 border-dashed border-gray-300 rounded-xl m-4">
                          <p className="text-sm text-gray-500 font-medium">Failed to render {section.type} section</p>
                        </div>
                      }>
                        <Component 
                          content={section.content} 
                          isEditing={activeSectionId === section.id}
                          onUpdate={(newContent: any) => updateSectionContent(section.id, newContent)}
                        />
                      </ErrorBoundary>
                    </div>
                  );
                })}
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <AnimatePresence>
        {activeSectionId && (
          <motion.div 
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            className="w-80 bg-white border-l border-gray-200 flex flex-col z-10 shadow-xl"
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-primary text-xl flex items-center gap-2">
                <Settings2 size={20} className="text-accent" />
                Properties
              </h3>
              <button onClick={() => setActiveSectionId(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                <X size={20} className="text-primary/40" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-primary/40 uppercase tracking-widest block mb-4">Content Settings</label>
                  <div className="space-y-6">
                    {Object.entries(sections.find(s => s.id === activeSectionId)?.content || {}).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <p className="text-xs font-bold text-primary flex items-center gap-2 capitalize">
                          <Type size={14} className="text-accent" />
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        {Array.isArray(value) ? (
                          <div className="space-y-2">
                            {value.map((item: any, idx: number) => (
                              <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                                {Object.entries(item).map(([subKey, subValue]) => (
                                  <input 
                                    key={subKey}
                                    value={subValue as string}
                                    onChange={(e) => {
                                      const newArray = [...value];
                                      newArray[idx] = { ...newArray[idx], [subKey]: e.target.value };
                                      updateSectionContent(activeSectionId, { [key]: newArray });
                                    }}
                                    className="w-full bg-white border border-gray-100 rounded-lg p-2 text-xs text-primary font-medium"
                                    placeholder={subKey}
                                  />
                                ))}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <textarea
                            value={value as string}
                            onChange={(e) => updateSectionContent(activeSectionId, { [key]: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-accent min-h-[100px] resize-none transition-all text-primary font-medium"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <button 
                    onClick={() => removeSection(activeSectionId)}
                    className="w-full py-3 bg-red-50 text-red-500 font-bold text-sm rounded-xl hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete Section
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
