
exports.seed = function(knex) {
  return knex('users').truncate()
    .then(function () {
      return knex('users').insert([
        { user_name: 'David' },
        { user_name: 'Roger' },
        { user_name: 'Sid' }
      ]);
    });
};
