import { Task } from '../Grimoire';

export const calculateXP = (task: Task): number => {
  let xp = 5; // Base XP
  if (task.difficulty) xp += 2;
  if (task.length) xp += 1;
  if (task.urgency) xp += 1;
  if (task.importance) xp += 1;
  return xp;
};

export const calculateCombatXP = (tasks: Task[]): { userXP: number, goblinXP: number } => {
  const totalTaskXP = tasks.reduce((total, task) => total + task.xp, 0);
  const goblinXP = Math.max(0, totalTaskXP - 5);
  const userXP = tasks
    .filter(task => task.completed_at)
    .reduce((total, task) => total + task.xp, 0);
  
  return { userXP, goblinXP };
};
