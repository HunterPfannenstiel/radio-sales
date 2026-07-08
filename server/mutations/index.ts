import { BlobLogCallMutation } from "./LogCallMutation";
import { BlobSetRepGoalMutation } from "./SetRepGoalMutation";
import { BlobUpdateBusinessStageMutation } from "./UpdateBusinessStageMutation";
import { BlobUpdateBusinessNextStepMutation } from "./UpdateBusinessNextStepMutation";
import { BlobLoginMutation } from "./LoginMutation";
import { BlobSignupMutation } from "./SignupMutation";

export const Mutations = {
  logCall: new BlobLogCallMutation(),
  updateBusinessStage: new BlobUpdateBusinessStageMutation(),
  updateBusinessNextStep: new BlobUpdateBusinessNextStepMutation(),
  login: new BlobLoginMutation(),
  signup: new BlobSignupMutation(),
  setRepGoal: new BlobSetRepGoalMutation(),
};