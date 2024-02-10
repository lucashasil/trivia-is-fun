interface UserSelection {
  numberOfQuestions: number;
  questionDifficulty?: string;
  questionCategory?: number;
}

interface Question {
  category: string;
  correctAnswer: string;
  difficulty: string;
  incorrectAnswers: string[];
  question: string;
  type: string;
}

export type { UserSelection, Question };
