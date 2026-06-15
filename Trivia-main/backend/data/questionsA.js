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
    questionText: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 2;\n\n    switch(x) {\n        case 1: cout << "A ";\n        case 2: cout << "B ";\n        case 3: cout << "C ";\n        default: cout << "D";\n    }\n\n    return 0;\n}\n What is the output(with a space)?',
    correctAnswer: 'B C D',
    category: 'Programming',
  },
  {
    id: 'A5',
    questionText: 'At the crime scene, a note read:\n"I was created once, my size sealed forever…\nNo one can add to me, no one can take away.\nFind me, and you’ll find the killer."\nWhat am I?',
    correctAnswer: 'Array',
    category: 'Programming',
  },
  {
    id: 'A6',
    questionText: 'No one sees what lies beneath,\nTheir actions masked like silent teeth.\nWho is the killer?',
    correctAnswer: 'abstraction',
    category: 'Programming',
  },
  {
    id: 'A7',
    questionText: 'int i, count = 0;\nfor(i = 1; i <= 5; i++){\nif(i % 2 == 0)\ncount++;\n}\nprintf("%d", count);\nWrite the output (number): ______',
    correctAnswer: '2',
    category: 'Programming',
  },
  {
    id: 'A8',
    questionText: '#include<iostream>\n\nint main(){\ncout << "Clue Found";\nreturn 0;\n}\nWhat is missing? (write the missing part of the code): ______',
    correctAnswer: 'using namespace std;',
    category: 'Programming',
  },
  {
    id: 'A9',
    questionText: 'int arr[3] = {10,20,30};\nint *p = arr;\n\nprintf("%d", ______ );\n\nPrint second element:',
    correctAnswer: '*(p+1)',
    category: 'Programming',
  },
  {
    id: 'A10',
    questionText: '// #include <iostream>\nusing namespace std;\n\nclass A {\npublic:\n    int x;\n    A() {\n        x = 2;\n    }\n};\n\nclass B : public A {\npublic:\n    int y;\n\n    B() {\n        y = x + 3;\n    }\n};\n\nint main() {\n    B obj;\n    int result = obj.y;\n}',
    correctAnswer: '5',
    category: 'Programming',
  },
  {
    id: 'A11',
    questionText: 'I connect code pieces but don\'t execute myself.\nWithout me, compilation fails.\nWhat am I?',
    correctAnswer: 'header file',
    category: 'Programming',
  },
  {
    id: 'A12',
    questionText: 'I am not alive, yet I create many.\nEach one behaves as I define.\nWithout me, no suspect exists—\nI am the design behind the crime.',
    correctAnswer: 'function overloading',
    category: 'Programming',
  },
  {
    id: 'A13',
    questionText: 'The Vanishing Number\nint f(int n){\n    if(n <= 0) return 0;\n    return (n % 2) + f(n/2);\n}\n\nVictim: n = 13',
    correctAnswer: '3',
    category: 'Programming',
  },
  {
    id: 'A14',
    questionText: 'The Misleading Operator\n#include <stdio.h>\nint main(){\n    int x = 2;\n    printf("%d", x << 1 + 2);\n}\nWho did it?',
    correctAnswer: '16',
    category: 'Programming',
  },
  {
    id: 'A15',
    questionText: 'A suspect is "Caught" if:\nEither x and z are equal or x is greater than y and y is greater than z\nstring check(int x, int y, int z){\nif(---------------------)\nreturn "Caught";\nelse\nreturn "Free";\n}\nIf x = 5, y = 3, z = 5\nWhat will be the exact condition if the suspect is caught?',
    correctAnswer: [
      '(x == z) || (x > y && y > z)',
      'x == z || x > y && y > z',
      '((x == z) || ((x > y) && (y > z)))',
      '(x == z) || ((x > y) && (y > z))',
      '(x==z)||(x>y&&y>z)',
      'x==z||x>y&&y>z',
      '((x==z)||((x>y)&&(y>z)))',
      '(x==z)||((x>y)&&(y>z))'
    ],
    category: 'Programming',
  },
  {
    id: 'A16',
    questionText: 'Output :\n*\n***\n*****\nfor(int i = 1; i <= 3; i++){\nfor(int j = 1; j <=____ ; j++){\nprintf("*");\n}\nprintf("\\n");\n}\nFill in the blank : ____________',
    correctAnswer: [
      '(2*i-1)',
      '2*i-1',
      '(2 * i - 1)',
      '2 * i - 1',
      '(2*i - 1)',
      '2*i - 1'
    ],
    category: 'Programming',
  },
  {
    id: 'A17',
    questionText: 'I hide my secrets from the outside world,\nYet allow access through trusted methods.\nWho am I?',
    correctAnswer: 'encapsulation',
    category: 'Programming',
  },
  {
    id: 'A18',
    questionText: 'I replace behavior of my parent,\nBut only if rules are followed.',
    correctAnswer: 'function overriding',
    category: 'Programming',
  },
  {
    id: 'A19',
    questionText: 'int f(int n){\nif(n <= 1)\nreturn n;\nreturn f(n-1) + f(n-2);\n}\n\nIf n = 4\nWrite the returned value (number): ______',
    correctAnswer: '3',
    category: 'Programming',
  },
  {
    id: 'A20',
    questionText: 'int f(int n){\nif(n <= 0)\nreturn 0;\nreturn n + f(n-2);\n}\n\nIf n = 5\nWrite the returned value (number): ______',
    correctAnswer: '9',
    category: 'Programming',
  },
  {
    id: 'A21',
    questionText: '#include <iostream>\nusing namespace std;\n\nint modify(int a, int &b) {\n    a = a + 2;\n    b = b + 3;\n    return a + b;\n}\n\nint main() {\n    int x = 2, y = 3;\n\n    int result = modify(x, y);\n}\n\nWhat are the values of x, y, and result(with a space)?',
    correctAnswer: '2 6 10',
    category: 'Programming',
  },
];

export default questionsA;
