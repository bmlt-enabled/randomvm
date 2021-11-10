<script>
  import { onMount } from 'svelte';
  import moment from 'moment-timezone';
  import fetchJsonp from 'fetch-jsonp';

  export let randomMeeting = null;
  export let meetingsResult = null;
  export let currentlyRefreshing = false;

  function getAdjustedDateTime(meeting_day, meeting_time, meeting_time_zone) {
    let adjustedMeetingDay = parseInt(meeting_day) === 1 ? 7 : parseInt(meeting_day) - 1;
    let meeting_date_time_obj;

    if (!meeting_time_zone) {
      meeting_time_zone = 'UTC';
    }

    // Get an object that represents the meeting in its time zone
    meeting_date_time_obj = moment()
      .tz(meeting_time_zone, true)
      .set({
        hour: meeting_time.split(':')[0],
        minute: meeting_time.split(':')[1],
        second: 0
      })
      .isoWeekday(adjustedMeetingDay);

    // Convert meeting to target (local) time zone
    meeting_date_time_obj = meeting_date_time_obj.clone().tz(moment.tz.guess());

    let now = moment.tz(moment.tz.guess());
    if (now > meeting_date_time_obj) {
      meeting_date_time_obj.add(1, 'weeks');
    }

    return meeting_date_time_obj;
  }

  onMount(() => {
    currentlyRefreshing = true;
    fetchJsonp('https://bmlt.virtual-na.org/main_server/client_interface/jsonp/?switcher=GetSearchResults&data_field_key=weekday_tinyint,start_time,time_zone,meeting_name,comments')
      .then((response) => response.json())
      .then((meetings) => {
        let results = [];
        if (meetings) {
          for (let x in meetings) {
            let meeting_day = meetings[x]['weekday_tinyint'];
            let meeting_time = meetings[x]['start_time'];
            let meeting_time_zone = meetings[x]['time_zone'];
            let start = getAdjustedDateTime(meeting_day, meeting_time, meeting_time_zone);
            let now = moment.tz(moment.tz.guess());
            if (start.diff(now, 'minutes') >= 0 && start.diff(now, 'minutes') <= 30) {
              results.push({ name: meetings[x]['meeting_name'], start: start.toString(), link: meetings[x]['comments'] });
            }
          }
        }
        meetingsResult = results;
        currentlyRefreshing = false;
      })
      .then(() => getRandomMeeting())
      .catch((ex) => console.log('parsing failed', ex));
  });

  function getRandomMeeting() {
    randomMeeting = meetingsResult[Math.floor(Math.random() * meetingsResult.length)];
  }
</script>

<main>
  <button class="button is-fullwidth" class:is-loading={currentlyRefreshing} disabled={currentlyRefreshing} on:click={getRandomMeeting}>Get A Random Meeting</button>
  {#if randomMeeting}
    <br />
    <div class="box is-shadowless has-text-centered m-0">
      <p class="title is-6">
        <b>{randomMeeting.name}</b> <br />
        {randomMeeting.start}<br />
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
  }
</style>
