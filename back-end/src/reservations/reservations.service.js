const knex = require("../db/connection");

async function list() {
    return knex("reservations").select("*");
}

async function listByDate(date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date: date });
}

function read(reservation_id) {
    return knex("reservations")
    .select("*")
    .where( "reservation_id", reservation_id ).first()
}

async function create(newReservation) {
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRes) => createdRes[0]);
}

module.exports = {
    list,
    listByDate,
    read,
    create,
}