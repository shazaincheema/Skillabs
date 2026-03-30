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
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { handleFirestoreError, OperationType } from '../../lib/firebase-utils';

export default function LandingPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'landing-page'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSections(data.sections || []);
        setSiteConfig(data.site || null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Landing Page Load Error:', error);
      setLoading(false);
    });

    return () => unsubscribe();
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
      <Navbar logoText={siteConfig?.logoText} />
      <main>
        {sections.length > 0 ? (
          sections.map((section) => {
            switch (section.type) {
              case 'hero': return <Hero key={section.id} content={section.content} />;
              case 'stats': return <Stats key={section.id} content={section.content} />;
              case 'courses': return <Courses key={section.id} content={section.content} />;
              case 'hybrid': return <HybridLearning key={section.id} content={section.content} />;
              case 'why': return <WhySkillabs key={section.id} content={section.content} />;
              case 'how': return <HowItWorks key={section.id} content={section.content} />;
              case 'apply': return <ApplicationForm key={section.id} content={section.content} />;
              case 'cta': return <CTA key={section.id} content={section.content} />;
              case 'footer': return <Footer key={section.id} content={section.content} />;
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
            <Footer />
          </>
        )}
      </main>
    </div>
  );
}
