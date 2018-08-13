function createLib (execlib) {
  return {
    servicemixin: require('./service')(execlib),
    addMethodReplicator: require('./addmethodreplicatorcreator')(execlib),
    addAnnouncer: require('./addannouncercreator')(execlib)
  };
}

module.exports = createLib;
