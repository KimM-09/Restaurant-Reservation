const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const hasValidProperties = require("../errors/hasValidProperties")

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
    message: "There must be at least one person to reserve a table"
  })
}

function validTime(req, res, next) {
  const hoursEx = /^(1[0-9]|2[0-1]) : [0-5][0-9]$/;
  const { data: { reservation_time} = {} } = req.body;
  let time = reservation_time.slice(0, 5);
  if(!time || !hoursEx.test(time)) {
    return next({
      status:400,
      message: "The reservation_time is invalid."
    })
  }
  next();
}

function validTimeFrame(req, res, next) {
  const { data: { reservation_time, reservation_date } = {} } = req.body;
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
    asyncErrorBoundary(create)
  ],
};
