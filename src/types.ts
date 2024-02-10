interface UserSelection {
  numberOfQuestions: number;
  questionDifficulty?: string;
  questionCategory?: number;
}

interface Question {
  category: string;
  correct_answer: string; // per the API
  difficulty: string;
  incorrect_answers: string[]; // per the API
  question: string;
  type: string;
}

export type { UserSelection, Question };
