window.onload = function() {
    try {
        const statusTable = document.getElementsByClassName("generaltable")[0].children[0];

        if (statusTable) {
            const dueDateElement = statusTable.children[2];
            const dueDate = dueDateElement.children[1].innerHTML;
            console.log(dueDate);
            chrome.runtime.sendMessage(
                {
                    method: "add", 
                    data: {
                        title: "test",
                        date: dueDate
                    }
                }
            );
        }
    }
    catch (err) {
        console.log(err);
        console.log("not an assignment");
    }
}