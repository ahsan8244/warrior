$(function () {
    $('#datetimepicker1').datetimepicker();
});

const titleInput = document.getElementById("titleInput");
const detailInput = document.getElementById("deetInput");
const datetimeInput = document.getElementById("datetimeInput");
const submitBtn = document.getElementById("submitBtn");

document.querySelector("form").addEventListener("submit", e => {
    const dueDate = datetimeInput.value.split(" ")[0];
    const [dueMonth, dueDay, dueYear] = dueDate.split("/");
    const dueTime12Hr = datetimeInput.value.substr(datetimeInput.value.indexOf(" ") + 1, datetimeInput.value.length);

    const addedAt = new this.Date().getTime();
    const dueTime = timeFormat24Hr(dueTime12Hr);
    console.log(dueTime);
    const dueTimeForTimer = `${dueTime.substr(0, 2)}:${dueTime.substr(2, 2)}:${dueTime.substr(4, 2)}`;
    console.log(dueTimeForTimer);
    const dueDateForTimer = `${dueMonth}/${dueDay}/${dueYear} ${dueTimeForTimer}`;
    console.log(dueDateForTimer);
    const dueTimeInMs = new Date(dueDateForTimer).getTime();

    const url = convertToCalendarUrl(titleInput.value, { date: dueDay, month: dueMonth, year: dueYear, fullTime: dueTime12Hr }, true);
    
    const data = {
        courseCode: titleInput.value,
        title: detailInput.value,
        addedAt,
        date: datetimeInput.value,
        dueTimeInMs,
        url,
        hasSubmitted: false
    }

    chrome.runtime.sendMessage(
        {
            method: "manualAdd",
            data
        }
    );
});

