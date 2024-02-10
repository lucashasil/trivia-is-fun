import { Question } from "../src/types";

function getAllAnswers(question : Question) {
  return question.incorrectAnswers.concat(question.correctAnswer);
}

export { getAllAnswers };
