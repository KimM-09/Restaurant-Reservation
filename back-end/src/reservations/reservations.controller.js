const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasValidProperties = require("../errors/hasValidProperties");

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
]

const VALID_PROPERTIES = [
  "reservation_id",
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
] 


//Validation functions
function hasAtLeastOnePerson(req, res, next){
  const  { people } = req.body.data
  const valid = Number.isInteger(people);
  if(valid && people > 0 ) {
    return next();
  }
  next({
    status:400,
    message: `${people} is not a valid number`
  })
}

function validTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const hoursEx = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");

  if(hoursEx.test(reservation_time)) {
    return next();
  }
  next({
    status:400,
    message: "The reservation_time is invalid."
  });
}

function validTimeFrame(req, res, next) {
  const { reservation_time, reservation_date } = req.body.data;
  const resDate = new Date(`${reservation_date} ${reservation_time}`);
  const resHour = resDate.getHours();
  const resMin = resDate.getMinutes();
  const compare = resHour * 100 + resMin;

  if(compare >= 1030 && compare < 2130) {
    return next()
  }
  next({
    status:400,
    message:"Reservations can only be made between 10:30am and 9:30pm."
  })
}

function validDate(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = Date.parse(reservation_date);

  if(date && date > 0) {
    return next();
  } else {
    return next({
      status:400,
      message: 'The reservation_date field is invalid'
    })
  }
}

function notTuesday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  const day = date.getUTCDay();

  if(day !==2) {
    return next();
  }
  return next({
    status: 400,
    message: "Reservations cannot be made on Tuesdays as the Restaurant is closed."
  });
}

function notPastDate(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const resDate = new Date(`${reservation_date} ${reservation_time}`);
  const newResDate = resDate.valueOf();
  const current = Date.now();

  if(newResDate < current) { 
    return next({
      status:400,
      message:"Reservations cannot be made for a past date."
    })
  }
  return next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const resId = Number.parseInt(reservation_id)

  if(resId) {
    const reservation = await service.read(resId);

    if(reservation) {
      res.locals.reservation = reservation;
      return next();
    }
  }
  return next({
    status: 404,
    message: `${reservation_id} does not exist`
  })
}

async function hasValidStatus(req, res, next) {
  const { status } = req.body.data

  if(status) {
    const validStatus = ["booked", "seated", "finished", "cancelled"]

    if(validStatus.includes(status)) {
      res.locals.status = status;
      return next();
    }
    return next({
      status: 400,
      message: `${status} is invalid`
    });
  } else {
    res.locals.status = "booked";
    return next();
  }
}

async function statusNotFinished(req, res, next) {
  const status = res.locals.reservation.status;

  if(status === "finished") {
    return next({
      status: 400,
      message: "Finished reservations cannot be updated"
    })
  }
  return next();
}

async function statusBooked(req, res, next) {
  const {status} = req.body.data;
  if(status && status !== "booked") {
    return next({
      status:400,
      message: "Status must be 'booked' when creating a new reservation"
    })
  }
    return next();
}



//CRUDL 
async function list(req, res) {
  const { date } = req.query;
  
  if(date) {
    const data = await service.listByDate(date);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data })
  }
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function create(req, res) {

  const newReservation = ({
    first_name, 
    last_name, 
    mobile_number, 
    reservation_date, 
    reservation_time, 
    people
  } = req.body.data);

  const createReservation = await service.create(newReservation);
  res.status(201).json({ data: createReservation });
}

async function update(req, res) {
  const reservation = req.body.data;
  const updatedRes = {
    ...reservation,
    reservation_id: reservation.reservation_id,
  };
  const resInfo = await service.update(updatedRes);
  res.status(200).json({ resInfo });
}

async function statusUpdate(req, res) {
  const { status } = res.locals;
  const { reservaion_id } = res.locals.reservation;
  const updatedStat = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: updatedStat });
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasProperties(...REQUIRED_PROPERTIES),
    hasValidProperties(...VALID_PROPERTIES),
    validDate,
    validTime,
    hasAtLeastOnePerson,
    notTuesday,
    notPastDate,
    validTimeFrame,
    statusBooked,
    asyncErrorBoundary(create)
  ],
  read: [
    reservationExists,
    asyncErrorBoundary(read)
  ],
  update: [
    hasProperties(...REQUIRED_PROPERTIES),
    hasValidProperties(...VALID_PROPERTIES),
    validDate,
    validTime,
    hasAtLeastOnePerson,
    reservationExists,
    hasValidStatus,
    asyncErrorBoundary(update)
  ],
  statusUpdate: [
    reservationExists, 
    hasValidStatus,
    statusNotFinished,
    asyncErrorBoundary(statusUpdate)
  ],
};
