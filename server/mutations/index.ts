import { BlobLogCallMutation } from "./LogCallMutation";
import { BlobSetRepGoalMutation } from "./SetRepGoalMutation";

export const Mutations = {
  logCall: new BlobLogCallMutation(),
  script: {
    setRepGoal: new BlobSetRepGoalMutation(),
  },
};