function createAddMethodReplicator (execlib) {
  'use strict';

  var execSuite = execlib.execSuite,
    lib = execlib.lib,
    qlib = lib.qlib;

  function plainReplicationTemplate (methodname) {
    return function () {
      var sink = arguments[0],
        callargs = Array.prototype.slice.call(arguments, 1, -1),
        defer = arguments[arguments.length-1];
      callargs.unshift(methodname);
      qlib.promise2defer(sink.call.apply(sink, callargs), defer);
    }
  }

  function replicator (replicatedmethod, realparamcount) {
    switch (realparamcount) {
      case 0: 
        return function replicator0 (sink, defer) {
          return replicatedmethod.apply(this, arguments);
        }
      case 1: 
        return function replicator1 (sink, p1, defer) {
          return replicatedmethod.apply(this, arguments);
        }
      case 2: 
        return function replicator2 (sink, p1, p2, defer) {
          return replicatedmethod.apply(this, arguments);
        }
      case 3: 
        return function replicator3 (sink, p1, p2, p3, defer) {
          return replicatedmethod.apply(this, arguments);
        }
      default:
        throw new lib.Error('UNSUPPORTED_NUMBER_OF_REAL_PARAMETERS', realparamcount+' is not a supported number of real parameters');
    }
  }

  function addMethodReplicator (klass, methodname, options) {
    var replicatedmethod, paramcount;
    if (lib.isNumber(options)) {
      replicatedmethod = plainReplicationTemplate(methodname);
      paramcount = options;
    }
    if (!replicatedmethod) {
      throw new lib.Error('NO_REPLICATED_METHOD', 'Could not create a replicated method');
    }
    klass.prototype[methodname] = execSuite.dependentServiceMethod([], ['DBOperations'], replicator(replicatedmethod, paramcount));
  };

  return addMethodReplicator;

}

module.exports = createAddMethodReplicator;
