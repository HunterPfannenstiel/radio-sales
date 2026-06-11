export type CurrentStage =
  | "approach"
  | "uncover"
  | "present"
  | "close"
  | "service"

export const STAGE_LABELS: Record<CurrentStage, string> = {
  approach: "Approach",
  uncover: "Uncover",
  present: "Present",
  close: "Close",
  service: "Service",
}

export const STAGE_ORDERED: CurrentStage[] = [
  "approach",
  "uncover",
  "present",
  "close",
  "service",
]

export const STAGE_POSITION: Record<CurrentStage, number> = {
  approach: 1,
  uncover: 2,
  present: 3,
  close: 4,
  service: 5,
}

export const NEXT_STEPS = [
  { value: "followup_call", label: "Follow-up call" },
  { value: "send_spec_spot", label: "Send spec spot" },
  { value: "send_proposal", label: "Send proposal" },
  { value: "set_appointment", label: "Set appointment" },
  { value: "send_contract", label: "Send contract" },
  { value: "check_in", label: "Check in" },
]
