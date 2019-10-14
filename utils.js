const monthNumerals = {
    January: "01",
    February: "02",
    March: "03", 
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12"
}

const monthAlpha = {
    "01": "January",
    "02": "Febrary",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
}

const getDateAndTime = (dueDate) => {
    const [fullDate, fullTime] = dueDate.slice(
        dueDate.indexOf(",") + 2,
        dueDate.length
    ).split(", ");
    let [date, month, year] = fullDate.split(" ");
    
    if (date.length === 1) {
        date = `0${date}`
    }
    return {date, month, year, fullTime};
}

const convertToCalendarUrl = (title, dueDate, manualEntry = false) => {
    const dateAndTime = !manualEntry ? getDateAndTime(dueDate) : dueDate;

    const formattedDate = !manualEntry ? 
        `${dateAndTime.year}${monthNumerals[dateAndTime.month]}${dateAndTime.date}`
    :
        `${dateAndTime.year}${dateAndTime.month}${dateAndTime.date}`;

    const formattedTime = timeFormat24Hr(dateAndTime.fullTime);
    const url = `http://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedDate}T${formattedTime}/${formattedDate}T${formattedTime}`
    return url;
}

const timeFormat24Hr = (time) => {
    const [timeItself, amOrPm] = time.split(" ");
    let [hr, min] = timeItself.split(":");
    if (amOrPm === "PM") {
        hr = (parseInt(hr) + 12).toString() 
    }
    return `${hr}${min}00`
}