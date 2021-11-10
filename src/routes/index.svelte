<script>
  import RandomVm from '$lib/RandomVm.svelte';
</script>

<svelte:head>
  <title>Random Virtual Meeting</title>
  <script src="https://use.fontawesome.com/releases/v5.15.4/js/all.js" data-auto-a11y="true"></script>
</svelte:head>

<section class="section p-5">
  <div class="container">
    <div class="card p-5">
      <h4 class="title is-4 has-text-centered">Random Virtual Meeting</h4>
      <RandomVm />
    </div>
    <div class="empty" />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <a href="https://github.com/bmlt-enabled/randomvm/issues" target="_blank">Ideas?</a>
          &#8226; Meetings are sourced from
          <a href="https://virtual-na.org/meetings" target="_blank">https://virtual-na.org/meetings</a>
        </p>
      </div>
    </footer>
  </div>
</section>

<style>
  .empty {
    margin-bottom: 3rem;
  }
</style>
