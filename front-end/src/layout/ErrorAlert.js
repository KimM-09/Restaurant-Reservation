import React from "react";



function ErrorAlert({ errors }) {
  if(errors && errors.length) {
    return (
    <div className="alert alert-danger m-2">
      <p>Error:</p>
      {errors.map((error) => (
        <p key={errors.indexOf(error)}> {error.message}</p>
      ))}
    </div>
    );
  }
  return null;
}

export default ErrorAlert;
