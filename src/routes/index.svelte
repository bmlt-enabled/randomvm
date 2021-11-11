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
    </div>
    <div class="container">
        <div class="card p-5 mt-5 has-text-centered">
            <p>
                <a href="https://github.com/bmlt-enabled/randomvm/issues" target="_blank">Ideas?</a>
                &#8226; Meetings sourced from
                <a href="https://virtual-na.org/meetings" target="_blank">virtual-na.org</a>
            </p>
        </div>
    </div>
</section>
