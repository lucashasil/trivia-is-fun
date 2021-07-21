import React from 'react';
import axios from 'axios';

import './App.scss'

import { Vortex } from 'react-loader-spinner';

import AnswerBox from './components/AnswerBox';

import { shuffleArray } from './utility/shuffleArray';

interface Props {
  difficulty?: 'string';
}

interface State {
  currentQuestionIndex: number | null;
  questions: Question[];
  isLoading: boolean;
  isError: boolean;
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

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentQuestionIndex: null,
      questions: [],
      isLoading: true,
      isError: false
    };
  }

  componentDidMount(): void {
      this.fetchQuestions(12, Category.Animals, Difficulty.Medium);
  }


  async fetchQuestions(amount: number, category: Category | undefined, difficulty: Difficulty | undefined) {
    const baseUrl = `https://opentdb.com/api.php?amount=${amount}${category ? `&category=${category}` : ''}${difficulty ? `&difficulty=${difficulty}` : ''}&encode=base64`
    try {
      const res = await axios.get(baseUrl);
      const questions: Question[] = res.data.results
      this.setState({
        currentQuestionIndex: 0,
        questions: questions,
        isLoading: false
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

  handleAnswerSelection(answer: string) {
    const { currentQuestionIndex, questions } = this.state;
     if (currentQuestionIndex !== null && answer === atob(questions[currentQuestionIndex].correct_answer)) {
      console.log("in 2")
      if (currentQuestionIndex === questions.length - 1) { // last question
        console.log("in 3")
        this.setState({
          currentQuestionIndex: null
        })
      } else {
        console.log("in 4")
        this.setState({
          currentQuestionIndex: currentQuestionIndex + 1
        })
      }
    }
  }

  render() {
    const { isLoading, isError, questions, currentQuestionIndex } = this.state;
    return (
      <div className="App">
        <header className="appHeader">
          <p>
            {isLoading ? (
              <Vortex
                visible={true}
                height="80"
                width="80"
                ariaLabel="vortex-loading"
                wrapperStyle={{}}
                wrapperClass="vortex-wrapper"
                colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
              />
            ) : isError || currentQuestionIndex === null ? (
              <div>Error!</div>
            ) : (
              <div>
                <div className="question">{atob(this.state.questions[currentQuestionIndex].question)}</div>
                <AnswerBox
                  options={this.combineAnswers(questions[currentQuestionIndex])}
                  selected={(answer: string) => this.handleAnswerSelection(answer)}
                  correct_answer={atob(questions[0].correct_answer)}
                />
              </div>
            )}
          </p>
        </header>
      </div>
    );
  }
}

export default App;
