import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { previous, next, today } from "../utils/date-time";

function DashboardButtons({ reservationsDate }) {
  const history = useHistory();
  const location = useLocation();

  function previousButtonClickHandler() {
    history.push({
      pathname: location.pathname,
      search: `?date=${previous(reservationsDate)}`,
    });
  }

  function todayButtonClickHandler() {
    history.push({
      pathname: location.pathname,
      search: `?date=${today()}`,
    });
  }

  function nextButtonClickHandler() {
    history.push({
      pathname: location.pathname,
      search: `?date=${next(reservationsDate)}`,
    });
  }

  return (
    <div className="btn-group mt-1 mb-4" role="group">
      <button
        type="button"
        className="btn btn-secondary btn-sm col-auto"
        onClick={previousButtonClickHandler}
      >
        Previous
      </button>
      <button
        type="button"
        className="btn btn-secondary active btn-sm col-auto"
        onClick={todayButtonClickHandler}
      >
        Today
      </button>
      <button
        type="button"
        className="btn btn-secondary btn-sm col-auto"
        onClick={nextButtonClickHandler}
      >
        Next
      </button>
    </div>
  );
}

export default DashboardButtons;
