# SBA 308 

This project processes course, assignment group, and learner submission data to produce a weighted average per learner and assignment score percentages.

## Features
- Excludes assignments that are not yet due
- Applies a 10% late penalty based on points_possible
- Computes weighted average using points_possible
- Uses arrays, objects, functions, conditionals, loops, and try/catch error handling

## How to Run
1. Open `index.js`
2. Run in CodeSandbox or Node:
   - `node index.js`

## Output
Logs an array of learner objects:
- `id`: learner id
- `avg`: weighted average
- assignment IDs as keys with score percentages
