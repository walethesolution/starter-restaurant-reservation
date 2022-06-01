const knex = require("../db/connection");

// function listAll(reservation_date) {
//   return knex("reservations")
//     .select("*")
//     .where({ reservation_date: reservation_date })
//     .whereNot({ status: "finished" })
//     .orderBy("reservation_time");
// }

function listAll(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .whereRaw(
      "(status is null or ( status <> 'finished' and status <> 'cancelled')) "
    )
    .orderBy("reservation_time", "asc");
}

function searchByPhone(mobile_number) {
  console.log("mobile number: " + mobile_number);
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((data) => data[0]);
}

function update(reservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*")
    .then((data) => data[0]);
}

module.exports = {
  listAll,
  // listByDate,
  searchByPhone,
  read,
  create,
  update,
};
