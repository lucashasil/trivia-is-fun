import React from 'react';
import './style.scss'

type Props = {
  options: string[];
  selected: (answer: string) => void;
  correctAnswer: string;
  incorrectSelected: string[];
};

class AnswerBox extends React.Component<Props> {
  render() {
    const { options, incorrectSelected, selected } = this.props;
    console.log("incorrectselected = ", incorrectSelected)
    return (
      <div className="AnswerBox">
        {options.map((option, index) => (
          <button key={index} className={`answerBtn ${incorrectSelected.includes(option) ? 'incorrectSelected' : ''}`} onClick={() => selected(option)}>
              {option}
          </button>
        ))}
      </div>
    );
  }
}

export default AnswerBox;
