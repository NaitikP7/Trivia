/**
 * Question Set B
 * Each question has: id, questionText, correctAnswer, category
 * Answers are validated as case-insensitive text matches.
 */
const questionsB = [
  {
    id: 'B1',
    questionText: '#include <iostream>\n    using namespace std;\nint main(){\nstring name = "John";\n}\nwhat is missing?',
    correctAnswer: '#include<string>',
    category: 'Programming',
  },
  {
    id: 'B2',
    questionText: 'What is the chemical formula for water?',
    correctAnswer: 'H2O',
    category: 'Science',
  },
  {
    id: 'B3',
    questionText: 'Who discovered penicillin?',
    correctAnswer: 'Alexander Fleming',
    category: 'Science',
  },
  {
    id: 'B4',
    questionText: 'int i = 1;while(i <= 3){    printf("%d", i);}\nThere is one line missing in the above code what is it to get output as 13?: ',
    correctAnswer: 'i=i+2;',
    category: 'Programming',
  },
  {
    id: 'B5',
    questionText: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5, y = 10, z = 0;\n\n    int result = x > y ? x : y > z ? y++ : ++z;\n\n}\n\nWhat are the values of result, y, and z(with a space)?',
    correctAnswer: '10 11 0',
    category: 'Programming',
  },
  {
    id: 'B6',
    questionText: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[] = {10, 20, 30, 40};\n\n    cout << *(arr + 2) + *(2 + arr);\n    return 0;\n}\n\nWhat will be the output?',
    correctAnswer: '60',
    category: 'Programming',
  },
  {
    id: 'B7',
    questionText: 'What planet is closest to the Sun?',
    correctAnswer: 'Mercury',
    category: 'Science',
  },
  {
    id: 'B8',
    questionText: 'Who composed the "Four Seasons"?',
    correctAnswer: 'Vivaldi',
    category: 'Music',
  },
  {
    id: 'B9',
    questionText: 'What is the currency of Japan?',
    correctAnswer: 'Yen',
    category: 'General Knowledge',
  },
  {
    id: 'B10',
    questionText: 'public:\n    int x;\n    Base(int a) {\n        x = a;\n    }\n};\n\nclass Derived : public Base {\npublic:\n    int y;\n\n    Derived(int a, int b) : Base(__) {\n        y = b;\n    }\n};\n\nint main() {\n    Derived d(3, 4);\n\n    int result = d.x + d.y;\n}\n\nFill the blank so that result becomes 10.',
    correctAnswer: '6',
    category: 'Programming',
  },
];

export default questionsB;
