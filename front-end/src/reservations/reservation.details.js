import React from "react";

function ReservationDetails(props) {
    const { reservation_id, first_name, last_name, mobile_number, reservation_date, reservation_time, people } = props;

    return(
        <>
          <tr key={reservation_id}>
            <td className="align-middle">{first_name}</td>
            <td className="align-middle">{last_name}</td>
            <td className="align-middle">{mobile_number}</td>
            <td className="align-middle">{reservation_date}</td> 
            <td className="align-middle">{reservation_time}</td>
            <td className="align-middle">{people}</td> 
          </tr>  
        </>
    );
}

export default ReservationDetails;