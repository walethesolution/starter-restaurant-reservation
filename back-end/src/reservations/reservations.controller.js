/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../utils/has-properties");
const hasOnlyValidProperties = require("../utils/has-only-valid-properties");
const {
  validateDate,
  storeIsOpen,
  dateIsNotBeforeToday,
  validateTime,
  validatePeople,
  validateReservationTime,
  validateStatus,
  validateCurrentStatus,
  validateStatusUpdate,
} = require("../utils/validation");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
];

const hasRequiredProperties = hasProperties(
  ...[
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ]
);
const hasOnlyValidReservationProperties = hasOnlyValidProperties(
  ...VALID_PROPERTIES
);
const hasRequiredUpdateProperties = hasProperties(
  ...[
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ]
);
const hasOnlyValidUpdatePropeties = hasOnlyValidProperties(
  ...[
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "reservation_id",
    "created_at",
    "updated_at",
  ]
);

async function reservationExist(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: reservation_id });
}

async function list(req, res) {
  const { date, mobile_number } = req.query;
  console.log("the date is: " + date, "the mobile number is: " + mobile_number);
  if (date) {
    const data = await service.listAll(date);
    console.log(data);
    res.json({ data });
  } else {
    const data = await service.searchByPhone(mobile_number);
    res.json({ data });
  }
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

async function update(req, res) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };
  res.status(200).json({ data: await service.update(updatedReservation) });
}

async function updateStatus(req, res) {
  const updatedReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  };
  res.status(200).json({ data: await service.update(updatedReservation) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidReservationProperties,
    hasRequiredProperties,
    validateDate,
    storeIsOpen,
    dateIsNotBeforeToday,
    validateTime,
    validatePeople,
    validateReservationTime,
    validateStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExist), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationExist),
    hasRequiredUpdateProperties,
    hasOnlyValidUpdatePropeties,
    validateDate,
    storeIsOpen,
    dateIsNotBeforeToday,
    validateTime,
    validatePeople,
    validateReservationTime,
    asyncErrorBoundary(update),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExist),
    validateCurrentStatus,
    validateStatusUpdate,
    asyncErrorBoundary(updateStatus),
  ],
};
