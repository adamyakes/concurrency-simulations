import { RWState, DPStat, DPState, ModusState, BufferState, UnisexState } from "./css_pb";

export type ProblemUpdate = 'done' | 'error' | 'cancelled' | 'reset' | 'running' | RWState | DPState | ModusState | BufferState | UnisexState

export type ProblemState = RWState.AsObject | DPState.AsObject | ModusState.AsObject | BufferState.AsObject | UnisexState.AsObject