import React,  { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { readReservation, updateReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./reservation.form";
import ValidDateAndTime from "./reservation.validDateAndTime"

function EditReservation() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [ reservation, setReservation ] = useState({});
    const [ reservationsErrors, setReservationsError] = useState([]);

   const getResData = async(reservation_id) => {
    const reservation = await readReservation(reservation_id);
    reservation.reservation_date = formatAsDate(reservation.reservation_date);
    setReservation(reservation);
   }

   useEffect(() => {
    getResData(reservation_id);
   }, [reservation_id]);

   const submitHandler = (event) => {
    event.preventDefault();

    const errors = ValidDateAndTime(reservation);
    if(errors.length) {
        setReservationsError(errors);
    } else {
        updateReservation(reservation)
        .then(() => {
            history.push(`/dashboard?date=${reservation.reservation_date}`);
        })
        .catch(setReservationsError)
    }
   }

   return (
    <>
        <ErrorAlert errors={reservationsErrors} />
        <ReservationForm
            reservation={reservation}
            setReservation={setReservation}
            submitHandler={submitHandler}
        />
    </>
   )
}


export default EditReservation;