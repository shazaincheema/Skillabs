import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Users, 
  Clock, 
  DollarSign,
  Filter,
  ChevronRight,
  X,
  Save,
  LayoutDashboard,
  Menu,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/firebase';
import { handleFirestoreError, OperationType } from '@/lib/firebase-utils';

interface Course {
  id: string;
  title: string;
  category: string;
  students: number;
  sessions: number;
  price: string;
  status: 'Active' | 'Draft';
  description: string;
  longDescription?: string;
  features?: string[];
  order?: number;
  image?: string;
  media?: string[];
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state
  const [formData, setFormData] = useState<Partial<Course>>({
    title: '',
    category: 'WSC Coaching',
    price: '$0',
    sessions: 0,
    status: 'Draft',
    students: 0,
    description: '',
    longDescription: '',
    features: [],
    image: '',
    media: []
  });

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const courseList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
      setCourses(courseList);
      setLoading(false);
    }, (error) => {
      console.error('Courses snapshot error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(courses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Optimistic update
    setCourses(items);

    // Update orders in Firestore
    try {
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        const docRef = doc(db, 'courses', item.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'courses-reorder');
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (course?: Course) => {
    if (course) {
      setEditingCourse(course);
      setFormData(course);
    } else {
      setEditingCourse(null);
      setFormData({
        title: '',
        category: 'WSC Coaching',
        price: '$0',
        sessions: 0,
        status: 'Draft',
        students: 0,
        description: '',
        longDescription: '',
        features: [],
        image: '',
        media: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        updatedAt: new Date().toISOString(),
        order: editingCourse ? (editingCourse.order ?? 0) : courses.length
      };
      if (editingCourse) {
        await updateDoc(doc(db, 'courses', editingCourse.id), dataToSave);
      } else {
        await addDoc(collection(db, 'courses'), {
          ...dataToSave,
          createdAt: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, editingCourse ? OperationType.UPDATE : OperationType.CREATE, 'courses');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'courses', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, 'courses');
      }
    }
  };

  const handleDuplicate = async (course: Course) => {
    try {
      const { id, ...rest } = course;
      await addDoc(collection(db, 'courses'), {
        ...rest,
        title: `${rest.title} (Copy)`,
        status: 'Draft',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'courses');
    }
  };

  const addFeature = () => {
    const features = formData.features || [];
    setFormData({ ...formData, features: [...features, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...(formData.features || [])];
    features[index] = value;
    setFormData({ ...formData, features });
  };

  const removeFeature = (index: number) => {
    const features = [...(formData.features || [])];
    features.splice(index, 1);
    setFormData({ ...formData, features });
  };

  const addMedia = () => {
    const media = formData.media || [];
    setFormData({ ...formData, media: [...media, ''] });
  };

  const updateMedia = (index: number, value: string) => {
    const media = [...(formData.media || [])];
    media[index] = value;
    setFormData({ ...formData, media });
  };

  const removeMedia = (index: number) => {
    const media = [...(formData.media || [])];
    media.splice(index, 1);
    setFormData({ ...formData, media });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Course Management</h1>
          <p className="text-primary/60">Create, edit, and manage your educational programs.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={cn('p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary')}
            >
              <LayoutDashboard size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn('p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-primary/40 hover:text-primary')}
            >
              <Menu size={18} />
            </button>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="px-6 py-3 bg-accent text-white font-bold rounded-xl hover:bg-accent/90 transition-all shadow-lg shadow-accent/20 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Course
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:border-accent transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            <Filter size={18} />
            Category
          </button>
          <button className="flex-1 md:flex-none px-4 py-3 bg-white border border-gray-200 text-primary font-bold rounded-xl text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
            Status
          </button>
        </div>
      </div>

      {/* Course List */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-primary/40 font-medium">Loading courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="courses" direction={viewMode === 'grid' ? 'horizontal' : 'vertical'}>
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
              >
                {filteredCourses.map((course, index) => (
                  <Draggable key={course.id} draggableId={course.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "transition-all h-full",
                          snapshot.isDragging && "z-50 scale-105"
                        )}
                      >
                        {viewMode === 'list' ? (
                          <motion.div
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col md:flex-row items-center justify-between gap-6 h-full"
                          >
                            <div className="flex items-center gap-6 w-full md:w-auto">
                              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-accent/10 group-hover:text-accent transition-all overflow-hidden">
                                {course.image ? (
                                  <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                  <BookOpen size={32} />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-xl font-display font-bold text-primary">{course.title}</h3>
                                  <span className={cn(
                                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                                    course.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                  )}>
                                    {course.status}
                                  </span>
                                </div>
                                <p className="text-sm text-primary/60">{course.category}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 w-full md:w-auto">
                              <div className="text-center md:text-left">
                                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                                  <Users size={12} />
                                  Students
                                </p>
                                <p className="text-lg font-display font-bold text-primary">{course.students}</p>
                              </div>
                              <div className="text-center md:text-left">
                                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                                  <Clock size={12} />
                                  Sessions
                                </p>
                                <p className="text-lg font-display font-bold text-primary">{course.sessions}</p>
                              </div>
                              <div className="text-center md:text-left">
                                <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1 flex items-center gap-1.5 justify-center md:justify-start">
                                  <DollarSign size={12} />
                                  Price
                                </p>
                                <p className="text-lg font-display font-bold text-primary">{course.price}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                              <button 
                                onClick={() => handleOpenModal(course)}
                                className="flex-1 md:flex-none p-3 bg-gray-50 text-primary hover:bg-accent/10 hover:text-accent rounded-xl transition-all"
                                title="Edit"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDuplicate(course)}
                                className="flex-1 md:flex-none p-3 bg-gray-50 text-primary hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                title="Duplicate"
                              >
                                <Plus size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(course.id)}
                                className="flex-1 md:flex-none p-3 bg-gray-50 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col h-full"
                          >
                            <div className="p-6 flex-1">
                              <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white transition-all overflow-hidden">
                                  {course.image ? (
                                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                                  ) : (
                                    <BookOpen size={28} />
                                  )}
                                </div>
                                <span className={cn(
                                  'text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider',
                                  course.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                                )}>
                                  {course.status}
                                </span>
                              </div>
                              <h3 className="text-xl font-display font-bold text-primary mb-2 group-hover:text-accent transition-colors">{course.title}</h3>
                              <p className="text-sm text-primary/40 font-medium mb-4">{course.category}</p>
                              <p className="text-sm text-primary/60 line-clamp-2 mb-6">{course.description || 'No description provided.'}</p>
                              
                              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                                <div>
                                  <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mb-1">Students</p>
                                  <p className="text-lg font-display font-bold text-primary">{course.students}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mb-1">Price</p>
                                  <p className="text-lg font-display font-bold text-accent">{course.price}</p>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 bg-gray-50 flex items-center justify-between gap-2 border-t border-gray-100">
                              <button 
                                onClick={() => handleOpenModal(course)}
                                className="flex-1 py-2.5 bg-white text-primary font-bold text-sm rounded-xl hover:bg-accent hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                              >
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDuplicate(course)}
                                className="p-2.5 bg-white text-primary rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                title="Duplicate"
                              >
                                <Plus size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(course.id)}
                                className="p-2.5 bg-white text-red-400 rounded-xl hover:bg-red-50 transition-all shadow-sm"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <BookOpen size={48} className="mx-auto mb-4 text-primary/10" />
          <p className="text-primary/40 font-medium">No courses found matching your search.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                <h3 className="text-2xl font-display font-bold text-primary">
                  {editingCourse ? 'Edit Course' : 'Add New Course'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-primary/40 hover:text-primary">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Basic Info */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-accent uppercase tracking-widest">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-primary">Course Title</label>
                      <input
                        required
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                        placeholder="e.g. Advanced Robotics Masterclass"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                      >
                        <option value="WSC Coaching">WSC Coaching</option>
                        <option value="Coding & Robotics">Coding & Robotics</option>
                        <option value="Public Speaking">Public Speaking</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Draft' })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                      >
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Price (Display String)</label>
                      <input
                        required
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                        placeholder="e.g. $299 or Free"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Sessions Count</label>
                      <input
                        required
                        type="number"
                        value={formData.sessions}
                        onChange={(e) => setFormData({ ...formData, sessions: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-accent uppercase tracking-widest">Course Content</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Short Description</label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent min-h-[80px] transition-all text-primary font-medium"
                        placeholder="A brief overview for the course card..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Long Description (Modal View)</label>
                      <textarea
                        value={formData.longDescription}
                        onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent min-h-[150px] transition-all text-primary font-medium"
                        placeholder="Detailed information about the course..."
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-6">
                  <h4 className="text-xs font-bold text-accent uppercase tracking-widest">Media Attachments</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary">Primary Image URL</label>
                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-primary font-medium"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-primary">Optional Media Gallery</label>
                        <button 
                          type="button"
                          onClick={addMedia}
                          className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 transition-all"
                        >
                          <Plus size={14} />
                          Add Media URL
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(formData.media || []).map((url, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => updateMedia(index, e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-sm text-primary font-medium"
                              placeholder="https://..."
                            />
                            <button 
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-accent uppercase tracking-widest">Key Features</h4>
                    <button 
                      type="button"
                      onClick={addFeature}
                      className="text-xs font-bold text-primary hover:text-accent flex items-center gap-1 transition-all"
                    >
                      <Plus size={14} />
                      Add Feature
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(formData.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <CheckCircle2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" />
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-accent transition-all text-sm text-primary font-medium"
                            placeholder="e.g. 24/7 Mentor Support"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    {(formData.features || []).length === 0 && (
                      <p className="text-sm text-primary/40 text-center py-4 border border-dashed border-gray-200 rounded-xl">No features added yet.</p>
                    )}
                  </div>
                </div>
              </form>

              <div className="p-8 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
