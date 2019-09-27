window.onload = function() {
    try {
        const heading = document.getElementById("region-main")
            .getElementsByTagName("div")[0]
            .getElementsByTagName("h2")[0]
            .innerHTML;

        const statusTable = document.getElementsByClassName("generaltable")[0].children[0];

        if (statusTable) {
            const dueDateElement = statusTable.children[2];
            const dueDate = dueDateElement.children[1].innerHTML;
            console.log(dueDate);
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
    catch (err) {
        console.log("not an assignment");
    }
}