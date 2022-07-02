export default {
    toArray: (collection, property) => collection.map(element => element[property]),
    getParkDurationInMinutes: ({ startDate, endDate }) => Math.trunc(Math.abs(new Date(startDate) - new Date(endDate))/1000/60),
    getParkDurationInHours: ({ startDate, endDate }) => Math.abs(new Date(startDate) - new Date(endDate))/1000/60/60
};