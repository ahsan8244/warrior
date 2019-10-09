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
            newEvent.innerHTML = dueCard(event.courseCode, event.title, event.date, event.url, event.addedAt, event.dueTimeInMs);
            dateList.appendChild(newEvent);
        });
    }
});

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
