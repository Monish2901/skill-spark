// Engagement prediction algorithm
// Weighted score: marks (90%) + timing (5%) + attempts (5%)

export interface EngagementInput {
  level1Score: number | null; // percentage
  level2Score: number | null; // percentage
  level3Completed: boolean;
  totalAttempts: number;
  level1Passed: boolean;
  level2Passed: boolean;
  avgTimeTakenSeconds: number | null; // average time across attempts
}

export type EngagementLevel = 'Highly Engaged' | 'Moderately Engaged' | 'Low Engaged';

/**
 * Calculates a weighted engagement score:
 * - Marks obtained: 90% weight (average of best scores across levels, 0-100)
 * - Timing: 5% weight (faster = better, benchmarked against 30 min for 30 MCQs)
 * - Attempts: 5% weight (fewer attempts = better efficiency)
 */
export function calculateEngagementScore(input: EngagementInput): number {
  const { level1Score, level2Score, level3Completed, totalAttempts, avgTimeTakenSeconds } = input;

  // 1. Marks component (90%) - average of available scores
  const scores: number[] = [];
  if (level1Score !== null) scores.push(level1Score);
  if (level2Score !== null) scores.push(level2Score);
  if (level3Completed) scores.push(100); // full marks for completing level 3
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const marksComponent = (avgScore / 100) * 90;

  // 2. Timing component (5%) - benchmark: 30 min (1800s) for 30 questions
  // Faster completion = higher score, capped at 100%
  const benchmarkTime = 1800; // 30 minutes in seconds
  let timingScore = 50; // default if no time data
  if (avgTimeTakenSeconds !== null && avgTimeTakenSeconds > 0) {
    // If completed in half the benchmark or less → 100%, at benchmark → 50%, over 2x → 0%
    timingScore = Math.max(0, Math.min(100, ((2 * benchmarkTime - avgTimeTakenSeconds) / benchmarkTime) * 50));
  }
  const timingComponent = (timingScore / 100) * 5;

  // 3. Attempts component (5%) - fewer attempts = better
  // 1 attempt per level = perfect (100%), degrades as attempts increase
  const levelsAttempted = Math.max(1, scores.length);
  const attemptsPerLevel = totalAttempts / levelsAttempted;
  const attemptScore = Math.max(0, Math.min(100, (1 / attemptsPerLevel) * 100));
  const attemptsComponent = (attemptScore / 100) * 5;

  return marksComponent + timingComponent + attemptsComponent;
}

export function predictEngagement(input: EngagementInput): EngagementLevel {
  const score = calculateEngagementScore(input);

  if (score >= 70) return 'Highly Engaged';
  if (score >= 40) return 'Moderately Engaged';
  return 'Low Engaged';
}

export function getEngagementColor(level: EngagementLevel): string {
  switch (level) {
    case 'Highly Engaged': return 'text-success';
    case 'Moderately Engaged': return 'text-warning';
    case 'Low Engaged': return 'text-destructive';
  }
}

export function getEngagementBadgeClass(level: EngagementLevel): string {
  switch (level) {
    case 'Highly Engaged': return 'bg-success/10 text-success border-success/20';
    case 'Moderately Engaged': return 'bg-warning/10 text-warning border-warning/20';
    case 'Low Engaged': return 'bg-destructive/10 text-destructive border-destructive/20';
  }
}
