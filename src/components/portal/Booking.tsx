import { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Video,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const courses = [
  { id: 'wsc', title: 'WSC Coaching', icon: <Users size={20} /> },
  { id: 'coding', title: 'Coding & Robotics', icon: <Video size={20} /> },
  { id: 'public-speaking', title: 'Public Speaking', icon: <Users size={20} /> },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'online' | 'in-person' | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const isStepValid = () => {
    if (step === 1) return !!selectedCourse;
    if (step === 2) return !!selectedType;
    if (step === 3) return !!selectedDate && !!selectedTime;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all',
              step >= i ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-200 text-gray-400'
            )}>
              {step > i ? <CheckCircle2 size={20} /> : i}
            </div>
            {i < 4 && (
              <div className={cn(
                'flex-1 h-1 mx-4 rounded-full transition-all',
                step > i ? 'bg-primary' : 'bg-gray-200'
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-xl min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-primary mb-2">Choose Your Course</h2>
                <p className="text-primary/60">Select the program you'd like to book a session for.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedCourse(course.id)}
                    className={cn(
                      'p-8 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group',
                      selectedCourse === course.id 
                        ? 'border-accent bg-accent/5 ring-4 ring-accent/10' 
                        : 'border-gray-100 hover:border-accent/30'
                    )}
                  >
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                      selectedCourse === course.id ? 'bg-accent text-white' : 'bg-gray-100 text-primary group-hover:bg-accent/10 group-hover:text-accent'
                    )}>
                      {course.icon}
                    </div>
                    <span className="font-display font-bold text-primary">{course.title}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-primary mb-2">Select Session Type</h2>
                <p className="text-primary/60">Choose between online or in-person learning.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <button
                  onClick={() => setSelectedType('online')}
                  className={cn(
                    'p-10 rounded-2xl border-2 transition-all flex flex-col items-center gap-6 group',
                    selectedType === 'online' 
                      ? 'border-accent bg-accent/5 ring-4 ring-accent/10' 
                      : 'border-gray-100 hover:border-accent/30'
                  )}
                >
                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
                    selectedType === 'online' ? 'bg-accent text-white' : 'bg-gray-100 text-primary group-hover:bg-accent/10 group-hover:text-accent'
                  )}>
                    <Globe size={32} />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-display font-bold text-primary mb-2">Online Session</h4>
                    <p className="text-sm text-primary/60">Learn from the comfort of your home via video call.</p>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedType('in-person')}
                  className={cn(
                    'p-10 rounded-2xl border-2 transition-all flex flex-col items-center gap-6 group',
                    selectedType === 'in-person' 
                      ? 'border-accent bg-accent/5 ring-4 ring-accent/10' 
                      : 'border-gray-100 hover:border-accent/30'
                  )}
                >
                  <div className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all',
                    selectedType === 'in-person' ? 'bg-accent text-white' : 'bg-gray-100 text-primary group-hover:bg-accent/10 group-hover:text-accent'
                  )}>
                    <MapPin size={32} />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xl font-display font-bold text-primary mb-2">In-Person Session</h4>
                    <p className="text-sm text-primary/60">Join us at our physical campus for hands-on learning.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="text-center">
                <h2 className="text-3xl font-display font-bold text-primary mb-2">Pick Date & Time</h2>
                <p className="text-primary/60">Select a convenient slot for your session.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-primary flex items-center gap-2">
                    <CalendarIcon size={18} className="text-accent" />
                    Select Date
                  </h4>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 14 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateStr;
                      return (
                        <button
                          key={dateStr}
                          onClick={() => setSelectedDate(dateStr)}
                          className={cn(
                            'aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-all',
                            isSelected ? 'bg-primary text-white' : 'bg-gray-50 text-primary hover:bg-accent/10'
                          )}
                        >
                          <span className="opacity-60">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          <span className="font-bold text-sm">{date.getDate()}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-primary flex items-center gap-2">
                    <Clock size={18} className="text-accent" />
                    Select Time
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={cn(
                          'py-3 rounded-xl border-2 text-sm font-bold transition-all',
                          selectedTime === time ? 'border-accent bg-accent/5 text-accent' : 'border-gray-100 text-primary hover:border-accent/30'
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-4xl font-display font-bold text-primary">Booking Confirmed!</h2>
              <p className="text-lg text-primary/60 max-w-md">
                Your session for <span className="text-primary font-bold">{courses.find(c => c.id === selectedCourse)?.title}</span> has been booked successfully.
              </p>
              <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-sm space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-primary/40">Type</span>
                  <span className="text-primary font-bold capitalize">{selectedType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary/40">Date</span>
                  <span className="text-primary font-bold">{selectedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary/40">Time</span>
                  <span className="text-primary font-bold">{selectedTime}</span>
                </div>
              </div>
              <button 
                onClick={() => setStep(1)}
                className="mt-8 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 && (
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="px-6 py-3 text-primary font-bold flex items-center gap-2 hover:bg-gray-50 rounded-xl disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={20} />
              Back
            </button>
            <button
              onClick={nextStep}
              disabled={!isStepValid()}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20"
            >
              {step === 3 ? 'Confirm Booking' : 'Continue'}
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
