import Hero from './Hero';
import Courses from './Courses';
import HybridLearning from './HybridLearning';
import WhySkillabs from './WhySkillabs';
import HowItWorks from './HowItWorks';
import CTA from './CTA';
import Stats from './Stats';
import ApplicationForm from './ApplicationForm';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firebase-utils';

export default function LandingPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'landing-page');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSections(docSnap.data().sections);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'config/landing-page');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      <main>
        {sections.length > 0 ? (
          sections.map((section) => {
            switch (section.type) {
              case 'hero': return <Hero key={section.id} content={section.content} />;
              case 'stats': return <Stats key={section.id} />;
              case 'courses': return <Courses key={section.id} content={section.content} />;
              case 'hybrid': return <HybridLearning key={section.id} content={section.content} />;
              case 'why': return <WhySkillabs key={section.id} content={section.content} />;
              case 'how': return <HowItWorks key={section.id} content={section.content} />;
              case 'apply': return <ApplicationForm key={section.id} />;
              case 'cta': return <CTA key={section.id} content={section.content} />;
              default: return null;
            }
          })
        ) : (
          <>
            <Hero />
            <Stats />
            <Courses />
            <HybridLearning />
            <WhySkillabs />
            <HowItWorks />
            <ApplicationForm />
            <CTA />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
