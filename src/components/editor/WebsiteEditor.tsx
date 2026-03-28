import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  Save, 
  Eye, 
  Settings2, 
  Type, 
  Image as ImageIcon, 
  Layout,
  Undo2,
  Redo2,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

interface Section {
  id: string;
  type: 'hero' | 'courses' | 'hybrid' | 'why' | 'how' | 'cta';
  content: any;
}

const initialSections: Section[] = [
  { id: 'hero-1', type: 'hero', content: { title: 'Master Lifelong Skills with Skillabs', subtitle: 'Expert-led sessions in WSC Coaching, Coding & Robotics, and Public Speaking', ctaPrimary: 'Get Started', ctaSecondary: 'Explore Courses' } },
  { id: 'courses-1', type: 'courses', content: { title: 'Explore Our Expert-Led Courses', subtitle: 'Choose from our specialized programs designed to build real-world skills.' } },
  { id: 'hybrid-1', type: 'hybrid', content: { title: 'The Best of Both Worlds: Hybrid Learning', description: 'At Skillabs, we believe learning should fit your lifestyle.' } },
  { id: 'why-1', type: 'why', content: { title: 'Why Choose Skillabs?', subtitle: 'We provide a premium educational experience that focuses on your long-term success.' } },
  { id: 'how-1', type: 'how', content: { title: 'How It Works', subtitle: 'Start your skill journey in four simple steps.' } },
  { id: 'cta-1', type: 'cta', content: { title: 'Unlock Your Potential with Skillabs.', subtitle: 'Join our community of lifelong learners and master the skills that matter.' } },
];

export default function WebsiteEditor() {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
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
      await setDoc(doc(db, 'config', 'landing-page'), { sections });
      setIsSaving(false);
      alert('Website layout saved successfully!');
    } catch (error) {
      setIsSaving(false);
      handleFirestoreError(error, OperationType.WRITE, 'config/landing-page');
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      {/* Editor Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          <div className="flex gap-2">
            <button className="p-2 text-primary/40 hover:text-primary transition-all"><Undo2 size={18} /></button>
            <button className="p-2 text-primary/40 hover:text-primary transition-all"><Redo2 size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-primary font-bold text-sm hover:bg-gray-50 rounded-xl flex items-center gap-2">
            <Eye size={18} />
            Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-primary text-white font-bold text-sm rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={18} className={isSaving ? 'animate-spin' : ''} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Sidebar: Layers & Sections */}
        <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-display font-bold text-primary flex items-center gap-2">
              <Layout size={18} className="text-accent" />
              Page Structure
            </h3>
            <button className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-all">
              <Plus size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
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
                                : 'bg-gray-50 border-gray-100 hover:border-accent/30',
                              snapshot.isDragging && 'shadow-2xl ring-2 ring-accent'
                            )}
                          >
                            <div {...provided.dragHandleProps} className="text-gray-400 group-hover:text-accent transition-colors">
                              <GripVertical size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">{section.type}</p>
                              <p className="text-sm font-medium truncate">{section.content.title}</p>
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
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
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-gray-200 rounded-2xl border-4 border-gray-300 overflow-hidden relative flex items-center justify-center p-8">
          <div 
            className={cn(
              'bg-white shadow-2xl transition-all duration-500 overflow-y-auto h-full',
              viewMode === 'desktop' ? 'w-full' : viewMode === 'tablet' ? 'w-[768px]' : 'w-[375px]'
            )}
          >
            {/* Canvas Content */}
            <div className="p-8 space-y-12">
              {sections.map((section) => (
                <div 
                  key={section.id} 
                  className={cn(
                    'relative group border-2 border-transparent hover:border-accent/30 rounded-xl transition-all',
                    activeSectionId === section.id && 'border-accent ring-4 ring-accent/10'
                  )}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  {/* Section Label Overlay */}
                  <div className="absolute -top-3 -left-3 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all z-10 uppercase tracking-widest">
                    {section.type}
                  </div>

                  {/* Simplified Section Previews */}
                  <div className="p-8 bg-gray-50/50 rounded-lg">
                    <h2 className="text-2xl font-display font-bold text-primary mb-2">{section.content.title}</h2>
                    {section.content.subtitle && <p className="text-primary/60 text-sm">{section.content.subtitle}</p>}
                    {section.content.description && <p className="text-primary/60 text-sm">{section.content.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Properties */}
        <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center gap-2">
            <Settings2 size={18} className="text-accent" />
            <h3 className="font-display font-bold text-primary">Properties</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {activeSectionId ? (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-primary/40 uppercase tracking-widest block mb-3">Content</label>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-primary flex items-center gap-2">
                        <Type size={14} className="text-accent" />
                        Title
                      </p>
                      <textarea
                        value={sections.find(s => s.id === activeSectionId)?.content.title}
                        onChange={(e) => updateSectionContent(activeSectionId, { title: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-accent min-h-[100px]"
                      />
                    </div>
                    {sections.find(s => s.id === activeSectionId)?.content.subtitle !== undefined && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-primary flex items-center gap-2">
                          <Type size={14} className="text-accent" />
                          Subtitle
                        </p>
                        <textarea
                          value={sections.find(s => s.id === activeSectionId)?.content.subtitle}
                          onChange={(e) => updateSectionContent(activeSectionId, { subtitle: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-accent min-h-[80px]"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-primary/40 uppercase tracking-widest block mb-3">Style</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-primary">Background</p>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
                        <span className="text-[10px] font-mono">#FFFFFF</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-xs font-bold text-primary">Text Color</p>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-4 h-4 bg-primary rounded" />
                        <span className="text-[10px] font-mono">#0B1F3A</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-gray-50 text-primary font-bold rounded-xl text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                  <ImageIcon size={16} />
                  Change Background Image
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-primary/30">
                <Layout size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Select a section to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
