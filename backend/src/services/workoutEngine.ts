export const ACTIONS = [
  "increase_weight",
  "decrease_weight",
  "increase_reps",
  "decrease_reps",
  "keep_same"
] as const;

export type ActionType = typeof ACTIONS[number];

export interface UserContext {
  age: number;
  goal: "muscle_gain" | "fat_loss" | string;
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
        weights: Array(this.featureSize).fill(0),
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

  selectActionFromSubset(context: number[], allowedActions: ActionType[]): ActionType {
    if (Math.random() < this.epsilon) {
      return allowedActions[Math.floor(Math.random() * allowedActions.length)];
    }

    let maxReward = -Infinity;
    let selectedAction: ActionType = allowedActions[0];

    for (const action of allowedActions) {
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

  async load(userId: string) {
    const BanditModel = (await import('../models/bandit_model')).default;
    const record = await BanditModel.findOne({ userId });

    if (record && record.models) {
      this.models = record.models as any;

      ACTIONS.forEach(action => {
        if (!this.models[action]) {
          this.models[action] = {
            weights: Array(this.featureSize).fill(0),
            bias: 0
          };
        }
      });
    } else {
      ACTIONS.forEach(action => {
        this.models[action] = {
          weights: Array(this.featureSize).fill(0),
          bias: 0
        };
      });
    }
  }

  async save(userId: string) {
    const BanditModel = (await import('../models/bandit_model')).default;
    await BanditModel.findOneAndUpdate(
      { userId },
      { models: this.models },
      { upsert: true, new: true }
    );
  }
}

export function calculateReward(
  actual: { totalVolume: number },
  planned: { totalVolume: number }
): number {
  const completion = actual.totalVolume / planned.totalVolume;

  if (completion >= 1.2) return 1.0;
  if (completion >= 1.0) return 0.9;
  if (completion >= 0.9) return 0.7;
  if (completion >= 0.8) return 0.5;
  return 0.1;
}


export function applyAction(plan: BasePlan, action: ActionType): BasePlan {
  const updated = { ...plan };

  switch (action) {
    case "increase_weight":
      updated.weight = Math.round((updated.weight + 2.5) * 10) / 10;
      updated.reps = 8; // Reset reps when weight increases
      break;

    case "decrease_weight":
      updated.weight = Math.max(0, Math.round((updated.weight - 2.5) * 10) / 10);
      updated.reps = 8;
      break;

    case "increase_reps":
      updated.reps = Math.min(12, updated.reps + 1);
      break;

    case "decrease_reps":
      updated.reps = Math.max(8, updated.reps - 1);
      break;

    case "keep_same":
    default:
      break;
  }

  return updated;
}


export function generateWeek2Plan(
  basePlan: BasePlan,
  userContext: UserContext,
  performance: PerformanceMetrics,
  bandit: Bandit
): { plan: BasePlan; action: ActionType } {
  const { reps, weight } = basePlan;
  const context = [
    userContext.age / 100,
    userContext.goal === "muscle_gain" ? 1 : 0,
    performance.repRatio,
    performance.weightRatio,
    performance.setRatio
  ];

  const allowedActions: ActionType[] = [];
  const avgReps = reps;

  const overperforming = performance.repRatio >= 1.0;
  const wellOverperforming = performance.repRatio > 1.2;
  const underperforming = performance.repRatio < 0.95;
  const poorlyPerforming = performance.repRatio < 0.7;

  if (wellOverperforming) {
    allowedActions.push("increase_weight", "increase_reps");
  } else if (overperforming && avgReps < 12) {
    allowedActions.push("increase_reps");
  } else if (overperforming && avgReps >= 12) {
    allowedActions.push("increase_weight");
  }

  if (poorlyPerforming) {
    allowedActions.push("decrease_weight", "decrease_reps");
  } else if (underperforming && avgReps > 8) {
    allowedActions.push("decrease_reps");
  } else if (underperforming && avgReps <= 8) {
    allowedActions.push("decrease_weight");
  }

  if (allowedActions.length === 0) {
    allowedActions.push("keep_same");
  }

  const selectedAction = bandit.selectActionFromSubset(context, allowedActions);
  const newPlan = applyAction(basePlan, selectedAction);

  return { plan: newPlan, action: selectedAction };
}

