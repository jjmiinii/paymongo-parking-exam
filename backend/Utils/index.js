export default {
    calculateHourDuration: async (startDateTime, endDateTime) => Math.abs(startDateTime - endDateTime) / 36e5;
}