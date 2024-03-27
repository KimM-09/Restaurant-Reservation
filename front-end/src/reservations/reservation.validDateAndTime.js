

function ValidDateAndTime(reservation) {
    const resDate = reservation.reservation_date;
    const resTime = reservation.reservation_time;
    const errors = [];
    const day = new Date(resDate).getUTCDay();
    //Verify the reservation is not being made on a Tuesday
    if(day === 2) {
        errors.push(new Error("Reservations are not available on Tuesday as the Restaurant is closed."));
    }

    const today = Date.now();
    const newResDate = new Date(`${resDate} ${resTime}`);
    const compareDate = newResDate.valueOf();
    //Verify the reservation is not being made on a date from the past
    if(today > compareDate) {
        errors.push(new Error("Reservations cannot be made for a past date"));
    }

    const hours = newResDate.getHours();
    const minutes = newResDate.getMinutes();
    const compareTime = hours * 100 + minutes;
    //Verify the reservation is being made within the approved hours.
    if(compareTime < 1030 || compareTime >= 2130) {
        errors.push(new Error("Reservations must be between the hours of 10:30am and 9:30pm."))
    }
    return errors;
}

export default ValidDateAndTime;