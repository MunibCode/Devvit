-- Devvit — Milestone 5: Seed code duel problems + rating function
-- Placeholder problems to power the arena until AI generation (M6) is live.

-- Adjust a builder's duel rating (used by recordDuelResult).
create or replace function public.adjust_rating(builder_id uuid, delta int)
returns void
language sql
security definer set search_path = public
as $$
  update profiles
  set duel_rating = greatest(100, duel_rating + delta)
  where id = builder_id;
$$;

insert into duel_problems (title, description, difficulty, initial_code, test_cases)
values
  (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. Return the answer as an array [i, j].',
    'easy',
    '{"javascript": "function twoSum(nums, target) {\n  // write your solution here\n}"}',
    '[
      {"input": [[2,7,11,15], 9], "expected": [0,1]},
      {"input": [[3,2,4], 6], "expected": [1,2]},
      {"input": [[3,3], 6], "expected": [0,1]}
    ]'
  ),
  (
    'Reverse a String',
    'Given a string s, return a new string with the characters in reverse order.',
    'easy',
    '{"javascript": "function reverseString(s) {\n  // write your solution here\n}"}',
    '[
      {"input": ["hello"], "expected": "olleh"},
      {"input": ["A man, a plan"], "expected": "nalp a ,nam A"},
      {"input": [""], "expected": ""}
    ]'
  ),
  (
    'Valid Parentheses',
    'Given a string s containing just the characters ( ) { } [ ], determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets in the correct order.',
    'medium',
    '{"javascript": "function isValid(s) {\n  // write your solution here\n}"}',
    '[
      {"input": ["()"], "expected": true},
      {"input": ["()[]{}"], "expected": true},
      {"input": ["(]"], "expected": false}
    ]'
  ),
  (
    'Find the Duplicate Number',
    'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, there is exactly one duplicate. Return the duplicate number. Your solution must run in O(n) time and use only constant extra space.',
    'hard',
    '{"javascript": "function findDuplicate(nums) {\n  // write your solution here\n}"}',
    '[
      {"input": [[1,3,4,2,2]], "expected": 2},
      {"input": [[3,1,3,4,2]], "expected": 3}
    ]'
  );
