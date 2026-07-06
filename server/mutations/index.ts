import { BlobLogCallMutation } from "./LogCallMutation";
import { BlobSetRepGoalMutation } from "./SetRepGoalMutation";
import { BlobUpdateBusinessStageMutation } from "./UpdateBusinessStageMutation";
import { BlobUpdateBusinessNextStepMutation } from "./UpdateBusinessNextStepMutation";
import { BlobLoginMutation } from "./LoginMutation";

export const Mutations = {
  logCall: new BlobLogCallMutation(),
  updateBusinessStage: new BlobUpdateBusinessStageMutation(),
  updateBusinessNextStep: new BlobUpdateBusinessNextStepMutation(),
  login: new BlobLoginMutation(),
  setRepGoal: new BlobSetRepGoalMutation(),
};