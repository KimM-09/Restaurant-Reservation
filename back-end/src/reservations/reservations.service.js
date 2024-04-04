const knex = require("../db/connection");

async function create(newReservation) {
    return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRes) => createdRes[0]);
}

async function list() {
    return knex("reservations").select("*");
}

async function listByDate(date) {
    return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function read(reservation_id) {
    return knex("reservations")
    .where( "reservation_id", reservation_id )
    .select("*")
    .first()
}


async function update(updatedRes) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedRes.reservation_id })
    .update(updatedRes, "*")
    .then((updated) => updated[0]);
}

async function updateStatus(reservation_id, status) {
    return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .update({ status: status }, "*")
    .then((result) => result[0]);
}

async function search(mobile_number) {
    return knex("reservations")
    .whereRaw(
        "translate(mobile_number, '()-', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}


module.exports = {
    list,
    listByDate,
    read,
    create,
    update,
    updateStatus,
    search,
} 