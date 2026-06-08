import { BlobLogCallMutation } from "./LogCallMutation";
import { BlobSetRepGoalMutation } from "./SetRepGoalMutation";
import { BlobUpdateBusinessStageMutation } from "./UpdateBusinessStageMutation";
import { BlobUpdateBusinessNextStepMutation } from "./UpdateBusinessNextStepMutation";

export const Mutations = {
  logCall: new BlobLogCallMutation(),
  updateBusinessStage: new BlobUpdateBusinessStageMutation(),
  updateBusinessNextStep: new BlobUpdateBusinessNextStepMutation(),
  script: {
    setRepGoal: new BlobSetRepGoalMutation(),
  },
};