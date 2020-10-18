const AppointmentModel = require("../models/appointment");

const isMorningShift = (date) => {
  const start = 8 * 60 + 00;
  const end = 14 * 60 + 0;
  const time = date.getHours() * 60 + date.getMinutes();
  if (time < start && time >= end){
    throw new Error('We only work from 8AM to 14PM, and from 15PM to 18PM')
  }
};

const isNightShift = (date) => {
  const start = 15 * 60 + 30;
  const end = 18 * 60 + 0;
  const time = date.getHours() * 60 + date.getMinutes();
  if (time < start && time >= end){
    throw new Error('We only work from 8AM to 14PM, and from 15PM to 18PM')
  }
};

const isDateAlreadyTaken = async (date) => {
  try {
    const dateString = new Date(date).toISOString();
    const appointment = await AppointmentModel.findOne({
      status: 0,
      date: new Date(date).toISOString(),
    });
    if(appointment){
      throw new Error('The date is already taken.')
    }
  } catch (err) {
    throw err;
  }
};

const isWeekend = (date) => {
  const dateObj = new Date(date);
  if([0, 6].includes(dateObj.getDay())){
    throw new Error('We do not work on weekends.')
  };
};


module.exports = {
  isMorningShift,
  isNightShift,
  isDateAlreadyTaken,
  isWeekend
};