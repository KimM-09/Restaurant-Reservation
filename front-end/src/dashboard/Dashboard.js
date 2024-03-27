import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationList from "../reservations/reservation.list";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const dateQuery = useQuery().get("date");
  if(dateQuery) {
    date = dateQuery;
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      
      <Link 
        class-name="btn btn-dark"
        to={`/dashboard?date=${previous(date)}`}>
      <button type="button" class="btn btn-primary mr-2">
        Previous
      </button>
      </Link>
      <Link to={`/dashboard?date=${today()}`}>
      <button type="button" class="btn btn-dark mr-2">
        Today
      </button>
      </Link>
      <Link to={`/dashboard?date=${next(date)}`}>
      <button type="button" class="btn btn-primary mr-2">
        Next
      </button>
      </Link>
      <ReservationList
        reservations={reservations}
        />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
