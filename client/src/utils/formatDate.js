export function sortAndFormatDate(date) {
  const now = new Date();
  const oneMinute = 60 * 1000; // milliseconds in a minute
  const oneHour = 60 * oneMinute; // milliseconds in an hour
  const oneDay = 24 * oneHour; // milliseconds in a day
  const oneWeek = 7 * oneDay; // milliseconds in a week
  const oneMonth = 30 * oneDay; // approximately 30 days in a month
  const oneYear = 365 * oneDay; // approximately 365 days in a year
  const dateObj = new Date(date);
  const diff = now - dateObj;
  if (diff >= oneYear) {
    // If it's up to a year, return month, day, and year
    const year = dateObj.getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[dateObj.getMonth()] + " " + dateObj.getDate() + " " + year;
  } else if (diff >= oneWeek) {
    // If it's greater than 7 days, return the day difference as "Xd"
    return Math.floor(diff / oneDay) + "d";
  } else if (diff >= oneDay) {
    // If it's within a month, return the month and day
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[dateObj.getMonth()] + " " + dateObj.getDate();
  } else if (diff >= oneHour) {
    // If it's within the same day, return the hour difference
    return Math.floor(diff / oneHour) + "h";
  } else if (diff >= oneMinute) {
    // If it's in the same hour, return the minute difference
    return Math.floor(diff / oneMinute) + "m";
  } else {
    // If it's in the same minute, return the second difference
    return Math.floor(diff / 1000) + "s";
  }
}
