import { getAllAnswers } from "./question";

const question = {
  category: "History",
  correct_answer: "1914",
  difficulty: "Easy",
  incorrect_answers: ["1913", "1915", "1916"],
  question: "What year did World War I begin?",
  type: "Multiple Choice"
}

const questionTf = {
  category: "Geography",
  correct_answer: "True",
  difficulty: "Easy",
  incorrect_answers: ["False"],
  question: "Russia is a part of Asia?",
  type: "True / False"
}

describe("multiple choice", () => {
  test("should return a total of four answers", () => {
    expect(getAllAnswers(question).length).toBe(4);
  });

  test("should have type of multiple choice", () => {
    expect(question.type).toBe("Multiple Choice");
  })
})

describe("true / false", ()=> {
  test("should return a total of two answers", () => {
    expect(getAllAnswers(questionTf).length).toBe(2);
  });

  test("should have type of true / false", () => {
    expect(questionTf.type).toBe("True / False");
  })
})
