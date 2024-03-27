import React from "react";
import ReservationDetails from "./reservation.details";


function ReservationList({ reservations }) {
    const reservationList = reservations.map((reservation) => {
        return (
            <ReservationDetails
            key={reservation.reservation_id}
            reservation_id={reservation.reservation_id}
            first_name={reservation.first_name}
            last_name={reservation.last_name}
            mobile_number={reservation.mobile_number}
            reservation_date={reservation.reservation_date}
            reservation_time={reservation.reservation_time}
            people={reservation.people}
            />
        )
    });
    if(reservations[0] !== "No reservations found") {
        return (
            <div className="table-responsive">
                <table className="table table-condensed table-striped">
                    <thead>
                        <tr>
                            <th scope = "col">First:</th>
                            <th scope = "col">Last:</th>
                            <th scope = "col">Phone:</th>
                            <th scope = "col">Date:</th>
                            <th scope = "col">Time:</th>
                            <th scope = "col">Number of Guests:</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservationList}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return (
            <h4>No reservation found</h4>
        )
    }
    
}

export default ReservationList;