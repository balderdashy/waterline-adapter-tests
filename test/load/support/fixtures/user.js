module.exports = {
  connection: 'load_test',
  attributes: {
    pets: {
      collection: 'pet',
      via: 'owner'
    }
  }
};