export default {
    toArray: (collection, property) => collection.map(element => element[property]),
    getDateDiffInMinutes: ({ startDate, endDate }) => Math.trunc(Math.abs(new Date(startDate) - new Date(endDate))/1000/60),
    getDateDiffInHours: ({ startDate, endDate }) => Math.ceil(Math.abs(new Date(startDate) - new Date(endDate))/1000/60/60)
};