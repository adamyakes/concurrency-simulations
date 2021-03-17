import * as grpcWeb from 'grpc-web';

import {
  BufferOptions,
  BufferState,
  BufferStats,
  DPOptions,
  DPState,
  DPStats,
  Empty,
  RWOptions,
  RWState,
  RWStats,
  SaveCode,
  SaveCodeValidationResponse,
  UnisexOptions,
  UnisexState,
  UnisexStats} from './css_pb';

export class CSSClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  philosophize(
    request: DPOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<DPState>;

  getDPStats(
    request: SaveCode,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: DPStats) => void
  ): grpcWeb.ClientReadableStream<DPStats>;

  readWrite(
    request: RWOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<RWState>;

  getRWStats(
    request: SaveCode,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: RWStats) => void
  ): grpcWeb.ClientReadableStream<RWStats>;

  boundedBuffer(
    request: BufferOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<BufferState>;

  getBufferStats(
    request: SaveCode,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: BufferStats) => void
  ): grpcWeb.ClientReadableStream<BufferStats>;

  unisex(
    request: UnisexOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<UnisexState>;

  getUnisexStats(
    request: SaveCode,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: UnisexStats) => void
  ): grpcWeb.ClientReadableStream<UnisexStats>;

  newSaveCode(
    request: Empty,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: SaveCode) => void
  ): grpcWeb.ClientReadableStream<SaveCode>;

  validateSaveCode(
    request: SaveCode,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.Error,
               response: SaveCodeValidationResponse) => void
  ): grpcWeb.ClientReadableStream<SaveCodeValidationResponse>;

}

export class CSSPromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: string; });

  philosophize(
    request: DPOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<DPState>;

  getDPStats(
    request: SaveCode,
    metadata?: grpcWeb.Metadata
  ): Promise<DPStats>;

  readWrite(
    request: RWOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<RWState>;

  getRWStats(
    request: SaveCode,
    metadata?: grpcWeb.Metadata
  ): Promise<RWStats>;

  boundedBuffer(
    request: BufferOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<BufferState>;

  getBufferStats(
    request: SaveCode,
    metadata?: grpcWeb.Metadata
  ): Promise<BufferStats>;

  unisex(
    request: UnisexOptions,
    metadata?: grpcWeb.Metadata
  ): grpcWeb.ClientReadableStream<UnisexState>;

  getUnisexStats(
    request: SaveCode,
    metadata?: grpcWeb.Metadata
  ): Promise<UnisexStats>;

  newSaveCode(
    request: Empty,
    metadata?: grpcWeb.Metadata
  ): Promise<SaveCode>;

  validateSaveCode(
    request: SaveCode,
    metadata?: grpcWeb.Metadata
  ): Promise<SaveCodeValidationResponse>;

}

