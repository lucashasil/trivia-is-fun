import "./style.scss";

import React from "react";

type Props = {
  options: string[];
  selected: (answer: string) => void;
  correctAnswer: string;
  incorrectSelected: string[];
};

// This component is responsible for rendering the answer options for the user to select
class AnswerBox extends React.Component<Props> {
  render() {
    const { options, incorrectSelected, selected } = this.props;

    // This will render the answer options for the user to select, make
    // sure that we highlight answers that were selected incorrectly
    return (
      <div className="AnswerBox">
        {options.map((option, index) => (
          <button
            key={index}
            className={`answerBtn ${
              incorrectSelected.includes(option) ? "incorrectSelected" : ""
            } ${options.length > 2 ? "multiple" : ""}`}
            onClick={() => selected(option)}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }
}

export default AnswerBox;
