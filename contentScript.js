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

            const submissionStatus = submissionStatusElement.children[1].innerHTML;
            const dueDate = dueDateElement.children[1].innerHTML;

            if (submissionStatus === "Submitted for grading") {
                chrome.runtime.sendMessage(
                    {
                        method: "completed",
                        data: {
                            title: heading
                        }
                    }
                );
            }else {
                chrome.runtime.sendMessage(
                    {
                        method: "add", 
                        data: {
                            title: heading,
                            date: dueDate
                        }
                    }
                );
            }
        }
    }
    catch (err) {
        console.log("not an assignment");
    }
}