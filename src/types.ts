interface UserSelection {
  numberOfQuestions: number;
  questionDifficulty?: string;
  questionCategory?: number;
}

interface Question {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

export type { UserSelection, Question };
