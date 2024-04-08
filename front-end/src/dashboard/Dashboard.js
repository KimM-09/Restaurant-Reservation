import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations, listTables, finish } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, today, next } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ReservationList from "../reservations/reservation.list";
import TablesList from "../tables/tables.list";



/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables ] = useState([]);
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
    listTables()
      .then(setTables)
      .catch(setReservationsError)
    return () => abortController.abort();
  }

  async function finishHandler(table_id) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );

    if(result) {
      await finish(table_id, abortController.signal);
      loadDashboard();
    }
    return () => abortController.abort();
  }

  return (
    <main>
      <div className="card my-3 border-secondary">
      <h1 className="card-header text-white bg-dark">Dashboard</h1>
      <div className="card-body">
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      
      <Link 
        class-name="btn btn-outline-dark"
        to={`/dashboard?date=${previous(date)}`}>
      <button type="button" class="btn btn-outline-dark mr-2">
        Previous
      </button>
      </Link>
      <Link to={`/dashboard?date=${today()}`}>
      <button type="button" class="btn btn-outline-dark mr-2">
        Today
      </button>
      </Link>
      <Link to={`/dashboard?date=${next(date)}`}>
      <button type="button" class="btn btn-outline-dark mr-2">
        Next
      </button>
      </Link>
      <ReservationList
        reservations={reservations}
        />
      <TablesList
        tables={tables} finishHandler={finishHandler}
        />
        </div>
        </div>
    </main>
  );
}

export default Dashboard;
