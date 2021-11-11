<script lang="ts">
  import { onMount } from 'svelte';
  import moment from 'moment-timezone';
  import fetchJsonp from 'fetch-jsonp';

  let randomMeeting: Meeting;
  let meetings: Meeting[];
  let seenMeetings: Meeting[] = [];
  let isLoading = false;

  interface JsonMeeting {
    id_bigint: string;
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
    isLoading = true;
    fetchJsonp('https://bmlt.virtual-na.org/main_server/client_interface/jsonp/?switcher=GetSearchResults&data_field_key=id_bigint,weekday_tinyint,start_time,time_zone,meeting_name,comments')
      .then((response) => response.json() as Promise<JsonMeeting[]>)
      .then((jsonMeetings) => {
        let allMeetings: Meeting[] = [];

        if (jsonMeetings) {
          for (const jsonMeeting of jsonMeetings) {
            allMeetings.push(new Meeting(jsonMeeting));
          }
        }

        return allMeetings;
      })
      .then((allMeetings) => {
        meetings = [];

        if (!allMeetings) {
          return;
        }

        const minMeetings = allMeetings.length < 3 ? allMeetings.length : 3;
        let numMinutes = 30;
        while (true) {
          for (const meeting of allMeetings.filter((m) => !meetings.includes(m))) {
            const now = moment.tz(moment.tz.guess());
            const minutesUntilStart = meeting.startTime.diff(now, 'minutes');
            if (minutesUntilStart >= 0 && minutesUntilStart <= numMinutes) {
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
      })
      .then(() => setRandomMeeting())
      .then(() => (isLoading = false))
      .catch((ex) => console.log('parsing failed', ex));
  });

  function setRandomMeeting(): void {
    console.log('hi');
    console.log(seenMeetings.length);
    console.log(meetings.length);
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
    console.log(randomMeeting.name);
    console.log(randomMeeting.startTime.toString());
    console.log(randomMeeting.link);
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
