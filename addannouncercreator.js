function createAddAnnouncer (execlib) {
  'use strict';
  var lib = execlib.lib,
    qlib = lib.qlib,
    execSuite = execlib.execSuite;

  var _announceUserHashAt = 'announceUserHashAt';

  function onUserProfileFetchedForAnnounce (where, defer, userhash) {
    this[_announceUserHashAt+where](userhash, defer);
    where = null;
  }

  function announcerCoreFor (where) {
    return function announcerCore (dbopsink, username, defer) {
      dbopsink.call('fetchUserProfile', username).then(
        onUserProfileFetchedForAnnounce.bind(this, where, defer),
        defer.reject.bind(defer)
      );
    }
  }

  function announcerHashCore (uepsink, userhash, defer) {
      if (userhash && userhash.status && userhash.status === 'blocked') {
        defer.reject(new lib.Error('USER_BLOCKED', 'User '+userhash.username+' is blocked'));
        return;
      }
      userhash.role = 'gamer';
      qlib.promise2defer(uepsink.call('announceUser', userhash, true, false), defer);
    }

  function addAnnouncer (klass, where, gamerentrypointname) {
    klass.prototype['announceUserAt'+where] = execSuite.dependentServiceMethod([], ['DBOperations'], announcerCoreFor(where));
    klass.prototype[_announceUserHashAt+where] = execSuite.dependentServiceMethod([], [gamerentrypointname], announcerHashCore);
  }

  return addAnnouncer;
}

module.exports = createAddAnnouncer;
