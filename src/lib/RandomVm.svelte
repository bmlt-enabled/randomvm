<script lang="ts">
    import { onMount } from 'svelte';
    import moment from 'moment-timezone';
    import fetchJsonp from 'fetch-jsonp';

    let randomMeeting: Meeting | null;
    let meetings: Meeting[];
    let seenMeetings: Meeting[] = [];
    let isLoading = false;
    let startMoment = moment();
    let copied = false;

    interface JsonMeeting {
        meeting_name: string;
        weekday_tinyint: string;
        start_time: string;
        time_zone: string;
        virtual_meeting_link: string;
        virtual_meeting_additional_info: string;
    }

    class Meeting {
        name: string;
        startTime: moment.Moment;
        link: string;
        info: string;

        constructor(jsonMeeting: JsonMeeting) {
            this.name = jsonMeeting.meeting_name;
            this.startTime = this.getAdjustedStartTime(jsonMeeting);
            this.link = jsonMeeting.virtual_meeting_link;
            this.info = jsonMeeting.virtual_meeting_additional_info;
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

    function isValidUrl(link: string) {
        let url: URL;

        try {
            url = new URL(link);
        } catch (_) {
            return false;
        }

        return url.protocol === 'http:' || url.protocol === 'https:';
    }

    function getEligibleMeetings(allMeetings: Meeting[]): Meeting[] {
        const minMeetings = allMeetings.length < 3 ? allMeetings.length : 3;
        const meetings: Meeting[] = [];
        let numMinutes = 30;
        while (allMeetings.length > meetings.length) {
            for (const meeting of allMeetings.filter((m) => !meetings.includes(m))) {
                if (!isValidUrl(meeting.link)) {
                    continue;
                }
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
            const url =
                'https://bmlt.virtual-na.org/main_server/client_interface/jsonp/?switcher=GetSearchResults&data_field_key=weekday_tinyint,start_time,time_zone,meeting_name,virtual_meeting_additional_info,virtual_meeting_link';
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

        if (meetings.length) {
            if (seenMeetings.length == meetings.length) {
                if (seenMeetings.length > 1) {
                    // Don't show the last seen meeting again
                    const lastSeen = seenMeetings.pop();
                    if (lastSeen !== undefined) {
                        seenMeetings = [lastSeen];
                    } else {
                        seenMeetings = [];
                    }
                } else {
                    seenMeetings = [];
                }
            }
        } else {
            randomMeeting = null;
        }

        const availableMeetings = meetings.filter((m) => !seenMeetings.includes(m));
        randomMeeting = availableMeetings[Math.floor(Math.random() * availableMeetings.length)];
        seenMeetings.push(randomMeeting);
        copied = false;
    }

    function handleCopy(url: string): void {
        copied = true;
        navigator.clipboard.writeText(url);
    }
</script>

<section class="section p-5">
    <div class="container is-max-desktop">
        <div class="card p-5">
            <h4 class="title is-4 has-text-centered">Random Virtual Meeting</h4>
            <div class="block">
                <div class="block">
                    <button class="button is-fullwidth" class:is-loading={isLoading} disabled={isLoading} on:click={setRandomMeeting}>Get A Random Meeting</button>
                </div>
                <div class="columns is-centered">
                    <div class="column is-half">
                        <div class="content p-1">
                            {#if randomMeeting}
                                <h4>{randomMeeting.name}</h4>
                                <ul>
                                    <li>
                                        {randomMeeting.startTime.format('dddd')} at {randomMeeting.startTime.format('h:mma')}
                                    </li>
                                    <li class="meeting-link">
                                        <a href={randomMeeting.link} target="_blank">{randomMeeting.link}</a>
                                    </li>
                                    {#if randomMeeting.info}
                                        <li>{randomMeeting.info}</li>
                                    {/if}
                                </ul>
                            {:else if meetings !== undefined}
                                No meetings found for the next 24 hours.
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
            {#if randomMeeting}
                <div class="block has-text-centered">
                    <button class="button is-small copy-button" on:click={() => (randomMeeting ? handleCopy(randomMeeting.link) : undefined)}>
                        {#if copied}
                            <span class="icon is-small">
                                <i class="fas fa-copy" />
                            </span>
                        {:else}
                            <span class="icon is-small">
                                <i class="far fa-copy" />
                            </span>
                        {/if}
                        <span>Copy Link</span>
                    </button>
                </div>
            {/if}
            <div class="box is-shadowless p-3 m-0 has-text-centered">
                <a href="https://github.com/bmlt-enabled/randomvm/issues" target="_blank">Ideas?</a>
                &#8226; Data from
                <a href="https://virtual-na.org/meetings" target="_blank">virtual-na.org</a>
            </div>
        </div>
    </div>
</section>

<style>
    @media (prefers-color-scheme: dark) {
        .button:focus,
        .button {
            border-color: #8c9b9d;
            color: #ffffff;
            touch-action: manipulation;
        }
    }
    @media (prefers-color-scheme: light) {
        .button:focus,
        .button {
            border-color: #8c9b9d;
            color: #000000;
            touch-action: manipulation;
        }
    }
    .meeting-link {
        word-wrap: break-word;
    }
    .copy-button {
        border: none;
    }
</style>
