import React from 'react';
import axios from 'axios';

import './App.scss'

import cloneDeep from 'clone-deep';

import { Vortex } from 'react-loader-spinner';

import AnswerBox from './components/AnswerBox';

import { shuffleArray } from './utility/shuffleArray';

interface Props {
  difficulty?: 'string';
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
  CartoonAndAnimation = 32
}

enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard'
}

// store initial state for easy reset
const initialState = {
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
    questionCategory: undefined
  }
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = cloneDeep(initialState) // deep clone the initial state to avoid mutating it
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleNumberOfQuestionsChange = this.handleNumberOfQuestionsChange.bind(this);
    this.handleQuestionCategoryChange = this.handleQuestionCategoryChange.bind(this);
    this.handleQuestionDifficultyChange = this.handleQuestionDifficultyChange.bind(this);
  }

  async fetchQuestions(amount: number, category: Category | undefined, difficulty: string | undefined) {
    const countUrl = `https://opentdb.com/api_count.php?${category ? `category=${category}` : ''}`
    const res = await axios.get(countUrl);

    // handle the case where the maximum number of available questions is less than
    // the user's desired number of questions
    let numQuestions;
    if (category) {
      if (difficulty) {
        numQuestions = res.data.category_question_count[`total_${difficulty}_question_count`]
      } else {
        numQuestions = res.data.category_question_count[`total_question_count`]
      }
    }
    // fetch the maximum number of questions available for the selected category and difficulty
    if (numQuestions < amount) {
      amount = numQuestions;
    }

    const baseUrl = `https://opentdb.com/api.php?amount=${amount}${category ? `&category=${category}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}&encode=base64`
    try {
      const resFinal = await axios.get(baseUrl);
      const questions: Question[] = resFinal.data.results
      if (questions.length === 0) {
        this.setState({
          isError: true
        })
        return;
      }
      this.setState({
        currentQuestionIndex: 0,
        questions: questions,
        isLoading: false,
        shuffledAnswers: this.combineAnswers(questions[0])
      })
    } catch (error) {
      console.error("caught error", error);
      this.setState({
        isError: true
      })
    }
  }

  combineAnswers(question: Question) {
    const correctAnswer = atob(question.correct_answer);
    const incorrectAnswers = question.incorrect_answers.map((answer) => atob(answer));
    return shuffleArray(incorrectAnswers.concat(correctAnswer)); // randomly sort answers using a Durstenfeld Shuffle
  }

  humanCategoryNames() {
    const categoryNames = Object.keys(Category).filter((key) => isNaN(Number(key)));
    return categoryNames.map((name) => name.replace(/([A-Z])/g, ' $1').trim());
  }

  handleAnswerSelection(answer: string) {
    const { currentQuestionIndex, incorrectSelected, questions } = this.state;
     if (currentQuestionIndex !== null && answer === atob(questions[currentQuestionIndex].correct_answer)) {
      if (currentQuestionIndex === questions.length - 1) { // last question
        this.setState({
          currentQuestionIndex: null,
        })
      } else {
        this.setState({
          currentQuestionIndex: currentQuestionIndex + 1,
          shuffledAnswers: this.combineAnswers(questions[currentQuestionIndex+1])
        })
      }
    } else {
      this.setState({
        incorrectSelected: incorrectSelected.concat(answer)
      })
    }
  }

  convertQuestionDifficulty(difficulty: string) {
    switch (difficulty) {
      case 'Easy':
        return Difficulty.Easy;
      case 'Medium':
        return Difficulty.Medium;
      case 'Hard':
        return Difficulty.Hard;
      default:
        return undefined;
    }
  }

  handleStartClick() {
    const { userSelection } = this.state;
    if (userSelection) {
      const { numberOfQuestions, questionDifficulty, questionCategory } = userSelection;
      this.setState({
        hasStarted: true
      })
      this.fetchQuestions(numberOfQuestions, questionCategory, questionDifficulty?.toLowerCase());
    }
  }

  handleNumberOfQuestionsChange(event: React.ChangeEvent<HTMLInputElement>)  {
    const { userSelection } = this.state;
    if (userSelection) {
      this.setState({
        userSelection: {
          ...userSelection,
          numberOfQuestions: parseInt(event.target.value)
        }
      })
    }
  }

  handleQuestionCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { userSelection } = this.state;
    if (userSelection) {
      this.setState({
        userSelection: {
          ...userSelection,
          questionCategory: Object.keys(Category).indexOf((event.target.value).replace(/\s/g, "")) - 15 // subtract 15 to set index correctly
        }
      })
    }
  }
  handleQuestionDifficultyChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { userSelection } = this.state;
    if (userSelection) {
      this.setState({
        userSelection: {
          ...userSelection,
          questionDifficulty: event.target.value
        }
      })
    }
  }

  render() {
    const { isLoading, isError, questions, currentQuestionIndex, hasStarted, incorrectSelected, shuffledAnswers } = this.state;
    return (
      <div className="App">
        <header>
          {hasStarted && isLoading ? (
            <div className="header">Loading...</div>
          ) : hasStarted && currentQuestionIndex !== null ? (
            <div className="header">{atob(this.state.questions[currentQuestionIndex].question)}</div>
          ) : hasStarted && currentQuestionIndex === null && !isLoading ? (
            <div className="header">
              Game Over!
            </div>
            ) : (
            <div className="header">
              Trivia is Fun!
            </div>
            )
          }
        </header>
        {!hasStarted && (
          <div className="userSelection">
            <label className="inputLabel">How many questions would you like? (Please enter a number between 1 and 50)
            <br/>
            <input className="inputField" min="1" max="50" type="number" onChange={this.handleNumberOfQuestionsChange}/>
            <br/>
            (If your desired number of questions cannot be found, all available questions will be returned)
            </label>
            <label className="inputLabel">What should the difficulty of the questions be?
            <div className="difficultyGroup">
            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
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
            </div></label>
            <label className="inputLabel">Please select a question category
            <br/>
            <select className="selectField" onChange={this.handleQuestionCategoryChange}>
              {
                [
                  <option defaultChecked>Any</option>
                ].concat(
                this.humanCategoryNames().map((name) => <option value={name}>{name}</option>))
              }
            </select>
            </label>
            <button type="submit" id="questions" onClick={() => this.handleStartClick()}>
              Start
            </button>
          </div>
        )}
        {hasStarted &&
          (isLoading ? (
            <Vortex
              visible={true}
              height="80"
              width="80"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
            />
          ) : currentQuestionIndex === null ? (
            <button
              className="restartButton"
              onClick={() =>
                this.setState(cloneDeep(initialState)) // reset to initial state
              }
            >
            Try Again?
            </button>
          ) : isError || currentQuestionIndex === null ? (
            <div>Something went wrong!</div>
          ) : (
            <div>
              <div>
                <AnswerBox
                  options={shuffledAnswers}
                  selected={(answer: string) => this.handleAnswerSelection(answer)}
                  correctAnswer={atob(questions[0].correct_answer)}
                  incorrectSelected={incorrectSelected}
                />
              </div>
              <div className="questionCount">
                {currentQuestionIndex + 1}/{questions.length}
              </div>
            </div>
          )
        )}
      </div>
    );
  }
}

export default App;
