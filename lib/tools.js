const isMorningShift = (date) => {
  const start = 8 * 60 + 00;
  const end = 14 * 60 + 0;
  const time = date.getHours() * 60 + date.getMinutes();
  return time >= start && time < end;
};

const isNightShift = (date) => {
  const start = 15 * 60 + 30;
  const end = 18 * 60 + 0;
  const time = date.getHours() * 60 + date.getMinutes();
  return time >= start && time < end;
};

const isDateAlreadyTaken = async (date) => {
  try {
    const dateString = new Date(date).toISOString();
    const appointment = await AppointmentModel.findOne({
      status: 0,
      date: new Date(date).toISOString(),
    });
    return appointment;
  } catch (err) {
    throw err;
  }
};

const isWeekend = (date) => {
  const dateObj = new Date(date);
  return [0, 6].includes(dateObj.getDay());
};

const isValidDate = async (date) => {
  try {
    return await !isDateAlreadyTaken(date) && !isWeekend(date) && isMorningShift(date) && isNightShift(date);
  } catch (err) {
    throw err;
  }
};

module.exports = {
  isMorningShift,
  isNightShift,
  isDateAlreadyTaken,
  isValidDate
};
