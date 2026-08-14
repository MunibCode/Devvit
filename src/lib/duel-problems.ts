export type PlaceholderProblem = {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  initial_code: { javascript: string };
  test_cases: { input: unknown; expected: unknown }[];
};

export const placeholderProblems: PlaceholderProblem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer as an array [i, j].",
    difficulty: "easy",
    initial_code: {
      javascript:
        "function twoSum(nums, target) {\n  // write your solution here\n}",
    },
    test_cases: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { input: [[3, 2, 4], 6], expected: [1, 2] },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
  },
  {
    id: "reverse-string",
    title: "Reverse a String",
    description:
      "Given a string s, return a new string with the characters in reverse order.",
    difficulty: "easy",
    initial_code: {
      javascript: "function reverseString(s) {\n  // write your solution here\n}",
    },
    test_cases: [
      { input: ["hello"], expected: "olleh" },
      { input: ["A man, a plan"], expected: "nalp a ,nam A" },
      { input: [""], expected: "" },
    ],
  },
];
