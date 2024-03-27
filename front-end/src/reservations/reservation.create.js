import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ReservationForm from "./reservation.form";
import ErrorAlert from "../layout/ErrorAlert";
import {createReservations} from "../utils/api";
import ValidDateAndTime from "./reservation.validDateAndTime";

function CreateReservation(){
    const history = useHistory();
    const initialForm = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1,
    };

    const [ reservationInfo, setReservationInfo ] = useState({...initialForm});
    const [ errors, setErrors ] = useState([]);

    //Validate the date and time before submitting the form
    const validResDateAndTime = () => {
        const errorArray = ValidDateAndTime(reservationInfo);
        if(errorArray.lenght === 0){
            return true;
        } else {
            setErrors(errorArray);
            return false;
        }
    }

    const reservationErrors = () => {
        let list = Date.now();
        return errors.map((error) => {
            list = list + 1;
            return <ErrorAlert key={list} error={error} />;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors([]);
        try {
            const abortController = new AbortController();
            if(validResDateAndTime()) {
                await createReservations({
                    ...reservationInfo,
                    people: parseInt(reservationInfo.people),
                },
                abortController.signal
                );
                setReservationInfo(initialForm);
                history.push(`/dashboard?date=${reservationInfo.reservation_date}`)
            }
        } catch (error) {
            if(error.name !== "AbortError") {
                setErrors([...errors, error]);
            } else return;
        }
    };


    return (
        <div>
            <h1>Create Reservation</h1>
            {errors.length > 0 ? reservationErrors() : null}
            <ReservationForm
            handleSubmit={handleSubmit}
            reservationInfo={reservationInfo}
            setReservationInfo={setReservationInfo}
            />
        </div>
    )
}

export default CreateReservation;