import React from "react";
import { useHistory } from "react-router-dom";


function ReservationForm(props) {
    const { reservationInfo, setReservationInfo, handleSubmit } = props;
    const history = useHistory();

    const handleChange = ( event ) => {
        setReservationInfo({
            ...reservationInfo,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">First Name</label>
            <input
            id="first_name"
            name="first_name"
            type="text"
            value={reservationInfo["first_name"]}
            onChange={handleChange}
            required
            placeholder="First Name"
            className="form-control"
            />
            <label htmlFor="last_name">Last Name</label>
            <input
            id="last_name"
            name="last_name"
            type="text"
            value={reservationInfo["last_name"]}
            onChange={handleChange}
            required
            placeholder="Last Name"
            className="form-control"
            />
            <label htmlFor="mobile_number">Phone Number</label>
            <input
            id="mobile_number"
            name="mobile_number"
            type="tel"
            value={reservationInfo["mobile_number"]}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            className="form-control"
            />
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
            id="reservation_date"
            name="reservation_date"
            type="date"
            value={reservationInfo["reservation_date"]}
            onChange={handleChange}
            required
            placeholder="Reservation Date"
            className="form-control"
            />
            <label htmlFor="reservation_time">Reservation Time</label>
            <input
            id="reservation_time"
            name="reservation_time"
            type="time"
            value={reservationInfo["reservation_time"]}
            onChange={handleChange}
            placeholder="Reservation Time"
            className="form-control"
            />
            <label htmlFor="people">Number of Guests</label>
            <input
            id="people"
            name="people"
            type="number"
            value={reservationInfo["people"]}
            onChange={handleChange}
            required
            placeholder="Number of Guests"
            className="form-control"
            />
            <button type="button" onClick={() => history.goBack()} className="btn btn-danger mr-2">
                Cancel
            </button>
            <button type="submit" className="btn btn-primary mr-2">
                Submit
            </button>
        </form>
    )
}

export default ReservationForm;