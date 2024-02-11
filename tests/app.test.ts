
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import App from "../src/App";

import React from "react";
import axios from "axios";
import userEvent from "@testing-library/user-event";

// Mock Axios for testing
jest.mock("axios");
const mockedAxios = axios as jest.MockedFunction<typeof axios>;

test("renders App component", () => {
  const { getByText } = render(React.createElement(App));
  const titleText = getByText(/Trivia is Fun!/i);
  expect(titleText).toBeInTheDocument();
});

test("fetches questions when start button is clicked", async () => {
  mockedAxios.mockResolvedValueOnce({
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

  const { getByRole} = render(React.createElement(App));

  const inputElement = await waitFor(() =>
    screen.getByLabelText(/How many questions would you like?/i)
  );

  userEvent.clear(inputElement);
  userEvent.type(inputElement, "1");
  await waitFor(() => {
    expect((inputElement as HTMLInputElement).value).toBe("1");
  });

  const startButton = getByRole("button", { name: "Start" });
  fireEvent.click(startButton);

  await waitFor(() => {
    // NOTE: we check that axios.get was called TWICE because we need to
    // use it twice in the main fetchQuestions function:
    // 1. to fetch the NUMBER of available questions
    // 2. to fetch the actual questions themselves
    expect(mockedAxios.get).toHaveBeenCalledTimes(2);

    // Check the two separate endpoints were called
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("api_count"));
    expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining("amount=1"));
  });
});

test("handles answer selection correctly", async () => {
  mockedAxios.mockResolvedValueOnce({
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

  const { getByRole, findByText } = render(React.createElement(App));

  const inputElement = await waitFor(() =>
    screen.getByLabelText(/How many questions would you like?/i)
  );

  userEvent.clear(inputElement);
  userEvent.type(inputElement, "1");
  await waitFor(() => {
    expect((inputElement as HTMLInputElement).value).toBe("1");
  });

  const startButton = getByRole("button", { name: "Start" });
  fireEvent.click(startButton);

  // Wait for the answers to be rendered
  waitFor(async () => {
    // Simulate clicking the answer button
    const answerButton = await findByText("Paris");
    fireEvent.click(answerButton);
  });
});
