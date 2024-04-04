
exports.up = function(knex) {
  return knex.schema.table("reservations", (table) => {
    table.string("status").notNullable().defaultTo("booked")
  })
};

exports.down = function(knex) {
  return knex.schema.table("reservations", (table) => {
    //Checks if the column exists in the table and drops it. 
    //This is used because the table was not updating in my database management tool properly.
    knex.schema.hasColumn('status').then((exists) => {
        if (exists) {
            table.dropColumn("status");
        }
      });
  });
};
