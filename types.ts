
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FacultyMember {
  name: string;
  title: string;
  image: string;
}

export interface Program {
  id: string;
  title: string;
  category: 'Engineering' | 'Arts' | 'Science' | 'Business';
  description: string;
  image: string;
  duration: string;
  faculty: FacultyMember[];
  curriculum: string[];
  prerequisites: string[];
}

export interface StatItem {
  label: string;
  value: string;
  icon: string;
}
