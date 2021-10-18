var meetings = [];

function getAdjustedDateTime(meeting_day, meeting_time, meeting_time_zone) {
    let adjustedMeetingDay = parseInt(meeting_day) === 1 ? 7 : parseInt(meeting_day) - 1
    let meeting_date_time_obj;

    if (!meeting_time_zone) {
        meeting_time_zone = "UTC";
    }

    // Get an object that represents the meeting in its time zone
    meeting_date_time_obj = moment.tz(meeting_time_zone).set({
        hour: meeting_time.split(":")[0],
        minute: meeting_time.split(":")[1],
        second: 0
    }).isoWeekday(adjustedMeetingDay);

    // Convert meeting to target (local) time zone
    meeting_date_time_obj = meeting_date_time_obj.clone().tz(moment.tz.guess());

    var now = moment.tz(moment.tz.guess())
    if (now > meeting_date_time_obj) {
        meeting_date_time_obj.add(1, 'weeks');
    }

    return meeting_date_time_obj;
}

function randomize() {
    results = [];
    var html = "<table border='1'>";

    for (let x in meetings) {
        let meeting_day = meetings[x]['weekday_tinyint'];
        let meeting_time = meetings[x]['start_time'];
        let meeting_time_zone = meetings[x]['time_zone'];
        let start = getAdjustedDateTime(meeting_day, meeting_time, meeting_time_zone);
        var now = moment.tz(moment.tz.guess())

        if (start.diff(now, 'minutes') >= 0 && start.diff(now, 'minutes') <= 30) {
            results.push({"name": meetings[x]['meeting_name'], "start": start, "link": meetings[x]['comments']})

            html += `<tr><td>${meetings[x]['meeting_name']}</td><td>${getAdjustedDateTime(meeting_day, meeting_time, meeting_time_zone)}</td><td>${meeting_day}</td><td>${meeting_time}</td><td>${meeting_time_zone}</td><td>${meetings[x]['comments']}</td></tr>`
        }
    }

    let meeting = results[Math.floor(Math.random() * results.length)];
    document.getElementById("result").innerHTML = `${meeting['name']}, ${meeting['start']}, <a target="_blank" href="${meeting['link']}">${meeting['link']}</a>`;

    html += "</table>";
    document.getElementById("allResults").innerHTML = html;
}

$.getJSON("https://bmlt.virtual-na.org/main_server/client_interface/jsonp/?switcher=GetSearchResults&data_field_key=weekday_tinyint,start_time,time_zone,meeting_name,comments&callback=?", function(data) {
    meetings = data;
    $("#random").removeAttr("disabled");
});
