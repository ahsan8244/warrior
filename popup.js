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
const completedList = document.getElementById("completed");

chrome.runtime.sendMessage({method: "get"}, (response) => {
    if (response.length === 0) {
        const emptyLabel = document.createElement("p");
        emptyLabel.setAttribute("class", "label");
        emptyLabel.innerHTML = "nothing to show";
        dateList.parentNode.insertBefore(emptyLabel, dateList);
    }else {
        response.forEach((event) => {
            const newEvent = document.createElement("li");

            const dateAndTime = getDateAndTime(event);
            const time = timeFormat24Hr(dateAndTime.fullTime);
            const timeForTimer = `${time.substr(0, 2)}:${time.substr(2, 2)}:${time.substr(4, 2)}`;
            const dateForTimer = `${monthNumerals[dateAndTime.month]}/${dateAndTime.date}/${dateAndTime.year} ${timeForTimer}`;
            const endTimeInMs = new Date(dateForTimer).getTime();

            const url = convertToCalendarUrl(event);
            newEvent.innerHTML = dueCard(event.courseCode, event.title, event.date, url, event.addedAt, endTimeInMs);
            dateList.appendChild(newEvent);
        });
    }
});

chrome.runtime.sendMessage({method: "getCompleted"}, (response) => {
    if (response.length === 0) {
        const emptyLabel = document.createElement("p");
        emptyLabel.setAttribute("class", "label");
        emptyLabel.innerHTML = "nothing to show";
        completedList.parentNode.insertBefore(emptyLabel, completedList);
    }else {
        response.forEach(event => {
            const newEvent = document.createElement("li");
            newEvent.innerHTML = completedCard(event.courseCode, event.title);
            completedList.appendChild(newEvent);
        });
    }
});

const getDateAndTime = (event) => {
    const [fullDate, fullTime] = event.date.slice(
        event.date.indexOf(",") + 2,
        event.date.length
    ).split(", ");
    let [date, month, year] = fullDate.split(" ");
    
    if (date.length === 1) {
        date = `0${date}`
    }
    return {date, month, year, fullTime};
}

const convertToCalendarUrl = (event) => {
    const title = event.title;
    const dateAndTime = getDateAndTime(event);
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

const dueCard = (code, title, date, url, startTime, endTime) => {
    return `
        <div class="dueCard">
            <p>${code}</p>
            <p>${title}</p>
            <p>${date}</p>
            <div class="progress">
                <div id="pgbar" class="progress-bar" style="width: 0%" role="progressbar" aria-valuenow="0" aria-valuemin="${startTime}" aria-valuemax="${endTime}"></div>
            </div>
            <a class="btn btn-primary" href="${url}" target="_blank">add to calendar</a>
        </div>
    `;
}

const completedCard = (code, title) => {
    return `
    <div class="completedCard">
        <p>${code}</p>
        <p>${title}</p>
    </div>
    `;
}

const updateProgress = () => {
    console.log("getting called");
    const allProgressBars = document.getElementsByClassName("progress-bar");
    
    for (let bar of allProgressBars) {
        //convert to minutes
        const startTime = parseInt(bar.getAttribute("aria-valuemin")) / 1000 / 60;
        const endTime = parseInt(bar.getAttribute("aria-valuemax")) / 1000 / 60;
        const currentTime = new Date().getTime() / 1000 / 60;
        console.log(currentTime);

        const timeGap = endTime - startTime;
        const barProgress = ((currentTime - startTime) / timeGap) * 100;
        bar.setAttribute("style", `width: ${barProgress.toString()}%`);
    }
}

setInterval(updateProgress, 1000);
