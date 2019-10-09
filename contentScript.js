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

window.onload = function() {
    try {
        const heading = document.getElementById("region-main")
            .getElementsByTagName("div")[0]
            .getElementsByTagName("h2")[0]
            .innerHTML.replace("#", '');

        const statusTable = document.getElementsByClassName("generaltable")[0].children[0];

        if (statusTable) {
            let submissionStatusElement = null;
            let dueDateElement = null;
            if(statusTable.children[0].children[0].innerHTML === "Attempt number") {
                submissionStatusElement = statusTable.children[1];
                dueDateElement = statusTable.children[3];
            }else {
                submissionStatusElement = statusTable.children[0];
                dueDateElement = statusTable.children[2]
            }

            const courseCode = document.getElementsByClassName("breadcrumb")[0].children[2].children[0].children[0]
                .getAttribute("title");
            const submissionStatus = submissionStatusElement.children[1].innerHTML;
            const dueDate = dueDateElement.children[1].innerHTML;

            const addedAt = new this.Date().getTime();
            const dueDateAndTime = getDateAndTime(dueDate);
            const dueTime = timeFormat24Hr(dueDateAndTime.fullTime);
            const dueTimeForTimer = `${dueTime.substr(0, 2)}:${dueTime.substr(2, 2)}:${dueTime.substr(4, 2)}`;
            const dueDateForTimer = `${monthNumerals[dueDateAndTime.month]}/${dueDateAndTime.date}/${dueDateAndTime.year} ${dueTimeForTimer}`;
            const dueTimeInMs = new Date(dueDateForTimer).getTime();

            const url = convertToCalendarUrl(heading, dueDate);

            const data = {
                courseCode,
                title: heading,
                addedAt,
                date: dueDate,
                dueTimeInMs,
                url,
                hasSubmitted: submissionStatus === "Submitted for grading" ? true : false
            }

            chrome.runtime.sendMessage(
                {
                    method: "add",
                    data
                }
            );
        }
    }
    catch (err) {
        console.log("not an assignment");
    }
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

const convertToCalendarUrl = (title, dueDate) => {
    const dateAndTime = getDateAndTime(dueDate);
    const formattedDate = `${dateAndTime.year}${monthNumerals[dateAndTime.month]}${dateAndTime.date}`;
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