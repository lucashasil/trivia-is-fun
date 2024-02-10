import { Question } from "../src/types";

function getAllAnswers(question : Question) {
  return question.incorrect_answers.concat(question.correct_answer);
}

export { getAllAnswers };
