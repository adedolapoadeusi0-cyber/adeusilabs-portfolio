function updateTime() {

    const options = {
        timeZone: "Africa/Lagos",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    };

    document.getElementById("current-time").textContent =
        new Date().toLocaleTimeString("en-NG", options);

}

updateTime();
setInterval(updateTime, 60000);