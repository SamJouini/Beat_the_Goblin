import { Task } from '../Grimoire';

/**
 * Calculates the XP value for a single task based on its attributes.
 *
 */
export const calculateXP = (task: Task): number => {
  let xp = 5; // Base XP for all tasks
  if (task.difficulty) xp += 2; // +2 XP for difficult tasks
  if (task.length) xp += 1; // +1 XP for long tasks
  if (task.urgency) xp += 1; // +1 XP for urgent tasks
  if (task.importance) xp += 1; // +1 XP for important tasks
  return xp;
};


/**
 * Calculates the combat XP for both the user and the goblin based on a list of tasks.
 *
 */
export const calculateCombatXP = (tasks: Task[]): { userXP: number, goblinXP: number } => {
  // Calculate total XP of all tasks
  const totalTaskXP = tasks.reduce((total, task) => total + task.xp, 0);
  
  // Calculate goblin XP (total task XP minus 5, minimum 0)
  const goblinXP = Math.max(0, totalTaskXP - 5);

  // Calculate user XP (sum of XP from completed tasks)
  const userXP = tasks
    .filter(task => task.completed_at)
    .reduce((total, task) => total + task.xp, 0);
  
  return { userXP, goblinXP };
};
