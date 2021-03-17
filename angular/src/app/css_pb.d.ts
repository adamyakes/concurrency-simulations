import * as jspb from "google-protobuf"

export class DPState extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getState(): DPState.State;
  setState(value: DPState.State): void;

  getForkId(): number;
  setForkId(value: number): void;

  getTime(): number;
  setTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DPState.AsObject;
  static toObject(includeInstance: boolean, msg: DPState): DPState.AsObject;
  static serializeBinaryToWriter(message: DPState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DPState;
  static deserializeBinaryFromReader(message: DPState, reader: jspb.BinaryReader): DPState;
}

export namespace DPState {
  export type AsObject = {
    id: number,
    state: DPState.State,
    forkId: number,
    time: number,
  }

  export enum State { 
    UNDEFINED = 0,
    REQUESTING_FORK = 1,
    HOLDING_FORK = 2,
    RELEASING_FORK = 3,
    HUNGRY = 4,
    EATING = 5,
    THINKING = 6,
    GRACEFULLY_EXITED = 7,
    DEADLOCKED = 8,
  }
}

export class DPOptions extends jspb.Message {
  getChoice(): number;
  setChoice(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getSize(): number;
  setSize(value: number): void;

  getTimeThinking(): number;
  setTimeThinking(value: number): void;

  getTimeEating(): number;
  setTimeEating(value: number): void;

  getVariation(): number;
  setVariation(value: number): void;

  getSaveCode(): SaveCode | undefined;
  setSaveCode(value?: SaveCode): void;
  hasSaveCode(): boolean;
  clearSaveCode(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DPOptions.AsObject;
  static toObject(includeInstance: boolean, msg: DPOptions): DPOptions.AsObject;
  static serializeBinaryToWriter(message: DPOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DPOptions;
  static deserializeBinaryFromReader(message: DPOptions, reader: jspb.BinaryReader): DPOptions;
}

export namespace DPOptions {
  export type AsObject = {
    choice: number,
    duration: number,
    size: number,
    timeThinking: number,
    timeEating: number,
    variation: number,
    saveCode?: SaveCode.AsObject,
  }
}

export class DPRun extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): void;

  getOptions(): DPOptions | undefined;
  setOptions(value?: DPOptions): void;
  hasOptions(): boolean;
  clearOptions(): void;

  getDeadlocked(): boolean;
  setDeadlocked(value: boolean): void;

  getStatsList(): Array<DPStat>;
  setStatsList(value: Array<DPStat>): void;
  clearStatsList(): void;
  addStats(value?: DPStat, index?: number): DPStat;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DPRun.AsObject;
  static toObject(includeInstance: boolean, msg: DPRun): DPRun.AsObject;
  static serializeBinaryToWriter(message: DPRun, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DPRun;
  static deserializeBinaryFromReader(message: DPRun, reader: jspb.BinaryReader): DPRun;
}

export namespace DPRun {
  export type AsObject = {
    timestamp: number,
    options?: DPOptions.AsObject,
    deadlocked: boolean,
    statsList: Array<DPStat.AsObject>,
  }
}

export class DPStat extends jspb.Message {
  getPhilosopherNumber(): number;
  setPhilosopherNumber(value: number): void;

  getMaxHungry(): number;
  setMaxHungry(value: number): void;

  getMaxEating(): number;
  setMaxEating(value: number): void;

  getMaxThinking(): number;
  setMaxThinking(value: number): void;

  getMinHungry(): number;
  setMinHungry(value: number): void;

  getMinEating(): number;
  setMinEating(value: number): void;

  getMinThinking(): number;
  setMinThinking(value: number): void;

  getTotalHungry(): number;
  setTotalHungry(value: number): void;

  getTotalEating(): number;
  setTotalEating(value: number): void;

  getTotalThinking(): number;
  setTotalThinking(value: number): void;

  getCycles(): number;
  setCycles(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DPStat.AsObject;
  static toObject(includeInstance: boolean, msg: DPStat): DPStat.AsObject;
  static serializeBinaryToWriter(message: DPStat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DPStat;
  static deserializeBinaryFromReader(message: DPStat, reader: jspb.BinaryReader): DPStat;
}

export namespace DPStat {
  export type AsObject = {
    philosopherNumber: number,
    maxHungry: number,
    maxEating: number,
    maxThinking: number,
    minHungry: number,
    minEating: number,
    minThinking: number,
    totalHungry: number,
    totalEating: number,
    totalThinking: number,
    cycles: number,
  }
}

export class RWOptions extends jspb.Message {
  getNumReaders(): number;
  setNumReaders(value: number): void;

  getNumWriters(): number;
  setNumWriters(value: number): void;

  getSolution(): RWOptions.Solution;
  setSolution(value: RWOptions.Solution): void;

  getDuration(): number;
  setDuration(value: number): void;

  getReadDuration(): number;
  setReadDuration(value: number): void;

  getWriteDuration(): number;
  setWriteDuration(value: number): void;

  getVariation(): number;
  setVariation(value: number): void;

  getReadSleep(): number;
  setReadSleep(value: number): void;

  getWriteSleep(): number;
  setWriteSleep(value: number): void;

  getSaveCode(): SaveCode | undefined;
  setSaveCode(value?: SaveCode): void;
  hasSaveCode(): boolean;
  clearSaveCode(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RWOptions.AsObject;
  static toObject(includeInstance: boolean, msg: RWOptions): RWOptions.AsObject;
  static serializeBinaryToWriter(message: RWOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RWOptions;
  static deserializeBinaryFromReader(message: RWOptions, reader: jspb.BinaryReader): RWOptions;
}

export namespace RWOptions {
  export type AsObject = {
    numReaders: number,
    numWriters: number,
    solution: RWOptions.Solution,
    duration: number,
    readDuration: number,
    writeDuration: number,
    variation: number,
    readSleep: number,
    writeSleep: number,
    saveCode?: SaveCode.AsObject,
  }

  export enum Solution { 
    UNSPECIFIED = 0,
    FIRST_STARVATION = 1,
    NO_STARVE_TURNSTILE = 2,
    WRITER_PRIORITY = 3,
  }
}

export class RWState extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTime(): number;
  setTime(value: number): void;

  getState(): RWState.State;
  setState(value: RWState.State): void;

  getActor(): string;
  setActor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RWState.AsObject;
  static toObject(includeInstance: boolean, msg: RWState): RWState.AsObject;
  static serializeBinaryToWriter(message: RWState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RWState;
  static deserializeBinaryFromReader(message: RWState, reader: jspb.BinaryReader): RWState;
}

export namespace RWState {
  export type AsObject = {
    id: number,
    time: number,
    state: RWState.State,
    actor: string,
  }

  export enum State { 
    UNDEFINED = 0,
    READING = 1,
    WRITING = 2,
    WAITING_FOR_MUTEX = 3,
    ACQUIRED_MUTEX = 4,
    RELEASED_MUTEX = 5,
    WAITING_FOR_ROOM_EMPTY = 6,
    RECEIVED_ROOM_EMPTY = 7,
    SIGNAL_ROOM_EMPTY = 8,
    WAITING_FOR_TURNSTILE = 9,
    THROUGH_TURNSTILE = 10,
    ENTER_READ_SWITCH = 11,
    LEAVE_READ_SWITCH = 12,
    ENTER_WRITE_SWITCH = 13,
    LEAVE_WRITE_SWITCH = 14,
    WAITING_FOR_NO_READERS = 15,
    WAITING_FOR_NO_WRITERS = 16,
    SIGNAL_NO_READERS = 17,
    SIGNAL_NO_WRITERS = 18,
    RECEIVED_NO_READERS = 19,
    RECEIVED_NO_WRITERS = 20,
    END_ACTION = 21,
    WAIT_ACTION = 22,
  }
}

export class RWStats extends jspb.Message {
  getRwRunsList(): Array<RWRun>;
  setRwRunsList(value: Array<RWRun>): void;
  clearRwRunsList(): void;
  addRwRuns(value?: RWRun, index?: number): RWRun;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RWStats.AsObject;
  static toObject(includeInstance: boolean, msg: RWStats): RWStats.AsObject;
  static serializeBinaryToWriter(message: RWStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RWStats;
  static deserializeBinaryFromReader(message: RWStats, reader: jspb.BinaryReader): RWStats;
}

export namespace RWStats {
  export type AsObject = {
    rwRunsList: Array<RWRun.AsObject>,
  }
}

export class RWRun extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): void;

  getOptions(): RWOptions | undefined;
  setOptions(value?: RWOptions): void;
  hasOptions(): boolean;
  clearOptions(): void;

  getStatsList(): Array<RWRunStat>;
  setStatsList(value: Array<RWRunStat>): void;
  clearStatsList(): void;
  addStats(value?: RWRunStat, index?: number): RWRunStat;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RWRun.AsObject;
  static toObject(includeInstance: boolean, msg: RWRun): RWRun.AsObject;
  static serializeBinaryToWriter(message: RWRun, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RWRun;
  static deserializeBinaryFromReader(message: RWRun, reader: jspb.BinaryReader): RWRun;
}

export namespace RWRun {
  export type AsObject = {
    timestamp: number,
    options?: RWOptions.AsObject,
    statsList: Array<RWRunStat.AsObject>,
  }
}

export class DPStats extends jspb.Message {
  getDpRunsList(): Array<DPRun>;
  setDpRunsList(value: Array<DPRun>): void;
  clearDpRunsList(): void;
  addDpRuns(value?: DPRun, index?: number): DPRun;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DPStats.AsObject;
  static toObject(includeInstance: boolean, msg: DPStats): DPStats.AsObject;
  static serializeBinaryToWriter(message: DPStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DPStats;
  static deserializeBinaryFromReader(message: DPStats, reader: jspb.BinaryReader): DPStats;
}

export namespace DPStats {
  export type AsObject = {
    dpRunsList: Array<DPRun.AsObject>,
  }
}

export class BufferStats extends jspb.Message {
  getBufferRunsList(): Array<BufferRun>;
  setBufferRunsList(value: Array<BufferRun>): void;
  clearBufferRunsList(): void;
  addBufferRuns(value?: BufferRun, index?: number): BufferRun;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BufferStats.AsObject;
  static toObject(includeInstance: boolean, msg: BufferStats): BufferStats.AsObject;
  static serializeBinaryToWriter(message: BufferStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BufferStats;
  static deserializeBinaryFromReader(message: BufferStats, reader: jspb.BinaryReader): BufferStats;
}

export namespace BufferStats {
  export type AsObject = {
    bufferRunsList: Array<BufferRun.AsObject>,
  }
}

export class BufferRun extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): void;

  getOptions(): BufferOptions | undefined;
  setOptions(value?: BufferOptions): void;
  hasOptions(): boolean;
  clearOptions(): void;

  getStatsList(): Array<BufferRunStat>;
  setStatsList(value: Array<BufferRunStat>): void;
  clearStatsList(): void;
  addStats(value?: BufferRunStat, index?: number): BufferRunStat;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BufferRun.AsObject;
  static toObject(includeInstance: boolean, msg: BufferRun): BufferRun.AsObject;
  static serializeBinaryToWriter(message: BufferRun, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BufferRun;
  static deserializeBinaryFromReader(message: BufferRun, reader: jspb.BinaryReader): BufferRun;
}

export namespace BufferRun {
  export type AsObject = {
    timestamp: number,
    options?: BufferOptions.AsObject,
    statsList: Array<BufferRunStat.AsObject>,
  }
}

export class BufferRunStat extends jspb.Message {
  getBufferStatNum(): number;
  setBufferStatNum(value: number): void;

  getActionTimeMin(): number;
  setActionTimeMin(value: number): void;

  getActionTimeMax(): number;
  setActionTimeMax(value: number): void;

  getActionTimeTotal(): number;
  setActionTimeTotal(value: number): void;

  getWaitTimeMin(): number;
  setWaitTimeMin(value: number): void;

  getWaitTimeMax(): number;
  setWaitTimeMax(value: number): void;

  getWaitTimeTotal(): number;
  setWaitTimeTotal(value: number): void;

  getActions(): number;
  setActions(value: number): void;

  getActorType(): string;
  setActorType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BufferRunStat.AsObject;
  static toObject(includeInstance: boolean, msg: BufferRunStat): BufferRunStat.AsObject;
  static serializeBinaryToWriter(message: BufferRunStat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BufferRunStat;
  static deserializeBinaryFromReader(message: BufferRunStat, reader: jspb.BinaryReader): BufferRunStat;
}

export namespace BufferRunStat {
  export type AsObject = {
    bufferStatNum: number,
    actionTimeMin: number,
    actionTimeMax: number,
    actionTimeTotal: number,
    waitTimeMin: number,
    waitTimeMax: number,
    waitTimeTotal: number,
    actions: number,
    actorType: string,
  }
}

export class RWRunStat extends jspb.Message {
  getReadWriteNumber(): number;
  setReadWriteNumber(value: number): void;

  getActionTimeMin(): number;
  setActionTimeMin(value: number): void;

  getActionTimeMax(): number;
  setActionTimeMax(value: number): void;

  getActionTimeTotal(): number;
  setActionTimeTotal(value: number): void;

  getWaitTimeMin(): number;
  setWaitTimeMin(value: number): void;

  getWaitTimeMax(): number;
  setWaitTimeMax(value: number): void;

  getWaitTimeTotal(): number;
  setWaitTimeTotal(value: number): void;

  getActions(): number;
  setActions(value: number): void;

  getActorType(): string;
  setActorType(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RWRunStat.AsObject;
  static toObject(includeInstance: boolean, msg: RWRunStat): RWRunStat.AsObject;
  static serializeBinaryToWriter(message: RWRunStat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RWRunStat;
  static deserializeBinaryFromReader(message: RWRunStat, reader: jspb.BinaryReader): RWRunStat;
}

export namespace RWRunStat {
  export type AsObject = {
    readWriteNumber: number,
    actionTimeMin: number,
    actionTimeMax: number,
    actionTimeTotal: number,
    waitTimeMin: number,
    waitTimeMax: number,
    waitTimeTotal: number,
    actions: number,
    actorType: string,
  }
}

export class BufferOptions extends jspb.Message {
  getBufferSize(): number;
  setBufferSize(value: number): void;

  getNumProducers(): number;
  setNumProducers(value: number): void;

  getNumConsumers(): number;
  setNumConsumers(value: number): void;

  getProduceTime(): number;
  setProduceTime(value: number): void;

  getConsumeTime(): number;
  setConsumeTime(value: number): void;

  getVariation(): number;
  setVariation(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getSleepTime(): number;
  setSleepTime(value: number): void;

  getSaveCode(): SaveCode | undefined;
  setSaveCode(value?: SaveCode): void;
  hasSaveCode(): boolean;
  clearSaveCode(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BufferOptions.AsObject;
  static toObject(includeInstance: boolean, msg: BufferOptions): BufferOptions.AsObject;
  static serializeBinaryToWriter(message: BufferOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BufferOptions;
  static deserializeBinaryFromReader(message: BufferOptions, reader: jspb.BinaryReader): BufferOptions;
}

export namespace BufferOptions {
  export type AsObject = {
    bufferSize: number,
    numProducers: number,
    numConsumers: number,
    produceTime: number,
    consumeTime: number,
    variation: number,
    duration: number,
    sleepTime: number,
    saveCode?: SaveCode.AsObject,
  }
}

export class BufferState extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getState(): BufferState.State;
  setState(value: BufferState.State): void;

  getTime(): number;
  setTime(value: number): void;

  getActor(): string;
  setActor(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BufferState.AsObject;
  static toObject(includeInstance: boolean, msg: BufferState): BufferState.AsObject;
  static serializeBinaryToWriter(message: BufferState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BufferState;
  static deserializeBinaryFromReader(message: BufferState, reader: jspb.BinaryReader): BufferState;
}

export namespace BufferState {
  export type AsObject = {
    id: number,
    state: BufferState.State,
    time: number,
    actor: string,
  }

  export enum State { 
    UNDEFINED = 0,
    PRODUCED_ITEM = 1,
    CONSUMED_ITEM = 2,
    PRODUCING_ITEM = 3,
    CONSUMING_ITEM = 4,
    WAIT_FOR_BUFFER = 5,
    IDLE = 6,
  }
}

export class ModusOptions extends jspb.Message {
  getDuration(): number;
  setDuration(value: number): void;

  getTotalHeathens(): number;
  setTotalHeathens(value: number): void;

  getTotalPrudes(): number;
  setTotalPrudes(value: number): void;

  getTimeToCrossMin(): number;
  setTimeToCrossMin(value: number): void;

  getTimeToCrossMax(): number;
  setTimeToCrossMax(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModusOptions.AsObject;
  static toObject(includeInstance: boolean, msg: ModusOptions): ModusOptions.AsObject;
  static serializeBinaryToWriter(message: ModusOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModusOptions;
  static deserializeBinaryFromReader(message: ModusOptions, reader: jspb.BinaryReader): ModusOptions;
}

export namespace ModusOptions {
  export type AsObject = {
    duration: number,
    totalHeathens: number,
    totalPrudes: number,
    timeToCrossMin: number,
    timeToCrossMax: number,
  }
}

export class ModusState extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getState(): ModusState.State;
  setState(value: ModusState.State): void;

  getTime(): number;
  setTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ModusState.AsObject;
  static toObject(includeInstance: boolean, msg: ModusState): ModusState.AsObject;
  static serializeBinaryToWriter(message: ModusState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ModusState;
  static deserializeBinaryFromReader(message: ModusState, reader: jspb.BinaryReader): ModusState;
}

export namespace ModusState {
  export type AsObject = {
    id: number,
    state: ModusState.State,
    time: number,
  }

  export enum State { 
    UNDEFINED = 0,
    NEUTRAL = 1,
    HEATHENS_RULE = 2,
    PRUDES_RULE = 3,
    TRANSITION_TO_HEATHENS = 4,
    TRANSITION_TO_PRUDES = 5,
    WAITING_TO_CROSS = 6,
    CROSSING = 7,
  }
}

export class UnisexOptions extends jspb.Message {
  getDuration(): number;
  setDuration(value: number): void;

  getSolution(): UnisexOptions.Solution;
  setSolution(value: UnisexOptions.Solution): void;

  getNumMales(): number;
  setNumMales(value: number): void;

  getNumFemales(): number;
  setNumFemales(value: number): void;

  getMaxAllowed(): number;
  setMaxAllowed(value: number): void;

  getMaleTime(): number;
  setMaleTime(value: number): void;

  getFemaleTime(): number;
  setFemaleTime(value: number): void;

  getRestartTime(): number;
  setRestartTime(value: number): void;

  getVariation(): number;
  setVariation(value: number): void;

  getSaveCode(): SaveCode | undefined;
  setSaveCode(value?: SaveCode): void;
  hasSaveCode(): boolean;
  clearSaveCode(): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnisexOptions.AsObject;
  static toObject(includeInstance: boolean, msg: UnisexOptions): UnisexOptions.AsObject;
  static serializeBinaryToWriter(message: UnisexOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnisexOptions;
  static deserializeBinaryFromReader(message: UnisexOptions, reader: jspb.BinaryReader): UnisexOptions;
}

export namespace UnisexOptions {
  export type AsObject = {
    duration: number,
    solution: UnisexOptions.Solution,
    numMales: number,
    numFemales: number,
    maxAllowed: number,
    maleTime: number,
    femaleTime: number,
    restartTime: number,
    variation: number,
    saveCode?: SaveCode.AsObject,
  }

  export enum Solution { 
    UNDEFINED = 0,
    FIRST = 1,
    NO_STARVE = 2,
  }
}

export class UnisexState extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getState(): UnisexState.State;
  setState(value: UnisexState.State): void;

  getTime(): number;
  setTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnisexState.AsObject;
  static toObject(includeInstance: boolean, msg: UnisexState): UnisexState.AsObject;
  static serializeBinaryToWriter(message: UnisexState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnisexState;
  static deserializeBinaryFromReader(message: UnisexState, reader: jspb.BinaryReader): UnisexState;
}

export namespace UnisexState {
  export type AsObject = {
    id: number,
    state: UnisexState.State,
    time: number,
  }

  export enum State { 
    UNDEFINED = 0,
    QUEUING = 1,
    ENTERING = 2,
    LEAVING = 3,
    SIGNAL_EMPTY = 4,
    MALE_SWITCH_ON = 5,
    MALE_SWITCH_OFF = 6,
    FEMALE_SWITCH_ON = 7,
    FEMALE_SWITCH_OFF = 8,
  }
}

export class UnisexStats extends jspb.Message {
  getUnisexRunsList(): Array<UnisexRun>;
  setUnisexRunsList(value: Array<UnisexRun>): void;
  clearUnisexRunsList(): void;
  addUnisexRuns(value?: UnisexRun, index?: number): UnisexRun;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnisexStats.AsObject;
  static toObject(includeInstance: boolean, msg: UnisexStats): UnisexStats.AsObject;
  static serializeBinaryToWriter(message: UnisexStats, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnisexStats;
  static deserializeBinaryFromReader(message: UnisexStats, reader: jspb.BinaryReader): UnisexStats;
}

export namespace UnisexStats {
  export type AsObject = {
    unisexRunsList: Array<UnisexRun.AsObject>,
  }
}

export class UnisexRun extends jspb.Message {
  getTimestamp(): number;
  setTimestamp(value: number): void;

  getOptions(): UnisexOptions | undefined;
  setOptions(value?: UnisexOptions): void;
  hasOptions(): boolean;
  clearOptions(): void;

  getStatsList(): Array<UnisexRunStat>;
  setStatsList(value: Array<UnisexRunStat>): void;
  clearStatsList(): void;
  addStats(value?: UnisexRunStat, index?: number): UnisexRunStat;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnisexRun.AsObject;
  static toObject(includeInstance: boolean, msg: UnisexRun): UnisexRun.AsObject;
  static serializeBinaryToWriter(message: UnisexRun, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnisexRun;
  static deserializeBinaryFromReader(message: UnisexRun, reader: jspb.BinaryReader): UnisexRun;
}

export namespace UnisexRun {
  export type AsObject = {
    timestamp: number,
    options?: UnisexOptions.AsObject,
    statsList: Array<UnisexRunStat.AsObject>,
  }
}

export class UnisexRunStat extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getTimeUsingMin(): number;
  setTimeUsingMin(value: number): void;

  getTimeUsingMax(): number;
  setTimeUsingMax(value: number): void;

  getTimeUsingTotal(): number;
  setTimeUsingTotal(value: number): void;

  getTimesUsed(): number;
  setTimesUsed(value: number): void;

  getWaitTimeMin(): number;
  setWaitTimeMin(value: number): void;

  getWaitTimeMax(): number;
  setWaitTimeMax(value: number): void;

  getWaitTimeTotal(): number;
  setWaitTimeTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnisexRunStat.AsObject;
  static toObject(includeInstance: boolean, msg: UnisexRunStat): UnisexRunStat.AsObject;
  static serializeBinaryToWriter(message: UnisexRunStat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnisexRunStat;
  static deserializeBinaryFromReader(message: UnisexRunStat, reader: jspb.BinaryReader): UnisexRunStat;
}

export namespace UnisexRunStat {
  export type AsObject = {
    id: number,
    timeUsingMin: number,
    timeUsingMax: number,
    timeUsingTotal: number,
    timesUsed: number,
    waitTimeMin: number,
    waitTimeMax: number,
    waitTimeTotal: number,
  }
}

export class Empty extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Empty.AsObject;
  static toObject(includeInstance: boolean, msg: Empty): Empty.AsObject;
  static serializeBinaryToWriter(message: Empty, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Empty;
  static deserializeBinaryFromReader(message: Empty, reader: jspb.BinaryReader): Empty;
}

export namespace Empty {
  export type AsObject = {
  }
}

export class SaveCode extends jspb.Message {
  getSaveCode(): string;
  setSaveCode(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveCode.AsObject;
  static toObject(includeInstance: boolean, msg: SaveCode): SaveCode.AsObject;
  static serializeBinaryToWriter(message: SaveCode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveCode;
  static deserializeBinaryFromReader(message: SaveCode, reader: jspb.BinaryReader): SaveCode;
}

export namespace SaveCode {
  export type AsObject = {
    saveCode: string,
  }
}

export class SaveCodeValidationResponse extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SaveCodeValidationResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SaveCodeValidationResponse): SaveCodeValidationResponse.AsObject;
  static serializeBinaryToWriter(message: SaveCodeValidationResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SaveCodeValidationResponse;
  static deserializeBinaryFromReader(message: SaveCodeValidationResponse, reader: jspb.BinaryReader): SaveCodeValidationResponse;
}

export namespace SaveCodeValidationResponse {
  export type AsObject = {
    valid: boolean,
  }
}

