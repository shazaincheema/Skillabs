import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const courses = [
  "WSC Coaching",
  "Coding & Robotics",
  "Public Speaking"
];

const modes = [
  { id: 'online', label: 'Online' },
  { id: 'in-person', label: 'In-Person' },
  { id: 'hybrid', label: 'Hybrid' }
];

export default function ApplicationForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    contactNumber: '',
    email: '',
    course: courses[0],
    mode: 'hybrid'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, 'applications'), {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({
        name: '',
        age: '',
        contactNumber: '',
        email: '',
        course: courses[0],
        mode: 'hybrid'
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      setStatus('error');
    }
  };

  return (
    <section id="apply" className="py-32 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-3xl opacity-30" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-6"
          >
            Start Your <span className="text-accent">Journey</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60"
          >
            Fill out the form below and our team will get back to you within 24 hours.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-8 md:p-12"
        >
          {status === 'success' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">Application Received!</h3>
              <p className="text-white/60 mb-8">Thank you for your interest in Skillabs. We'll contact you shortly.</p>
              <button
                onClick={() => setStatus('idle')}
                className="px-8 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 ml-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="18"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 ml-1">Email Address</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white/80 ml-1">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white/80 ml-1">Select Course</label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  {courses.map(c => <option key={c} value={c} className="bg-primary text-white">{c}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-semibold text-white/80 ml-1">Learning Mode</label>
                <div className="grid grid-cols-3 gap-4">
                  {modes.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, mode: m.id })}
                      className={`py-3 rounded-xl border transition-all font-semibold text-sm ${
                        formData.mode === m.id
                          ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20'
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
              >
                {status === 'loading' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Send size={20} />
                    Submit Application
                  </>
                )}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm text-center mt-4">
                  Something went wrong. Please try again later.
                </p>
              )}
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
