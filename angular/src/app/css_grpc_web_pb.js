/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./css_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.CSSClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.CSSPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.DPOptions,
 *   !proto.DPState>}
 */
const methodDescriptor_CSS_Philosophize = new grpc.web.MethodDescriptor(
  '/CSS/Philosophize',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.DPOptions,
  proto.DPState,
  /**
   * @param {!proto.DPOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.DPState.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.DPOptions,
 *   !proto.DPState>}
 */
const methodInfo_CSS_Philosophize = new grpc.web.AbstractClientBase.MethodInfo(
  proto.DPState,
  /**
   * @param {!proto.DPOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.DPState.deserializeBinary
);


/**
 * @param {!proto.DPOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.DPState>}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.philosophize =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/Philosophize',
      request,
      metadata || {},
      methodDescriptor_CSS_Philosophize);
};


/**
 * @param {!proto.DPOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.DPState>}
 *     The XHR Node Readable Stream
 */
proto.CSSPromiseClient.prototype.philosophize =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/Philosophize',
      request,
      metadata || {},
      methodDescriptor_CSS_Philosophize);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.SaveCode,
 *   !proto.DPStats>}
 */
const methodDescriptor_CSS_GetDPStats = new grpc.web.MethodDescriptor(
  '/CSS/GetDPStats',
  grpc.web.MethodType.UNARY,
  proto.SaveCode,
  proto.DPStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.DPStats.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.SaveCode,
 *   !proto.DPStats>}
 */
const methodInfo_CSS_GetDPStats = new grpc.web.AbstractClientBase.MethodInfo(
  proto.DPStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.DPStats.deserializeBinary
);


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.DPStats)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.DPStats>|undefined}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.getDPStats =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/CSS/GetDPStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetDPStats,
      callback);
};


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.DPStats>}
 *     A native promise that resolves to the response
 */
proto.CSSPromiseClient.prototype.getDPStats =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/CSS/GetDPStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetDPStats);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.RWOptions,
 *   !proto.RWState>}
 */
const methodDescriptor_CSS_ReadWrite = new grpc.web.MethodDescriptor(
  '/CSS/ReadWrite',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.RWOptions,
  proto.RWState,
  /**
   * @param {!proto.RWOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.RWState.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.RWOptions,
 *   !proto.RWState>}
 */
const methodInfo_CSS_ReadWrite = new grpc.web.AbstractClientBase.MethodInfo(
  proto.RWState,
  /**
   * @param {!proto.RWOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.RWState.deserializeBinary
);


/**
 * @param {!proto.RWOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.RWState>}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.readWrite =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/ReadWrite',
      request,
      metadata || {},
      methodDescriptor_CSS_ReadWrite);
};


/**
 * @param {!proto.RWOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.RWState>}
 *     The XHR Node Readable Stream
 */
proto.CSSPromiseClient.prototype.readWrite =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/ReadWrite',
      request,
      metadata || {},
      methodDescriptor_CSS_ReadWrite);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.SaveCode,
 *   !proto.RWStats>}
 */
const methodDescriptor_CSS_GetRWStats = new grpc.web.MethodDescriptor(
  '/CSS/GetRWStats',
  grpc.web.MethodType.UNARY,
  proto.SaveCode,
  proto.RWStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.RWStats.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.SaveCode,
 *   !proto.RWStats>}
 */
const methodInfo_CSS_GetRWStats = new grpc.web.AbstractClientBase.MethodInfo(
  proto.RWStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.RWStats.deserializeBinary
);


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.RWStats)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.RWStats>|undefined}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.getRWStats =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/CSS/GetRWStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetRWStats,
      callback);
};


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.RWStats>}
 *     A native promise that resolves to the response
 */
proto.CSSPromiseClient.prototype.getRWStats =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/CSS/GetRWStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetRWStats);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.BufferOptions,
 *   !proto.BufferState>}
 */
const methodDescriptor_CSS_BoundedBuffer = new grpc.web.MethodDescriptor(
  '/CSS/BoundedBuffer',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.BufferOptions,
  proto.BufferState,
  /**
   * @param {!proto.BufferOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.BufferState.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.BufferOptions,
 *   !proto.BufferState>}
 */
const methodInfo_CSS_BoundedBuffer = new grpc.web.AbstractClientBase.MethodInfo(
  proto.BufferState,
  /**
   * @param {!proto.BufferOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.BufferState.deserializeBinary
);


/**
 * @param {!proto.BufferOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.BufferState>}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.boundedBuffer =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/BoundedBuffer',
      request,
      metadata || {},
      methodDescriptor_CSS_BoundedBuffer);
};


/**
 * @param {!proto.BufferOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.BufferState>}
 *     The XHR Node Readable Stream
 */
proto.CSSPromiseClient.prototype.boundedBuffer =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/BoundedBuffer',
      request,
      metadata || {},
      methodDescriptor_CSS_BoundedBuffer);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.SaveCode,
 *   !proto.BufferStats>}
 */
const methodDescriptor_CSS_GetBufferStats = new grpc.web.MethodDescriptor(
  '/CSS/GetBufferStats',
  grpc.web.MethodType.UNARY,
  proto.SaveCode,
  proto.BufferStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.BufferStats.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.SaveCode,
 *   !proto.BufferStats>}
 */
const methodInfo_CSS_GetBufferStats = new grpc.web.AbstractClientBase.MethodInfo(
  proto.BufferStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.BufferStats.deserializeBinary
);


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.BufferStats)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.BufferStats>|undefined}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.getBufferStats =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/CSS/GetBufferStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetBufferStats,
      callback);
};


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.BufferStats>}
 *     A native promise that resolves to the response
 */
proto.CSSPromiseClient.prototype.getBufferStats =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/CSS/GetBufferStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetBufferStats);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.UnisexOptions,
 *   !proto.UnisexState>}
 */
const methodDescriptor_CSS_Unisex = new grpc.web.MethodDescriptor(
  '/CSS/Unisex',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.UnisexOptions,
  proto.UnisexState,
  /**
   * @param {!proto.UnisexOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UnisexState.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.UnisexOptions,
 *   !proto.UnisexState>}
 */
const methodInfo_CSS_Unisex = new grpc.web.AbstractClientBase.MethodInfo(
  proto.UnisexState,
  /**
   * @param {!proto.UnisexOptions} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UnisexState.deserializeBinary
);


/**
 * @param {!proto.UnisexOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.UnisexState>}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.unisex =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/Unisex',
      request,
      metadata || {},
      methodDescriptor_CSS_Unisex);
};


/**
 * @param {!proto.UnisexOptions} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.UnisexState>}
 *     The XHR Node Readable Stream
 */
proto.CSSPromiseClient.prototype.unisex =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/CSS/Unisex',
      request,
      metadata || {},
      methodDescriptor_CSS_Unisex);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.SaveCode,
 *   !proto.UnisexStats>}
 */
const methodDescriptor_CSS_GetUnisexStats = new grpc.web.MethodDescriptor(
  '/CSS/GetUnisexStats',
  grpc.web.MethodType.UNARY,
  proto.SaveCode,
  proto.UnisexStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UnisexStats.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.SaveCode,
 *   !proto.UnisexStats>}
 */
const methodInfo_CSS_GetUnisexStats = new grpc.web.AbstractClientBase.MethodInfo(
  proto.UnisexStats,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UnisexStats.deserializeBinary
);


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.UnisexStats)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.UnisexStats>|undefined}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.getUnisexStats =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/CSS/GetUnisexStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetUnisexStats,
      callback);
};


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.UnisexStats>}
 *     A native promise that resolves to the response
 */
proto.CSSPromiseClient.prototype.getUnisexStats =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/CSS/GetUnisexStats',
      request,
      metadata || {},
      methodDescriptor_CSS_GetUnisexStats);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.Empty,
 *   !proto.SaveCode>}
 */
const methodDescriptor_CSS_NewSaveCode = new grpc.web.MethodDescriptor(
  '/CSS/NewSaveCode',
  grpc.web.MethodType.UNARY,
  proto.Empty,
  proto.SaveCode,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.SaveCode.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.Empty,
 *   !proto.SaveCode>}
 */
const methodInfo_CSS_NewSaveCode = new grpc.web.AbstractClientBase.MethodInfo(
  proto.SaveCode,
  /**
   * @param {!proto.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.SaveCode.deserializeBinary
);


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.SaveCode)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.SaveCode>|undefined}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.newSaveCode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/CSS/NewSaveCode',
      request,
      metadata || {},
      methodDescriptor_CSS_NewSaveCode,
      callback);
};


/**
 * @param {!proto.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.SaveCode>}
 *     A native promise that resolves to the response
 */
proto.CSSPromiseClient.prototype.newSaveCode =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/CSS/NewSaveCode',
      request,
      metadata || {},
      methodDescriptor_CSS_NewSaveCode);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.SaveCode,
 *   !proto.SaveCodeValidationResponse>}
 */
const methodDescriptor_CSS_ValidateSaveCode = new grpc.web.MethodDescriptor(
  '/CSS/ValidateSaveCode',
  grpc.web.MethodType.UNARY,
  proto.SaveCode,
  proto.SaveCodeValidationResponse,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.SaveCodeValidationResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.SaveCode,
 *   !proto.SaveCodeValidationResponse>}
 */
const methodInfo_CSS_ValidateSaveCode = new grpc.web.AbstractClientBase.MethodInfo(
  proto.SaveCodeValidationResponse,
  /**
   * @param {!proto.SaveCode} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.SaveCodeValidationResponse.deserializeBinary
);


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.SaveCodeValidationResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.SaveCodeValidationResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.CSSClient.prototype.validateSaveCode =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/CSS/ValidateSaveCode',
      request,
      metadata || {},
      methodDescriptor_CSS_ValidateSaveCode,
      callback);
};


/**
 * @param {!proto.SaveCode} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.SaveCodeValidationResponse>}
 *     A native promise that resolves to the response
 */
proto.CSSPromiseClient.prototype.validateSaveCode =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/CSS/ValidateSaveCode',
      request,
      metadata || {},
      methodDescriptor_CSS_ValidateSaveCode);
};


module.exports = proto;

