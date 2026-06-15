/**
 * Question Set A
 * Each question has: id, questionText, correctAnswer, category
 * Answers are validated as case-insensitive text matches.
 */
const questionsA = [
  {
    id: 'A1',
    questionText: 'int x = 1, y = 0;\nif(x-- || ++y)\n    printf("%d %d", x, y);',
    correctAnswer: '0 0',
    category: 'Programming',
  },
  {
    id: 'A2',
    questionText: '#include <stdio.h>\nint main(){\n    int arr[] = {1,2,3,4};\n    int *p = arr;\n    printf("%d", *(p + *(p+2)));\n}',
    correctAnswer: '4',
    category: 'Programming',
  },
  {
    id: 'A3',
    questionText: 'char str[] = "Hello";\nprintf("%lu %lu", sizeof(str), strlen(str));',
    correctAnswer: '6 5',
    category: 'Programming',
  },
  {
    id: 'A4',
    questionText: 'What element does the chemical symbol "Au" represent?',
    correctAnswer: 'Gold',
    category: 'Science',
  },
  {
    id: 'A5',
    questionText: 'In which year did the Titanic sink?',
    correctAnswer: '1912',
    category: 'History',
  },
  {
    id: 'A6',
    questionText: 'No one sees what lies beneath,\nTheir actions masked like silent teeth.\nWho is the killer?',
    correctAnswer: 'abstraction',
    category: 'Programming',
  },
  {
    id: 'A7',
    questionText: 'question 21\n#include <iostream>\nusing namespace std;\n\nint modify(int a, int &b) {\n    a = a + 2;\n    b = b + 3;\n    return a + b;\n}\n\nint main() {\n    int x = 2, y = 3;\n\n    int result = modify(x, y);\n}\n\nWhat are the values of x, y, and result(with a space)?',
    correctAnswer: '2 6 10',
    category: 'Programming',
  },
  {
    id: 'A8',
    questionText: 'Who wrote the play "Romeo and Juliet"?',
    correctAnswer: 'William Shakespeare',
    category: 'Literature',
  },
  {
    id: 'A9',
    questionText: 'What is the hardest natural substance on Earth?',
    correctAnswer: 'Diamond',
    category: 'Science',
  },
  {
    id: 'A10',
    questionText: 'Which country is home to the Great Barrier Reef?',
    correctAnswer: 'Australia',
    category: 'Geography',
  },
];

export default questionsA;
