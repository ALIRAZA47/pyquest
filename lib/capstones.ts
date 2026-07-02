import type { Difficulty } from "./types";

// End-of-course capstone projects — small, self-contained builds that combine
// skills. They run in the in-browser Python runtime (no stdin), so each uses
// preset sample data and prints results.

export interface Capstone {
  id: string;
  title: string;
  icon: string; // glyph name
  difficulty: Difficulty;
  blurb: string;
  description: string; // markdown
  requirements: string[];
  starterCode: string;
  solution: string;
  xp: number;
}

export const CAPSTONES: Capstone[] = [
  {
    id: "temperature-converter",
    title: "Temperature Converter",
    icon: "convert",
    difficulty: "Beginner",
    blurb: "Write functions to convert between Celsius and Fahrenheit.",
    description:
      "Build two small functions that convert temperatures, then print a tidy conversion table with formatted numbers. Great practice with **functions**, **arithmetic**, and **f-strings**.",
    requirements: [
      "Define `c_to_f(c)` returning Celsius converted to Fahrenheit",
      "Define `f_to_c(f)` returning Fahrenheit converted to Celsius",
      "Print at least one conversion using an f-string with 1 decimal place",
    ],
    starterCode: `def c_to_f(c):
    # TODO: return c converted to Fahrenheit  (c * 9/5 + 32)
    pass

def f_to_c(f):
    # TODO: return f converted to Celsius  ((f - 32) * 5/9)
    pass

for c in [0, 25, 100]:
    print(c, "C =", c_to_f(c), "F")
`,
    solution: `def c_to_f(c):
    return c * 9 / 5 + 32

def f_to_c(f):
    return (f - 32) * 5 / 9

for c in [0, 25, 100]:
    print(f"{c}°C = {c_to_f(c):.1f}°F")

print(f"98.6°F = {f_to_c(98.6):.1f}°C")
`,
    xp: 60,
  },
  {
    id: "fizzbuzz",
    title: "FizzBuzz",
    icon: "loop",
    difficulty: "Beginner",
    blurb: "The classic interview warm-up: numbers, Fizz, Buzz, FizzBuzz.",
    description:
      "Loop from 1 to 20. Print **Fizz** for multiples of 3, **Buzz** for multiples of 5, **FizzBuzz** for multiples of both, and the number otherwise. A rite of passage that drills **loops**, **conditionals**, and the **modulo** operator.",
    requirements: [
      "Loop through the numbers 1 to 20",
      "Print 'Fizz' for multiples of 3 and 'Buzz' for multiples of 5",
      "Print 'FizzBuzz' when divisible by both, otherwise the number",
    ],
    starterCode: `for n in range(1, 21):
    # TODO: print Fizz / Buzz / FizzBuzz / or the number itself
    print(n)
`,
    solution: `for n in range(1, 21):
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)
`,
    xp: 60,
  },
  {
    id: "word-counter",
    title: "Word Frequency Counter",
    icon: "hash",
    difficulty: "Intermediate",
    blurb: "Count how often each word appears using a dictionary.",
    description:
      "Given a sentence, count how many times each word appears and print the results, most common first. Combines **strings**, **dictionaries**, and a little **sorting**.",
    requirements: [
      "Split the text into words",
      "Build a dict mapping each word to its count",
      "Print each word with its count",
    ],
    starterCode: `text = "the cat sat on the mat the cat purred"

counts = {}
# TODO: fill counts so counts[word] is how many times word appears

for word, n in counts.items():
    print(word, n)
`,
    solution: `text = "the cat sat on the mat the cat purred"

counts = {}
for word in text.split():
    counts[word] = counts.get(word, 0) + 1

for word, n in sorted(counts.items(), key=lambda pair: -pair[1]):
    print(f"{word}: {n}")
`,
    xp: 80,
  },
  {
    id: "todo-list",
    title: "To-Do List",
    icon: "list",
    difficulty: "Intermediate",
    blurb: "Model a to-do list with a class — add tasks and check them off.",
    description:
      "Design a `TodoList` class that stores tasks and whether they're done. This is your first real taste of **object-oriented programming**: state (`self.tasks`) plus behavior (methods).",
    requirements: [
      "Create a `TodoList` class that stores tasks",
      "`add(task)` adds a task as not-done",
      "`complete(task)` marks a task done",
      "`show()` prints each task with `[x]` or `[ ]`",
    ],
    starterCode: `class TodoList:
    def __init__(self):
        self.tasks = {}

    def add(self, task):
        # TODO: store the task as not done
        pass

    def complete(self, task):
        # TODO: mark the task done
        pass

    def show(self):
        # TODO: print each task with [x] or [ ]
        pass

todo = TodoList()
todo.add("Learn Python")
todo.add("Build a project")
todo.complete("Learn Python")
todo.show()
`,
    solution: `class TodoList:
    def __init__(self):
        self.tasks = {}

    def add(self, task):
        self.tasks[task] = False

    def complete(self, task):
        if task in self.tasks:
            self.tasks[task] = True

    def show(self):
        for task, done in self.tasks.items():
            box = "[x]" if done else "[ ]"
            print(box, task)

todo = TodoList()
todo.add("Learn Python")
todo.add("Build a project")
todo.complete("Learn Python")
todo.show()
`,
    xp: 90,
  },
  {
    id: "password-checker",
    title: "Password Strength Checker",
    icon: "lock",
    difficulty: "Intermediate",
    blurb: "Rate passwords strong or weak using string methods.",
    description:
      "Write a function that labels a password **strong** or **weak**. A password is strong if it's at least 8 characters and contains both a digit and a letter. Practices **conditions**, **string methods**, and the handy `any()` built-in.",
    requirements: [
      "A password is 'strong' if length ≥ 8 AND it has a digit AND a letter",
      "Otherwise it's 'weak'",
      "Check several sample passwords and print the verdict for each",
    ],
    starterCode: `def strength(pw):
    # TODO: return "strong" if len>=8 and it has a digit and a letter, else "weak"
    pass

for pw in ["abc", "password", "hunter2", "s3cur3pass"]:
    print(pw, "->", strength(pw))
`,
    solution: `def strength(pw):
    long_enough = len(pw) >= 8
    has_digit = any(c.isdigit() for c in pw)
    has_alpha = any(c.isalpha() for c in pw)
    if long_enough and has_digit and has_alpha:
        return "strong"
    return "weak"

for pw in ["abc", "password", "hunter2", "s3cur3pass"]:
    print(f"{pw} -> {strength(pw)}")
`,
    xp: 90,
  },
  {
    id: "bank-account",
    title: "Bank Account",
    icon: "shield",
    difficulty: "Advanced",
    blurb: "A class with deposits, withdrawals, and a custom exception.",
    description:
      "Build a `BankAccount` class that protects its balance. Withdrawing more than you have should raise a **custom exception** you catch with `try`/`except`. Combines **OOP** with **error handling** — a very real-world pattern.",
    requirements: [
      "Create an `InsufficientFunds` exception (subclass of `Exception`)",
      "`deposit(amount)` increases the balance",
      "`withdraw(amount)` raises `InsufficientFunds` if amount > balance",
      "Catch the exception with try/except and keep going",
    ],
    starterCode: `class InsufficientFunds(Exception):
    pass

class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        # TODO
        pass

    def withdraw(self, amount):
        # TODO: raise InsufficientFunds if amount > balance, else subtract it
        pass

acct = BankAccount(100)
acct.deposit(50)
try:
    acct.withdraw(500)
except InsufficientFunds:
    print("Not enough money!")
print("Balance:", acct.balance)
`,
    solution: `class InsufficientFunds(Exception):
    pass

class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFunds(
                f"Tried to withdraw {amount}, but balance is {self.balance}"
            )
        self.balance -= amount

acct = BankAccount(100)
acct.deposit(50)
try:
    acct.withdraw(500)
except InsufficientFunds as e:
    print("Error:", e)
acct.withdraw(120)
print("Balance:", acct.balance)
`,
    xp: 110,
  },
];

export function getCapstone(id: string): Capstone | undefined {
  return CAPSTONES.find((c) => c.id === id);
}
