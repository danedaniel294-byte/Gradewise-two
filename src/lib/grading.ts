export type GradingSystem = {
  name: string;
  gradingScale: {
    grade: string;
    points: number;
    range: string;
  }[];
  classification: {
    class: string;
    minCgpa: number;
  }[];
};

export const UNIVERSITIES: Record<string, GradingSystem> = {
  "University of Ghana (UG)": {
    name: "University of Ghana",
    gradingScale: [
      { grade: "A", points: 4.0, range: "80-100" },
      { grade: "B+", points: 3.5, range: "75-79" },
      { grade: "B", points: 3.0, range: "70-74" },
      { grade: "C+", points: 2.5, range: "65-69" },
      { grade: "C", points: 2.0, range: "60-64" },
      { grade: "D+", points: 1.5, range: "55-59" },
      { grade: "D", points: 1.0, range: "50-54" },
      { grade: "E", points: 0.5, range: "45-49" },
      { grade: "F", points: 0.0, range: "0-44" },
    ],
    classification: [
      { class: "First Class", minCgpa: 3.6 },
      { class: "Second Class Upper", minCgpa: 3.0 },
      { class: "Second Class Lower", minCgpa: 2.0 },
      { class: "Third Class", minCgpa: 1.5 },
      { class: "Pass", minCgpa: 1.0 },
      { class: "Fail", minCgpa: 0.0 },
    ],
  },
  "KNUST (CWA)": {
    name: "KNUST",
    gradingScale: [
      { grade: "A", points: 85, range: "70-100" },
      { grade: "B", points: 65, range: "60-69" },
      { grade: "C", points: 55, range: "50-59" },
      { grade: "D", points: 45, range: "40-49" },
      { grade: "F", points: 20, range: "0-39" },
    ],
    classification: [
      { class: "First Class", minCgpa: 70.0 },
      { class: "Second Class Upper", minCgpa: 60.0 },
      { class: "Second Class Lower", minCgpa: 50.0 },
      { class: "Pass", minCgpa: 40.0 },
      { class: "Fail", minCgpa: 0.0 },
    ],
  },
  "UCC / UDS / UMAT": {
    name: "Standard 4.0 System",
    gradingScale: [
      { grade: "A", points: 4.0, range: "80-100" },
      { grade: "B+", points: 3.5, range: "75-79" },
      { grade: "B", points: 3.0, range: "70-74" },
      { grade: "C+", points: 2.5, range: "65-69" },
      { grade: "C", points: 2.0, range: "60-64" },
      { grade: "D+", points: 1.5, range: "55-59" },
      { grade: "D", points: 1.0, range: "50-54" },
      { grade: "E", points: 0.0, range: "0-49" },
    ],
    classification: [
      { class: "First Class", minCgpa: 3.6 },
      { class: "Second Class Upper", minCgpa: 3.0 },
      { class: "Second Class Lower", minCgpa: 2.5 },
      { class: "Third Class", minCgpa: 2.0 },
      { class: "Pass", minCgpa: 1.0 },
      { class: "Fail", minCgpa: 0.0 },
    ],
  },
};

export function calculateGpa(courses: { credits: number; gradePoints: number }[]) {
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalPoints = courses.reduce((sum, c) => sum + c.credits * c.gradePoints, 0);
  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}

export function calculateRequiredGpa(
  currentCgpa: number,
  completedCredits: number,
  targetCgpa: number,
  remainingCredits: number
) {
  const totalCredits = completedCredits + remainingCredits;
  const targetTotalPoints = targetCgpa * totalCredits;
  const currentTotalPoints = currentCgpa * completedCredits;
  const requiredPoints = targetTotalPoints - currentTotalPoints;
  const requiredGpa = requiredPoints / remainingCredits;
  return requiredGpa;
}
