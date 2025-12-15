//----------------------------------------
// SBA: JavaScript Fundamentals
//----------------------------------------

//------- Declare variable------------

// The provider course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provider assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    { id: 1, name: "Declare a Variable", due_at: "2023-01-25", points_possible: 50 },
    { id: 2, name: "Write a Function", due_at: "2023-02-27", points_possible: 150 },
    { id: 3, name: "Code the World", due_at: "3156-11-15", points_possible: 500 }
  ]
};

// The provider learner submission data.
const LearnerSubmissions = [
  { learner_id: 125, assignment_id: 1, submission: { submitted_at: "2023-01-25", score: 47 } },
  { learner_id: 125, assignment_id: 2, submission: { submitted_at: "2023-02-12", score: 150 } },
  { learner_id: 125, assignment_id: 3, submission: { submitted_at: "2023-01-25", score: 400 } },
  { learner_id: 132, assignment_id: 1, submission: { submitted_at: "2023-01-24", score: 39 } },
  { learner_id: 132, assignment_id: 2, submission: { submitted_at: "2023-03-07", score: 140 } }
];

// ------ Helper Function --------

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function toNumber(value, fieldName) {
  const num = Number(value);
  if (!Number.isFinite(num)) throw new Error(`Invalid number for ${fieldName}: ${value}`);
  return num;
}

function toDate(value, fieldName) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date for ${fieldName}: ${value}`);
  return d;
}

function round3(n) {
  return Number(n.toFixed(3));
}


// late penalty: subtract 10% of points possible from the score
// operators used here; -, *

function applyLatePenalty(score, pointsPossible) {
  const penalty = 0.1 * pointsPossible;
  return score - penalty;
}

// ------------------Main Function---------------------------

// create function getLearnerData
 // strings, numbers, booleans cached in variables
  // flip to true if you want extra logs

function getLearnerData(course, ag, submissions) {
  const appName = "SBA 308 Learner Data Processor";
  const isDebugMode = false; 
  const now = new Date(); // date used for "not yet due"


// Validation (try/catch ) ------------------------
  try {

    assert(course && typeof course === "object", `${appName}: CourseInfo must be an object`);
    assert(ag && typeof ag === "object", `${appName}: AssignmentGroup must be an object`);
    assert(Array.isArray(submissions), `${appName}: LearnerSubmissions must be an array`);

    const courseId = toNumber(course.id, "course.id");
    const groupCourseId = toNumber(ag.course_id, "ag.course_id");
    
// if/else statements (control flow)----------------------
    if (groupCourseId !== courseId) {
      throw new Error(
        `Invalid input: AssignmentGroup.course_id (${groupCourseId}) does not match CourseInfo.id (${courseId}).`
      );
    } else if (isDebugMode) {
      console.log("Course + assignment group relationship: OK");
    }

    assert(Array.isArray(ag.assignments), "ag.assignments must be an array");
