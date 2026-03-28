export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  price: number;
  duration: string;
}

export interface LandingPageConfig {
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  courses: Course[];
  hybrid: {
    title: string;
    description: string;
    image: string;
  };
  whySkillabs: {
    title: string;
    features: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  howItWorks: {
    title: string;
    steps: {
      title: string;
      description: string;
    }[];
  };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'client' | 'admin';
  progress: {
    courseId: string;
    completed: number;
  }[];
}

export interface Session {
  id: string;
  courseId: string;
  studentId: string;
  date: string;
  type: 'online' | 'in-person';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
