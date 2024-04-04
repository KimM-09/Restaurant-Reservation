import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {createReservations} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ValidDateAndTime from "./reservation.validDateAndTime";
import ReservationForm from "./reservation.form";

function CreateReservation(){
    const history = useHistory();
    const [ resErrors, setResErrors ] = useState([]);
    const [ reservation, setReservation ] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    });
    


    const submitHandler = (event) => {
        event.preventDefault();
        
        const errors = ValidDateAndTime(reservation);
        if(errors.length) {
            setResErrors(errors);
        } else {
            createReservations(reservation)
            .then(() => {
                history.push(`/dashboard?date=${reservation.reservation_date}`)
            })
            .catch(setResErrors)
        }
    };


    return (
        <div>
            <ErrorAlert errors={resErrors} />
            <h1>Create Reservation</h1>
            <ReservationForm
                reservation={reservation}
                setReservation={setReservation}
                submitHandler={submitHandler}
            />
        </div>
    );
}

export default CreateReservation;