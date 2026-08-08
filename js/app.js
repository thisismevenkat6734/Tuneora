/* =========================================================
   TUNEORA — APP.JS
   Home page interactions
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const searchButton = document.getElementById("searchButton");
    const searchSection = document.getElementById("searchSection");
    const searchInput = document.getElementById("searchInput");
    const closeSearch = document.getElementById("closeSearch");

    const playerSongName = document.getElementById("playerSongName");
    const playerArtistName = document.getElementById("playerArtistName");
    const mainPlayButton = document.getElementById("mainPlayButton");

    const previousButton = document.getElementById("previousButton");
    const nextButton = document.getElementById("nextButton");
    const shuffleButton = document.getElementById("shuffleButton");
    const repeatButton = document.getElementById("repeatButton");

    const progressBar = document.getElementById("progressBar");
    const progressTrack = document.querySelector(".progress-track");

    const currentTime = document.getElementById("currentTime");
    const totalTime = document.getElementById("totalTime");

    const volumeControl = document.getElementById("volumeControl");


    /* =====================================================
       STATE
       ===================================================== */

    let currentSongIndex = -1;

    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;

    let currentProgress = 0;

    let fakeDuration = 220;

    let progressTimer = null;


    /* =====================================================
       DEMO SONG DATA
       ===================================================== */

    const songs = [
        {
            title: "Midnight Dreams",
            artist: "Aria Moon",
            duration: 222
        },
        {
            title: "Lost In The Vibe",
            artist: "Nova Beats",
            duration: 248
        },
        {
            title: "Ocean Lights",
            artist: "Leo Waves",
            duration: 235
        },
        {
            title: "After The Rain",
            artist: "Riya Sky",
            duration: 207
        },
        {
            title: "Falling Slowly",
            artist: "Daniel Ray",
            duration: 211
        },
        {
            title: "City Lights",
            artist: "Maya Rose",
            duration: 252
        },
        {
            title: "New Beginning",
            artist: "Skyline",
            duration: 301
        }
    ];


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchButton) {

        searchButton.addEventListener("click", () => {

            searchSection.classList.toggle("show");

            if (searchSection.classList.contains("show")) {

                setTimeout(() => {
                    searchInput.focus();
                }, 100);

            }

        });

    }


    if (closeSearch) {

        closeSearch.addEventListener("click", () => {

            searchSection.classList.remove("show");

            searchInput.value = "";

            resetSearchResults();

        });

    }


    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const query = searchInput.value
                .trim()
                .toLowerCase();

            const cards = document.querySelectorAll(".music-card");
            const rows = document.querySelectorAll(".song-row");

            if (!query) {

                cards.forEach(card => {
                    card.style.display = "";
                });

                rows.forEach(row => {
                    row.style.display = "";
                });

                return;
            }


            /* SEARCH MUSIC CARDS */

            cards.forEach(card => {

                const title =
                    card.querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";

                const artist =
                    card.querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";

                const matches =
                    title.includes(query) ||
                    artist.includes(query);

                card.style.display =
                    matches ? "" : "none";

            });


            /* SEARCH SONG ROWS */

            rows.forEach(row => {

                const title =
                    row.querySelector("h3")
                    ?.textContent
                    .toLowerCase() || "";

                const artist =
                    row.querySelector("p")
                    ?.textContent
                    .toLowerCase() || "";

                const matches =
                    title.includes(query) ||
                    artist.includes(query);

                row.style.display =
                    matches ? "" : "none";

            });

        });

    }


    function resetSearchResults() {

        document
            .querySelectorAll(".music-card")
            .forEach(card => {
                card.style.display = "";
            });

        document
            .querySelectorAll(".song-row")
            .forEach(row => {
                row.style.display = "";
            });

    }


    /* =====================================================
       LOAD SONG
       ===================================================== */

    function loadSong(index, autoPlay = false) {

        if (!songs[index]) {
            return;
        }

        currentSongIndex = index;

        const song = songs[index];

        playerSongName.textContent = song.title;
        playerArtistName.textContent = song.artist;

        fakeDuration = song.duration;

        currentProgress = 0;

        updateProgress();

        totalTime.textContent =
            formatTime(fakeDuration);

        mainPlayButton.textContent = "▶";

        isPlaying = false;

        stopProgressTimer();


        if (autoPlay) {
            playSong();
        }

    }


    /* =====================================================
       PLAY
       ===================================================== */

    function playSong() {

        if (currentSongIndex === -1) {

            loadSong(0, false);

        }

        isPlaying = true;

        mainPlayButton.textContent = "❚❚";

        startProgressTimer();

    }


    /* =====================================================
       PAUSE
       ===================================================== */

    function pauseSong() {

        isPlaying = false;

        mainPlayButton.textContent = "▶";

        stopProgressTimer();

    }


    /* =====================================================
       MAIN PLAY BUTTON
       ===================================================== */

    if (mainPlayButton) {

        mainPlayButton.addEventListener("click", () => {

            if (isPlaying) {

                pauseSong();

            } else {

                playSong();

            }

        });

    }


    /* =====================================================
       MUSIC CARD PLAY BUTTONS
       ===================================================== */

    const playButtons =
        document.querySelectorAll(
            ".play-card-button, .row-play"
        );


    playButtons.forEach(button => {

        button.addEventListener("click", () => {

            const songName =
                button.dataset.song;

            const index =
                songs.findIndex(
                    song =>
                        song.title === songName
                );

            if (index !== -1) {

                loadSong(index, true);

            }

        });

    });


    /* =====================================================
       NEXT
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener("click", () => {

            playNextSong();

        });

    }


    function playNextSong() {

        if (songs.length === 0) {
            return;
        }

        let nextIndex;

        if (isShuffle) {

            nextIndex =
                Math.floor(
                    Math.random() * songs.length
                );

        } else {

            nextIndex =
                currentSongIndex + 1;

            if (nextIndex >= songs.length) {

                nextIndex = 0;

            }

        }

        loadSong(nextIndex, true);

    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener("click", () => {

            playPreviousSong();

        });

    }


    function playPreviousSong() {

        if (songs.length === 0) {
            return;
        }

        let previousIndex =
            currentSongIndex - 1;

        if (previousIndex < 0) {

            previousIndex =
                songs.length - 1;

        }

        loadSong(previousIndex, true);

    }


    /* =====================================================
       SHUFFLE
       ===================================================== */

    if (shuffleButton) {

        shuffleButton.addEventListener("click", () => {

            isShuffle = !isShuffle;

            shuffleButton.style.color =
                isShuffle
                    ? "var(--primary-light)"
                    : "";

        });

    }


    /* =====================================================
       REPEAT
       ===================================================== */

    if (repeatButton) {

        repeatButton.addEventListener("click", () => {

            isRepeat = !isRepeat;

            repeatButton.style.color =
                isRepeat
                    ? "var(--primary-light)"
                    : "";

        });

    }


    /* =====================================================
       PROGRESS TIMER
       ===================================================== */

    function startProgressTimer() {

        stopProgressTimer();

        progressTimer =
            setInterval(() => {

                if (!isPlaying) {
                    return;
                }

                currentProgress += 1;

                if (currentProgress >= fakeDuration) {

                    if (isRepeat) {

                        currentProgress = 0;

                    } else {

                        playNextSong();

                        return;

                    }

                }

                updateProgress();

            }, 1000);

    }


    function stopProgressTimer() {

        if (progressTimer) {

            clearInterval(progressTimer);

            progressTimer = null;

        }

    }


    /* =====================================================
       UPDATE PROGRESS
       ===================================================== */

    function updateProgress() {

        const percentage =
            fakeDuration > 0
                ? (currentProgress / fakeDuration) * 100
                : 0;

        progressBar.style.width =
            `${percentage}%`;

        currentTime.textContent =
            formatTime(currentProgress);

    }


    /* =====================================================
       CLICK PROGRESS BAR
       ===================================================== */

    if (progressTrack) {

        progressTrack.addEventListener("click", event => {

            if (fakeDuration <= 0) {
                return;
            }

            const rect =
                progressTrack.getBoundingClientRect();

            const clickPosition =
                event.clientX - rect.left;

            const percentage =
                clickPosition / rect.width;

            currentProgress =
                Math.floor(
                    fakeDuration * percentage
                );

            updateProgress();

        });

    }


    /* =====================================================
       VOLUME
       ===================================================== */

    if (volumeControl) {

        volumeControl.addEventListener("input", () => {

            const value =
                Number(volumeControl.value);

            let icon = "🔊";

            if (value === 0) {
                icon = "🔇";
            } else if (value < 40) {
                icon = "🔈";
            } else if (value < 70) {
                icon = "🔉";
            }

            const volumeIcon =
                document.querySelector(
                    ".player-volume span"
                );

            if (volumeIcon) {
                volumeIcon.textContent = icon;
            }

        });

    }


    /* =====================================================
       TIME FORMAT
       ===================================================== */

    function formatTime(seconds) {

        seconds =
            Math.max(
                0,
                Math.floor(seconds)
            );

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${minutes}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

    }


    /* =====================================================
       KEYBOARD CONTROLS
       ===================================================== */

    document.addEventListener(
        "keydown",
