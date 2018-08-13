function createServiceMixin (execlib) {
  'use strict';

  var lib = execlib.lib;

  function DBOperationsAwareServiceMixin (prophash) {
    this.findRemote(this.clusterDependentRemotePath(prophash.dboperationsname || 'DBOperations'));
  }

  DBOperationsAwareServiceMixin.addMethods = function (klass) {
  };

  return DBOperationsAwareServiceMixin;
}

module.exports = createServiceMixin;
