import "./App.scss";

import { Question, UserSelection } from "./types";
import React, { ChangeEvent } from "react";

import AnswerBox from "./components/AnswerBox";
import { Vortex } from "react-loader-spinner";
import axios from "axios";
import cloneDeep from "clone-deep";

import { shuffleArray } from "./utility/shuffleArray";

// Define an enum for OpenTDB question categories, these values
// were pulled directly from their API and may be subject to change
enum Category {
  General = 9,
  Books = 10,
  Films = 11,
  Music = 12,
  Theatre = 13,
  Television = 14,
  VideoGames = 15,
  BoardGames = 16,
  ScienceAndNature = 17,
  Computers = 18,
  Mathematics = 19,
  Mythology = 20,
  Sports = 21,
  Geography = 22,
  History = 23,
  Politics = 24,
  Art = 25,
  Celebrities = 26,
  Animals = 27,
  Vehicles = 28,
  Comics = 29,
  Gadgets = 30,
  AnimeAndManga = 31,
  CartoonAndAnimation = 32,
}

enum Difficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

interface Props {
  difficulty?: string;
}

interface State {
  currentQuestionIndex: number | null;
  questions: Question[];
  hasStarted: boolean;
  incorrectSelected: string[];
  isLoading: boolean;
  isError: boolean;
  shuffledAnswers: string[];
  userSelection: UserSelection;
}

// Store the initial component state so that we can easily
// reset back to this when we need. Be sure to avoid mutation
const initialState: State = {
  currentQuestionIndex: null,
  questions: [],
  hasStarted: false,
  incorrectSelected: [],
  isLoading: true,
  isError: false,
  shuffledAnswers: [],
  userSelection: {
    numberOfQuestions: 0,
    questionDifficulty: undefined,
    questionCategory: undefined,
  },
};

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = cloneDeep(initialState); // deep clone the initial state to avoid mutating it
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleNumberOfQuestionsChange = this.handleNumberOfQuestionsChange.bind(this);
    this.handleQuestionCategoryChange = this.handleQuestionCategoryChange.bind(this);
    this.handleQuestionDifficultyChange = this.handleQuestionDifficultyChange.bind(this);
  }

  // Helper functions

  // Convert a question difficult string to an enum value
  convertQuestionDifficulty(difficulty: string) {
    switch (difficulty) {
      case "Easy":
        return Difficulty.Easy;
      case "Medium":
        return Difficulty.Medium;
      case "Hard":
        return Difficulty.Hard;
      default:
        return undefined;
    }
  }

  // Combine the correct and incorrect answers for a question into an array and then
  // shuffle them randomly
  combineAnswers(question: Question) {
    const correct_answer = atob(question.correct_answer);
    const incorrect_answers = question.incorrect_answers.map((answer) =>
      atob(answer),
    );
    return shuffleArray(incorrect_answers.concat(correct_answer)); // randomly sort answers using a Durstenfeld Shuffle
  }

  // Convert the OpenTDB category enum values to human readable names
  humanCategoryNames() {
    const categoryNames = Object.keys(Category).filter((key) =>
      isNaN(Number(key)),
    );
    return categoryNames.map((name) => name.replace(/([A-Z])/g, " $1").trim());
  }

  // Fetch questions from the OpenTDB API asynchronously
  async fetchQuestions(
    amount: number,
    category: Category | undefined,
    difficulty: string | undefined,
  ) {
    // Firstly, fetch the maximum number of available questions for a given
    // category using the API's count endpoint. This will be used to determine if we
    // have enough questions available for the user's selected category
    const countUrl = `https://opentdb.com/api_count.php?${
      category ? `category=${category}` : ""
    }`;

    const res = await axios.get(countUrl);

    let numQuestions;

    // Make sure to extract the correct number of questions for a given category AND difficulty
    if (category) {
      if (difficulty) {
        numQuestions =
          res.data.category_question_count[
            `total_${difficulty}_question_count`
          ];
      } else {
        numQuestions = res.data.category_question_count["total_question_count"];
      }
    }

    // The if the number of questions available is less than what is desired, we will
    // simply fetch all that we can
    if (numQuestions < amount) {
      amount = numQuestions;
    }

    // Construct the base API URL with the user's selected options and
    // the available questions
    const baseUrl = `https://opentdb.com/api.php?amount=${amount}${
      category ? `&category=${category}` : ""
    }${difficulty ? `&difficulty=${difficulty}` : ""}&encode=base64`;

    try {
      const resFinal = await axios.get(baseUrl);
      const questions: Question[] = resFinal.data.results;

      // If no questions are returned, set an error state as something has gone wrong
      if (questions.length === 0) {
        this.setState({
          isError: true,
        });
        return;
      }

      // Otherwise update our questions state and shuffle the answers for the first question
      this.setState({
        currentQuestionIndex: 0,
        questions: questions,
        isLoading: false,
        shuffledAnswers: this.combineAnswers(questions[0]),
      });
    } catch (error) {
      console.error(error)
      this.setState({
        isError: true,
      });
    }
  }

  // Event handlers

  // For a given selected answer, determine if it is correct or incorrect
  handleAnswerSelection(answer: string) {
    const { currentQuestionIndex, incorrectSelected, questions } = this.state;

    // If the selected answer is correct, try and move to the next question
    if (
      currentQuestionIndex !== null &&
      answer === atob(questions[currentQuestionIndex].correct_answer)
    ) {
      // If we are on the last question, set the current question index to null
      if (currentQuestionIndex === questions.length - 1) {
        this.setState({
          currentQuestionIndex: null,
        });
        // Otherwise, move to the next question and shuffle the answers
      } else {
        this.setState({
          currentQuestionIndex: currentQuestionIndex + 1,
          shuffledAnswers: this.combineAnswers(
            questions[currentQuestionIndex + 1],
          ),
        });
      }
      // If the selected answer is incorrect, add it to the incorrectSelected array
      // to keep track of an incorrect answer
    } else {
      this.setState({
        incorrectSelected: incorrectSelected.concat(answer),
      });
    }
  }

  // Update state for a user's desired number of questions
  handleNumberOfQuestionsChange(event: ChangeEvent<HTMLInputElement>) {
    const { userSelection } = this.state;
    if (userSelection) {
      this.setState({
        userSelection: {
          ...userSelection,
          numberOfQuestions: parseInt(event.target.value),
        },
      });
    }
  }

  // Update state for a user's desired question category
  handleQuestionCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    const { userSelection } = this.state;
    if (userSelection) {
      this.setState({
        userSelection: {
          ...userSelection,
          questionCategory: Object.keys(Category).indexOf(event.target.value.replace(/\s/g, "")) - 15,
        },
      });
    }
  }

  // Update state for a user's desired question difficulty
  handleQuestionDifficultyChange(event: ChangeEvent<HTMLInputElement>) {
    const { userSelection } = this.state;
    if (userSelection) {
      this.setState({
        userSelection: {
          ...userSelection,
          questionDifficulty: event.target.value,
        },
      });
    }
  }

  // When the start button is clicked, parse userSelection state and feed
  // this to the fetch function
  handleStartClick() {
    const { userSelection } = this.state;
    if (userSelection) {
      const { numberOfQuestions, questionDifficulty, questionCategory } = userSelection;
      this.setState({
        hasStarted: true,
      });
      this.fetchQuestions(numberOfQuestions, questionCategory, questionDifficulty?.toLowerCase());
    }
  }

  // Render the correct page header based on the current application state
  // e.g. loading, question text, game over, title
  renderHeader() {
    const { hasStarted, isLoading, currentQuestionIndex, questions } = this.state;

    if (hasStarted && isLoading) {
      return <div className="header">Loading...</div>;
    } else if (hasStarted && currentQuestionIndex !== null) {
      return <div className="header">{atob(questions[currentQuestionIndex].question)}</div>;
    } else if (hasStarted && currentQuestionIndex === null && !isLoading) {
      return <div className="header">Game Over!</div>;
    } else {
      return <div className="header">Trivia is Fun!</div>;
    }
  }

  renderUserSelection() {
    const { userSelection } = this.state;

    return (
      <div className="userSelection">
        <label className="inputLabel">
          How many questions would you like? (Please enter a number between 1 and 50)
          <br />
          <input
            className="inputField"
            min="1"
            max="50"
            type="number"
            onChange={this.handleNumberOfQuestionsChange}
          />
          <br />
          (If your desired number of questions cannot be found, all available questions will be returned)
        </label>
        <label className="inputLabel">
          What should the difficulty of the questions be?
          <div className="difficultyGroup">
            {["Easy", "Medium", "Hard"].map((difficulty) => (
              <label key={difficulty}>
                <input
                  type="radio"
                  value={difficulty === "Any" ? undefined : difficulty}
                  name="difficulty"
                  onChange={this.handleQuestionDifficultyChange}
                />
                {difficulty}
              </label>
            ))}
            <input
              defaultChecked
              type="radio"
              value={undefined}
              name="difficulty"
              onChange={this.handleQuestionDifficultyChange}
            />
            Any
          </div>
        </label>
        <label className="inputLabel">
          Please select a question category
          <br />
          <select
            className="selectField"
            onChange={this.handleQuestionCategoryChange}
          >
            {[
              <option key="any" value="any" className="selectOption" defaultChecked>
                Any
              </option>,
            ].concat(
              this.humanCategoryNames().map((name, index) => (
                <option key={index} value={name}>{name}</option>
              )),
            )}
          </select>
        </label>
        <button
          type="submit"
          id="questions"
          onClick={() => this.handleStartClick()}
          disabled={!userSelection.numberOfQuestions}
        >
          Start
        </button>
      </div>
    );
  }

  render() {
    const { isLoading, isError, currentQuestionIndex, hasStarted, incorrectSelected, questions, shuffledAnswers } = this.state;

    return (
      <div className="App">
        {this.renderHeader()}
        {!hasStarted && this.renderUserSelection()}
        {hasStarted &&
          (isLoading ? (
            <Vortex
              visible={true}
              height="120"
              width="120"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={["grey", "grey", "grey", "grey", "grey", "grey"]}
            />
          ) : currentQuestionIndex === null ? (
            <button
              className="restartButton"
              onClick={
                () => this.setState(cloneDeep(initialState)) // reset to initial state on restart
              }
            >
              Play Again?
            </button>
          ) : isError || currentQuestionIndex === null ? (
            <div>Something went wrong!</div>
          ) : (
            <div>
              <div>
                <AnswerBox
                  options={shuffledAnswers}
                  selected={(answer: string) =>
                    this.handleAnswerSelection(answer)
                  }
                  correct_answer={atob(questions[0].correct_answer)}
                  incorrectSelected={incorrectSelected}
                />
              </div>
              <div className="questionCount">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default App;
