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

const dateList = document.getElementById("DueDates");

chrome.runtime.sendMessage({method: "get"}, (response) => {
    response.forEach((event) => {
        const newEvent = document.createElement("li");
        const url = convertToCalendarUrl(event);
        newEvent.innerHTML = `<a href="${url}">${event.title}: ${event.date}</a>`
        dateList.appendChild(newEvent);
    })
});

const convertToCalendarUrl = (event) => {
    const title = event.title;
    const [fullDate, fullTime] = event.date.slice(
        event.date.indexOf(",") + 2,
        event.date.length
    ).split(", ");
    const [date, month, year] = fullDate.split(" ");
    const formattedDate = `${year}${monthNumerals[month]}${date}`;
    const formattedTime = timeFormat24Hr(fullTime);
    const url = `http://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedDate}T${formattedTime}Z/${formattedDate}T${formattedTime}Z`
    return url;
}

const timeFormat24Hr = (time) => {
    const [timeItself, amOrPm] = time.split(" ");
    let [hr, min] = timeItself.split(":");
    amOrPm === "PM" ?
        hr = (parseInt(hr) + 12).toString() :
        hr = hr;
    return `${hr}${min}00`
}