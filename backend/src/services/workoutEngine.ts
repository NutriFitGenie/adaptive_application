// Constants
export const ACTIONS = [
    "increase_weight",
    "decrease_weight",
    "increase_reps",
    "decrease_reps",
    "keep_same"
  ] as const;
  
  export type ActionType = typeof ACTIONS[number];
  
  // Contextual Bandit Class
  export class Bandit {
    epsilon: number;
    models: Record<ActionType, { weights: number[]; bias: number }>;
    featureSize: number;
    learningRate: number;
  
    constructor(epsilon = 0.2, featureSize = 5) {
      this.epsilon = epsilon;
      this.featureSize = featureSize;
      this.learningRate = 0.01;
  
      this.models = {} as Record<ActionType, { weights: number[]; bias: number }>;
      ACTIONS.forEach(action => {
        this.models[action] = {
          weights: Array(featureSize).fill(0),
          bias: 0
        };
      });
    }
  
    selectAction(context: number[]): ActionType {
      if (Math.random() < this.epsilon) {
        return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
      }
  
      let maxReward = -Infinity;
      let selectedAction: ActionType = ACTIONS[0];
  
      for (const action of ACTIONS) {
        const model = this.models[action];
        const rewardEstimate = context.reduce((sum, x, i) => sum + x * model.weights[i], 0) + model.bias;
  
        if (rewardEstimate > maxReward) {
          maxReward = rewardEstimate;
          selectedAction = action;
        }
      }
  
      return selectedAction;
    }
  
    updateModel(action: ActionType, context: number[], reward: number): void {
      const model = this.models[action];
      const predicted = context.reduce((sum, x, i) => sum + x * model.weights[i], 0) + model.bias;
      const error = reward - predicted;
  
      model.weights = model.weights.map((w, i) => w + this.learningRate * error * context[i]);
      model.bias += this.learningRate * error;
    }
  }
  
  export interface UserContext {
    age: number;
    goal: "muscle_gain" | "fat_loss" | "endurance" | string;
  }
  
  export interface BasePlan {
    weight: number;
    reps: number;
  }
  
  export interface PerformanceMetrics {
    repRatio: number;
    weightRatio: number;
    setRatio: number;
  }
  
  export function generateWeek2Plan(
    basePlan: BasePlan,
    userContext: UserContext,
    performance: PerformanceMetrics,
    bandit: Bandit
  ): { plan: BasePlan; action: ActionType } {
    const context = [
      userContext.age / 100,
      userContext.goal === "muscle_gain" ? 1 : 0,
      performance.repRatio,
      performance.weightRatio,
      performance.setRatio
    ];
  
    const action = bandit.selectAction(context);
    const newPlan = applyAction(basePlan, action);
  
    return { plan: newPlan, action };
  }
  
  export function applyAction(plan: BasePlan, action: ActionType): BasePlan {
    const updated = { ...plan };
  
    switch (action) {
      case "increase_weight":
        updated.weight += 2.5;
        break;
      case "decrease_weight":
        updated.weight = Math.max(0, updated.weight - 2.5);
        break;
      case "increase_reps":
        updated.reps = Math.max(12, updated.reps + 1);
        break;
      case "decrease_reps":
        updated.reps = Math.max(6, updated.reps - 1); // Avoid going too low
        break;
      case "keep_same":
      default:
        break;
    }
  
    return updated;
  }
  
  export function calculateReward(
    actual: { totalVolume: number },
    planned: { totalVolume: number }
  ): number {
    const completion = actual.totalVolume / planned.totalVolume;
  
    if (completion >= 1.0) return 1;    // Perfect
    if (completion >= 0.8) return 0.5;  // Acceptable
    return 0.1;                         // Poor
  }
  