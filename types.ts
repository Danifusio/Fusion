
export interface Exercise {
  type: string;
  question: string;
  options?: string[];
  answer: string;
}

export interface StudyGuide {
  title: string;
  points: string[];
}

export interface PracticeTask {
  title: string;
  description: string;
}

export interface LearningMaterial {
  summary: string;
  level: string;
  exercises: Exercise[];
  studyGuide: StudyGuide;
  practiceTask: PracticeTask;
}
