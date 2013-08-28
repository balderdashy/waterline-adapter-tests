module.exports = {
  crud: require('./crud'),
  schemaOptions: require('./schema-options'),
  belongsTo: require('./associations/belongsTo'),
  hasMany: require('./associations/hasMany'),
  manyToManyCustomer: require('./associations/many-to-many/customer'),
  manyToManyPayment: require('./associations/many-to-many/payment')
};
