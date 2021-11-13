<script lang="ts">
    import { onMount } from 'svelte';
    import moment from 'moment-timezone';
    import fetchJsonp from 'fetch-jsonp';

    let randomMeeting: Meeting;
    let meetings: Meeting[];
    let seenMeetings: Meeting[] = [];
    let isLoading = false;
    let startMoment = moment();

    interface JsonMeeting {
        meeting_name: string;
        weekday_tinyint: string;
        start_time: string;
        time_zone: string;
        comments: string;
    }

    class Meeting {
        name: string;
        startTime: moment.Moment;
        link: string;

        constructor(jsonMeeting: JsonMeeting) {
            this.name = jsonMeeting.meeting_name;
            this.startTime = this.getAdjustedStartTime(jsonMeeting);
            this.link = jsonMeeting.comments;
        }

        private getAdjustedStartTime(jsonMeeting: JsonMeeting): moment.Moment {
            const adjustedDay = parseInt(jsonMeeting.weekday_tinyint) === 1 ? 7 : parseInt(jsonMeeting.weekday_tinyint) - 1;

            // Get an object that represents the meeting in its time zone
            let adjustedStartTime = moment()
                .tz(jsonMeeting.time_zone || 'UTC', true)
                .set({
                    hour: parseInt(jsonMeeting.start_time.split(':')[0]),
                    minute: parseInt(jsonMeeting.start_time.split(':')[1]),
                    second: 0
                })
                .isoWeekday(adjustedDay);

            // Convert meeting to target (local) time zone
            adjustedStartTime = adjustedStartTime.clone().tz(moment.tz.guess());

            const now = moment.tz(moment.tz.guess());
            if (now > adjustedStartTime) {
                adjustedStartTime.add(1, 'weeks');
            }

            return adjustedStartTime;
        }
    }

    onMount(() => {
        getMeetings();
    });

    function jsonMeetingsToMeetings(jsonMeetings: JsonMeeting[]): Meeting[] {
        const meetings: Meeting[] = [];
        if (jsonMeetings) {
            for (const jsonMeeting of jsonMeetings) {
                meetings.push(new Meeting(jsonMeeting));
            }
        }
        return meetings;
    }

    function getEligibleMeetings(allMeetings: Meeting[]): Meeting[] {
        const minMeetings = allMeetings.length < 3 ? allMeetings.length : 3;
        const meetings = [];
        let numMinutes = 30;
        while (allMeetings.length > meetings.length) {
            for (const meeting of allMeetings.filter((m) => !meetings.includes(m))) {
                const now = moment.tz(moment.tz.guess());
                const minutesUntilStart = meeting.startTime.diff(now, 'minutes');
                if (minutesUntilStart >= -10 && minutesUntilStart <= numMinutes) {
                    meetings.push(meeting);
                    if (meetings.length >= minMeetings && numMinutes > 30) {
                        // We finally hit our minMeetings
                        break;
                    }
                }
            }

            if (meetings.length >= minMeetings || numMinutes > 1440) {
                // We have hit the minMeetings or we're looking more than a day out
                break;
            }

            numMinutes += 15;
        }
        return meetings;
    }

    async function getMeetings(): Promise<void> {
        isLoading = true;
        try {
            const url = 'https://bmlt.virtual-na.org/main_server/client_interface/jsonp/?switcher=GetSearchResults&data_field_key=weekday_tinyint,start_time,time_zone,meeting_name,comments';
            const response = await fetchJsonp(url);
            const jsonMeetings = (await response.json()) as JsonMeeting[];
            const allMeetings = jsonMeetingsToMeetings(jsonMeetings);
            meetings = getEligibleMeetings(allMeetings);
            seenMeetings = [];
            setRandomMeeting();
            isLoading = false;
        } catch (error) {
            console.log('parsing failed', error);
        }
    }

    function setRandomMeeting(): void {
        if (moment().diff(startMoment, 'seconds') > 900) {
            getMeetings();
            startMoment = moment();
            return;
        }

        if (seenMeetings.length == meetings.length) {
            if (seenMeetings.length > 1) {
                // Don't show the last seen meeting again
                seenMeetings = [seenMeetings.pop()];
            } else {
                seenMeetings = [];
            }
        }

        const availableMeetings = meetings.filter((m) => !seenMeetings.includes(m));
        randomMeeting = availableMeetings[Math.floor(Math.random() * availableMeetings.length)];
        seenMeetings.push(randomMeeting);
    }
</script>

<main>
    <button class="button is-fullwidth" class:is-loading={isLoading} disabled={isLoading} on:click={setRandomMeeting}>Get A Random Meeting</button>
    {#if randomMeeting}
        <br />
        <div class="box is-shadowless has-text-centered m-0">
            <p class="title is-6">
                <b>{randomMeeting.name}</b>
                <br />
                {randomMeeting.startTime.toString()}
                <br />
                <a href={randomMeeting.link}>{randomMeeting.link}</a>
            </p>
        </div>
    {/if}
</main>

<style>
    .button:focus,
    .button {
        border-color: #8c9b9d;
        color: #ffffff;
        touch-action: manipulation;
    }
</style>
