import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, seatReservation } from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";
import SeatReservationFormButtons from "./SeatReservationFormButtons";

function SeatReservationForm() {
  const { reservation_id } = useParams();
  const history = useHistory();

  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tableAssignment, setTableAssignment] = useState({
    table_id: "",
    reservation_id,
  });

  useEffect(loadDashboard, []);

  function loadDashboard() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setError);
    return () => abortController.abort();
  }

  const tableAssignmentOptions = tables.map((table) => (
    <option value={table.table_id} key={table.table_id}>
      {table.table_name} - {table.capacity}
    </option>
  ));

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);

    if (!tableAssignment.table_id) {
      setError({
        message: "Please select a table option from the drop down menu.",
      });
    } else {
      seatReservation(tableAssignment, abortController.signal)
        .then(() => history.push("/"))
        .catch(setError);
      return () => abortController.abort();
    }
  }

  function changeHandler({ target: { name, value } }) {
    setTableAssignment((previousTable) => ({
      ...previousTable,
      [name]: value,
    }));
  }

  return (
    <main>
      <h1 class="mt-lg-4 mt-1 mb-3">Seating Reservation {reservation_id}</h1>
      <ErrorAlert error={error} />
      <form onSubmit={submitHandler} class="mt-3">
        <div class="row">
          <label
            htmlFor="table_assignment"
            class="col-form-label col-auto pr-1 ml-1"
          >
            <h5>Assign to Table:</h5>
          </label>
          <div class="col-auto pl-3">
            <select
              id="table_assignment"
              name="table_id"
              class="form-select mb-2 pr-10"
              aria-label="Default select example"
              value={tableAssignment.table_id}
              onChange={changeHandler}
              require="true"
            >
              <option value="">Table Name - Table Capacity</option>
              {tableAssignmentOptions}
            </select>
          </div>
          <SeatReservationFormButtons history={history} />
        </div>
      </form>
    </main>
  );
}

export default SeatReservationForm;
