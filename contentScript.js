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

            console.log("sending");

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