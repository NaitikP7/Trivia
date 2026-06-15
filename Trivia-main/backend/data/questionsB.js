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
    questionText: '#include <iostream>\nusing namespace std;\n\n__ check();\n\nint main() {\n    check();\n}\nFill in the blank with the correct return type:',
    correctAnswer: 'void',
    category: 'Programming',
  },
  {
    id: 'B3',
    questionText: 'class Case {\npublic:\n    int x;\n};\n\nint main() {\n    Case a;\n    a.x = 10;\n\n    Case b = a;\n    b.x = 20;\n\n    cout << a.x;\n}\nOutput?',
    correctAnswer: '10',
    category: 'Programming',
  },
  {
    id: 'B4',
    questionText: 'I run before anything else begins for an object,\nSetting the stage quietly.',
    correctAnswer: 'constructor',
    category: 'Programming',
  },
  {
    id: 'B5',
    questionText: 'I take input, I return truth,\nI decide who lives or dies.\nInside me, logic hides—\nI judge without any eyes.',
    correctAnswer: 'function',
    category: 'Programming',
  },
  {
    id: 'B6',
    questionText: 'class Case {\npublic:\n    Case(){ cout << "Open "; }\n    ~Case(){ cout << "Close "; }\n};\n\nint main(){\n    Case c;\n}   output(with a space)??',
    correctAnswer: 'Open Close',
    category: 'Programming',
  },
  {
    id: 'B7',
    questionText: 'for(int i = 1; i <= 2; i++){\n    for(int j = 1; j <= 2; j++){\n        cout << i;\n    }\n}\nOutput(without space): __',
    correctAnswer: '1122',
    category: 'Programming',
  },
  {
    id: 'B8',
    questionText: 'int i = 1;while(i <= 3){    printf("%d", i);}\nThere is one line missing in the above code what is it to get output as 13?: ',
    correctAnswer: 'i=i+2;',
    category: 'Programming',
  },
  {
    id: 'B9',
    questionText: 'class Case {\npublic:\n    int id;\n\n    void set(int id) {\n        id = id;\n    }\n};\nFix the issue. and rewrite the whole corrected line',
    correctAnswer: 'this->id=id;',
    category: 'Programming',
  },
  {
    id: 'B10',
    questionText: 'int x = 5;\ncout << x++ + ++x;output??',
    correctAnswer: '12',
    category: 'Programming',
  },
  {
    id: 'B11',
    questionText: 'I offer many paths, but only one is taken,\nBased on a single value.',
    correctAnswer: 'switch case',
    category: 'Programming',
  },
  {
    id: 'B12',
    questionText: 'I can jump across functions,\nIgnoring normal flow control.',
    correctAnswer: 'goto statement',
    category: 'Programming',
  },
  {
    id: 'B13',
    questionText: 'class Case{\npublic:\n    Case(){ cout << "A"; }\n    ~Case(){ cout << "B"; }\n};\n\nint main(){\n    Case c1;\n    {\n        Case c2;\n    }\n}   \n Output(without space): __',
    correctAnswer: 'AABB',
    category: 'Programming',
  },
  {
    id: 'B14',
    questionText: 'void check(){\n    static int x = 0;\n    x++;\n    cout << x;\n}\n\nint main(){\n    check();\n    check();\n} output(without space)??',
    correctAnswer: '12',
    category: 'Programming',
  },
  {
    id: 'B15',
    questionText: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int x = 5, y = 10, z = 0;\n\n    int result = x > y ? x : y > z ? y++ : ++z;\n\n}\n\nWhat are the values of result, y, and z(with a space)?',
    correctAnswer: '10 11 0',
    category: 'Programming',
  },
  {
    id: 'B16',
    questionText: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[] = {10, 20, 30, 40};\n\n    cout << *(arr + 2) + *(2 + arr);\n    return 0;\n}\n\nWhat will be the output?',
    correctAnswer: '60',
    category: 'Programming',
  },
  {
    id: 'B17',
    questionText: 'I am not a member of your house.\nYet I can enter all your rooms.\nWhat am I?',
    correctAnswer: 'friend function',
    category: 'Programming',
  },
  {
    id: 'B18',
    questionText: 'I am created inside the crime,\nBut I vanish when it ends.\nNo matter what secrets I hold,\nI never leave with my friends.',
    correctAnswer: 'local variable',
    category: 'Programming',
  },
  {
    id: 'B19',
    questionText: '#include <iostream>\nusing namespace std;\n\nvoid update(int x) \n{\n    x = 100;\n}\n\nint main() {\n    int suspect = 10;\n    update(suspect);\n    cout << suspect;\n}\nexpected output : 100\nif the output matches the expected output, then type yes, else correct the line and rewrite the line again.',
    correctAnswer: 'void update(int &x)',
    category: 'Programming',
  },
  {
    id: 'B20',
    questionText: 'public:\n    int x;\n    Base(int a) {\n        x = a;\n    }\n};\n\nclass Derived : public Base {\npublic:\n    int y;\n\n    Derived(int a, int b) : Base(__) {\n        y = b;\n    }\n};\n\nint main() {\n    Derived d(3, 4);\n\n    int result = d.x + d.y;\n}\n\nFill the blank so that result becomes 10.',
    correctAnswer: '6',
    category: 'Programming',
  },
  {
    id: 'B21',
    questionText: '#include <iostream>\nusing namespace std;\n\nclass Crime {\npublic:\n    int *evidence;\n\n    Crime(int value) {\n        evidence = ___;   // Fill this line\n    }\n\n    void show() {\n        cout << *evidence;\n    }\n};\n\nint main() {\n    Crime c(50);\n    c.show();\n}\nFill in the blank so that:\nthe output is 50\nNo memory or dangling pointer bug occurs',
    correctAnswer: 'new int(value)',
    category: 'Programming',
  },
];

export default questionsB;
