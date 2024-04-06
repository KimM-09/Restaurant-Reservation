

function ValidTable(table) {
    const name = table.table_name;
    const capacity = table.capacity;
    const errors = [];

    // Verify the table name is at least 2 characters in length.
    if (name.length < 2) {
        errors.push(new Error("Table name must be at least 2 characters."));
    }

    // Verify the capacity is a number and is greater than 0.
    if (isNaN(capacity) || !capacity){
        errors.push(new Error("Table capacity must be a number."));
    } else if (capacity < 1) {
        errors.push(new Error("Table capacity must be as least 1."));
    }

    return errors;
}

export default ValidTable;