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

// if somthing that must be true is not true, stop the program and show an error message.
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// convert a value into a naumber and make sure it really is a valid number.
function toNumber(value, fieldName) {
  const num = Number(value);
  if (!Number.isFinite(num)) throw new Error(`Invalid number for ${fieldName}: ${value}`);
  return num;
}
// Turn a date sting into a Date object and mak sure it is a real date.
function toDate(value, fieldName) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date for ${fieldName}: ${value}`);
  return d;
}
// Round a number to 3 decimal
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
  const now = new Date(); 


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

   
    // Build a map of due assignments only ----------------------

    const dueAssignmentsById = new Map();

    for (const assignment of ag.assignments) {
      const assignmentId = toNumber(assignment.id, "assignment.id");
      const pointsPossible = toNumber(assignment.points_possible, `assignment(${assignmentId}).points_possible`);
      const dueAt = toDate(assignment.due_at, `assignment(${assignmentId}).due_at`);

    
      if (pointsPossible <= 0) {
        throw new Error(`Invalid points_possible for assignment ${assignmentId}: must be > 0`);
      } else {
        
      }

      // exclude assignments not yet due
      if (dueAt <= now) {
        dueAssignmentsById.set(assignmentId, { assignmentId, pointsPossible, dueAt });
      } else {
        continue; 
      }
    }

    // Create learner records ----------------------------------

    const learnersById = new Map();

    // using loop
    for (let i = 0; i < submissions.length; i++) {
      const sub = submissions[i];

      const learnerId = toNumber(sub.learner_id, "submission.learner_id");
      const assignmentId = toNumber(sub.assignment_id, "submission.assignment_id");

      // ignore submissions for assignments not due 
      const assignmentInfo = dueAssignmentsById.get(assignmentId);
      if (!assignmentInfo) continue;

      assert(sub.submission && typeof sub.submission === "object", "submission.submission must be an object");
      const submittedAt = toDate(sub.submission.submitted_at, "submission.submitted_at");
      let score = toNumber(sub.submission.score, "submission.score");

      
      // We'll categorize submission timing
      const isLate = submittedAt > assignmentInfo.dueAt;
      let timingLabel = "on-time";
      switch (true) {
        case isLate:
          timingLabel = "late";
          break;
        default:
          timingLabel = "on-time";
      }

      // late penalty rule
      if (timingLabel === "late") {
        score = applyLatePenalty(score, assignmentInfo.pointsPossible);
      }

      // keep score from going below 0
      if (score < 0) score = 0;

      // create learner object if missing
      if (!learnersById.has(learnerId)) {
        learnersById.set(learnerId, {
          id: learnerId,
          earnedPoints: 0,
          possiblePoints: 0,
          scores: {} 
        });
      }

      const learner = learnersById.get(learnerId);

      // percent calculation
       // object manipulation: add/update property
         // weighted totals
         // If percent is exactly 0, remove it  

      const percent = score / assignmentInfo.pointsPossible;

      learner.scores[assignmentId] = round3(percent);
      learner.earnedPoints += score;
      learner.possiblePoints += assignmentInfo.pointsPossible;
    
      if (learner.scores[assignmentId] === 0) {
        delete learner.scores[assignmentId];
      }

      // If any submission has a negative score, remove it from the array.
      
      if (sub.submission.score < 0) {
        submissions.splice(i, 1); 
        break; 
      }
    }

    //Format output array ------------------------------------------------

    const result = [];

    // Convert Map -> array output
    for (const learner of learnersById.values()) {
      const avg =
        learner.possiblePoints > 0
          ? learner.earnedPoints / learner.possiblePoints
          : 0;

      const outputObj = {
        id: learner.id,
        avg: round3(avg),
        ...learner.scores
      };

      result.push(outputObj);
    }

    return result;
  } catch (err) {
    console.error("getLearnerData error:", err.message);
    throw err;
  }
}
// Run + Output------------------------------------------------------------------

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);