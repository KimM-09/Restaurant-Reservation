import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ValidTable from "./tables.validate";

function CreateTable() {
    const history = useHistory();
    const [table, setTable] = useState({
        table_name:"",
        capacity:"",
    })
    const [tableErrors, setTableErrors] = useState([]);

    const changeHandler = ({ target: { name, value } }) => { 
      
        if(name === "capacity") {
            setTable((previousTable)=> ({
                ...previousTable,
                [name]: Number(value),
            }));
        } else {
            setTable((previousTable) => ({
              ...previousTable,
                [name]: value,
            }));
        }
    }
    
    const submitHandler = (event) => {
        event.preventDefault();
        const abortController = new AbortController();

        const errors = ValidTable(table);

        if(errors.length) {
            setTableErrors(errors);
        } else {
            createTables(table, abortController.signal)
                .then(history.push(`/dashboard`))
                .catch(setTableErrors);
        }
                
        return () => abortController.abort();
    }


    return (
        <div>
            <ErrorAlert errors={tableErrors} />
            <div className="card my-3 border-secondary">
                <h3 className="card-header text-white bg-primary">New Table</h3>
                <div className="card-body">
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                        <label className="form-label" htmlFor="table_name">Table Name:</label>
                        <input  
                            className="form-control"
                            id="table_name"
                            name="table_name"
                            type="text"
                            value={table.table_name}
                            minLength="2"
                            onChange={changeHandler}
                            required={true}
                        />
                        <label className="form-label" htmlFor="capacity">Capacity:</label>
                        <input
                            className="form-control"
                            id="capacity"
                            name="capacity"
                            type="number"
                            min={1}
                            value={table.capacity}
                            onChange={changeHandler}
                            required={true}
                        />
                        <div>
                            <button type="button" className="btn btn-secondary m-2" onClick={()=> history.goBack()}> Cancel </button>
                            <button type="submit" className="btn btn-primary m-2"> Submit </button>
                        </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateTable;