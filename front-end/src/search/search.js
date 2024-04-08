import React, { useState } from "react";
import { useHistory }  from "react-router-dom";
import { searchByMobile } from "../utils/api";
import ReservationList from "../reservations/reservation.list";

function Search() {

    const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([]);
    const [searchErrors, setSearchErrors] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const history = useHistory();

    const changeHandler = (event) => { 
        setMobileNumber(event.target.value); 
    }

    const submitHandler = (event) => {
        setReservations([]);
        event.preventDefault();
        const abortController = new AbortController();

        async function searchByPhone(){
            try{
                setSubmitted(true);
                const result = await searchByMobile(mobileNumber, abortController.signal);
                if (result.length) {
                    setReservations(result);
                } else {
                    setReservations(["No reservations found"]);
                }
            } catch(error) {
                setSearchErrors([...searchErrors, error.message]);
            }
        }
        searchByPhone();

        return () => abortController.abort();
    }

    return(
        <div className="card my-3 border-secondary">
            <h3 className="card-header text-white bg-dark">Search</h3>
            <div className="card-body">
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="mobile_number">Mobile number:</label>
                        <input  
                            className="form-control"
                            id="mobile_number"
                            name="mobile_number"
                            type="text"
                            placeholder="Enter a customer's phone number"
                            value={mobileNumber}
                            onChange={changeHandler}
                            required={true}
                        />
                        <div>
                            <button type="button" className="btn btn-outline-danger m-2" onClick={()=> history.goBack()}> 
                                Cancel 
                            </button>
                            <button type="submit" className="btn btn-outline-secondary m-2"> 
                                Find 
                            </button>
                        </div>
                    </div>
                </form>
            </div>  {submitted ? <ReservationList reservations={reservations} /> : ""}   
        </div>
    )  
}

export default Search;