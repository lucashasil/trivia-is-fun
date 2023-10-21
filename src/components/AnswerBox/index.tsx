import React from 'react';
import './style.scss'

type Props = {
  options: string[];
  selected: (answer: string) => void;
  correct_answer: string;
};

class AnswerBox extends React.Component<Props> {
  render() {
    const { options, selected } = this.props;
    return (
      <div className="AnswerBox">
        {options.map((option, index) => (
          <button key={index} className="answerBtn" onClick={() => selected(option)}>
              {option}
          </button>
        ))}
      </div>
    );
  }
}

export default AnswerBox;
