exports.seed = function (knex) {
  return knex('admins').insert([{ user_id: 1 }]);
};