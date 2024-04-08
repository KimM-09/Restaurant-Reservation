import React from "react";
import { useHistory } from "react-router-dom";


function ReservationForm(props) {
    const { reservation, setReservation, submitHandler } = props;
    const history = useHistory();

    const handleChange = ({ target: { name, value } }) => {
        if(name === "people") {
            setReservation((previousReservation) => ({
                ...previousReservation,
                [name]: Number(value),
            }));
        } else {
            setReservation((previousReservation) => ({
                ...previousReservation,
                [name]: value,
            }));
        }
    }
   

    return (
        <div className="card my-3 border-dark">
        <h3 className="card-header text-white bg-dark">New Reservation</h3>
            <div className="card-body">
        <form onSubmit={submitHandler}>
        <div className="form-group">
            <label htmlFor="first_name">First Name</label>
            <input
            id="first_name"
            name="first_name"
            type="text"
            value={reservation.first_name}
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
            value={reservation.last_name}
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
            value={reservation.mobile_number}
            onChange={handleChange}
            required
            placeholder="(xxx) xxx-xxxx"
            className="form-control"
            />
            <label htmlFor="reservation_date">Reservation Date</label>
            <input
            id="reservation_date"
            name="reservation_date"
            type="date"
           value={reservation.reservation_date}
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
            value={reservation.reservation_time}
            onChange={handleChange}
            placeholder="Reservation Time"
            className="form-control"
            />
            <label htmlFor="people">Number of Guests</label>
            <input
            id="people"
            name="people"
            type="number"
            value={reservation.people}
            onChange={handleChange}
            required
            placeholder="Number of Guests"
            className="form-control"
            />
            
          <div>
            <button type="button" onClick={() => history.goBack()} className="btn btn-outline-danger mr-2 my-3">
                Cancel
            </button>
            <button type="submit" className="btn btn-outline-dark mr-2">
                Submit
            </button>
            </div>
          </div>
        </form>
        </div>
        </div>
    )
}

export default ReservationForm;