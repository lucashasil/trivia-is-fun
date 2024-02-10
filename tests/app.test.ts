import { fireEvent, render, waitFor } from "@testing-library/react";

import App from "../src/App";
import React from "react";
import axios from "axios";

// Mock Axios for testing
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

test("renders App component", () => {
  const { getByText } = render(React.createElement(App));
  const loadingText = getByText(/Trivia is Fun!/i);
  expect(loadingText).toBeInTheDocument();
});

test("fetches questions when start button is clicked", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      results: [
        {
          category: "General Knowledge",
          type: "multiple",
          difficulty: "easy",
          question: "What is the capital of France?",
          correct_answer: "Paris",
          incorrect_answers: ["Berlin", "Madrid", "Rome"],
        },
      ],
    },
  });

  const { getByTestId } = render(React.createElement(App));
  const startButton = getByTestId("questions");
  fireEvent.click(startButton);

  await waitFor(() => {
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("amount=5"));
  });
});

test("handles answer selection correctly", async () => {
  mockedAxios.get.mockResolvedValueOnce({
    data: {
      results: [
        {
          category: "General Knowledge",
          type: "multiple",
          difficulty: "easy",
          question: "What is the capital of France?",
          correct_answer: "Paris",
          incorrect_answers: ["Berlin", "Madrid", "Rome"],
        },
      ],
    },
  });

  const { getByTestId, getByText } = render(React.createElement(App));
  const startButton = getByTestId("questions");
  fireEvent.click(startButton);

  const answerButton = getByText(/Paris/i);
  fireEvent.click(answerButton);
});
