/* =========================================================
   TUNEORA — APP.JS
   Firebase Music + Real Audio Player
   ========================================================= */

import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const searchButton =
        document.getElementById("searchButton");

    const searchSection =
        document.getElementById("searchSection");

    const searchInput =
        document.getElementById("searchInput");

    const closeSearch =
        document.getElementById("closeSearch");

    const playerSongName =
        document.getElementById("playerSongName");

    const playerArtistName =
        document.getElementById("playerArtistName");

    const mainPlayButton =
        document.getElementById("mainPlayButton");

    const previousButton =
        document.getElementById("previousButton");

    const nextButton =
        document.getElementById("nextButton");

    const shuffleButton =
        document.getElementById("shuffleButton");

    const repeatButton =
        document.getElementById("repeatButton");

    const progressBar =
        document.getElementById("progressBar");

    const progressTrack =
        document.querySelector(".player-progress .progress-track");

    const currentTime =
        document.getElementById("currentTime");

    const totalTime =
        document.getElementById("totalTime");

    const volumeControl =
        document.getElementById("volumeControl");


    const musicGrid =
        document.querySelector(".music-grid");

    const songList =
        document.querySelector(".song-list");


    /* =====================================================
       STATE
       ===================================================== */

    let songs = [];

    let currentSongIndex = -1;

    let isShuffle = false;

    let isRepeat = false;

    let audio = new Audio();

    audio.volume = 0.8;


    /* =====================================================
       SEARCH
       ===================================================== */

    if (searchButton) {

        searchButton.addEventListener("click", () => {

            searchSection.classList.toggle("show");

            if (
                searchSection.classList.contains("show")
                &&
                searchInput
            ) {

                setTimeout(() => {
                    searchInput.focus();
                }, 100);

            }

        });

    }


    if (closeSearch) {

        closeSearch.addEventListener("click", () => {

            searchSection.classList.remove("show");

            if (searchInput) {
                searchInput.value = "";
            }

            resetSearchResults();

        });

    }


    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const cards =
                document.querySelectorAll(
                    ".music-card"
                );

            const rows =
                document.querySelectorAll(
                    ".song-row"
                );


            if (!query) {

                cards.forEach(card => {
                    card.style.display = "";
                });

                rows.forEach(row => {
                    row.style.display = "";
                });

                return;

            }


            cards.forEach(card => {

                const text =
                    card.textContent
                        .toLowerCase();

                card.style.display =
                    text.includes(query)
                        ? ""
                        : "none";

            });


            rows.forEach(row => {

                const text =
                    row.textContent
                        .toLowerCase();

                row.style.display =
                    text.includes(query)
                        ? ""
                        : "none";

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
       LOAD SONGS FROM FIREBASE
       ===================================================== */

    async function loadSongsFromFirebase() {

        try {

            if (musicGrid) {

                musicGrid.innerHTML = `
                    <p style="
                        color:#999;
                        padding:20px;
                        text-align:center;
                    ">
                        Loading music...
                    </p>
                `;

            }


            if (songList) {

                songList.innerHTML = "";

            }


            const snapshot =
                await getDocs(
                    collection(
                        db,
                        "songs"
                    )
                );


            songs = [];


            snapshot.forEach(doc => {

                const data =
                    doc.data();


                songs.push({

                    id:
                        doc.id,

                    title:
                        data.title || "Untitled Song",

                    artist:
                        data.artist || "Unknown Artist",

                    genre:
                        data.genre || "Other",

                    description:
                        data.description || "",

                    audioUrl:
                        data.audioUrl || "",

                    duration:
                        Number(data.duration || 0),

                    createdAt:
                        data.createdAt || null,

                    playCount:
                        Number(data.playCount || 0),

                    likeCount:
                        Number(data.likeCount || 0)

                });

            });


            /* newest first */

            songs.sort((a, b) => {

                const aTime =
                    a.createdAt?.seconds || 0;

                const bTime =
                    b.createdAt?.seconds || 0;

                return bTime - aTime;

            });


            renderSongs();


        } catch (error) {

            console.error(
                "Firebase songs error:",
                error
            );


            if (musicGrid) {

                musicGrid.innerHTML = `
                    <p style="
                        color:#ff7185;
                        padding:20px;
                        text-align:center;
                    ">
                        Unable to load songs.
                    </p>
                `;

            }

        }

    }


    /* =====================================================
       RENDER SONGS
       ===================================================== */

    function renderSongs() {

        if (!songs.length) {

            if (musicGrid) {

                musicGrid.innerHTML = `
                    <p style="
                        color:#999;
                        padding:20px;
                    ">
                        No songs uploaded yet.
                    </p>
                `;

            }


            if (songList) {

                songList.innerHTML = `
                    <p style="
                        color:#999;
                        padding:20px;
                    ">
                        No music available yet.
                    </p>
                `;

            }

            return;

        }


        /* =================================================
           TRENDING MUSIC
           ================================================= */

        if (musicGrid) {

            musicGrid.innerHTML = "";


            const trendingSongs =
                songs.slice(0, 8);


            trendingSongs.forEach(
                (song, index) => {

                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "music-card";


                    const cover =
                        document.createElement(
                            "div"
                        );


                    cover.className =
                        `cover-art cover-${(index % 7) + 1}`;


                    cover.innerHTML = `

                        <span class="cover-symbol">
                            ♪
                        </span>

                        <button
                            class="play-card-button"
                            aria-label="Play ${escapeHTML(song.title)}"
                        >
                            ▶
                        </button>

                    `;


                    const info =
                        document.createElement(
                            "div"
                        );


                    info.className =
                        "music-info";


                    info.innerHTML = `

                        <h3>
                            ${escapeHTML(song.title)}
                        </h3>

                        <p>
                            ${escapeHTML(song.artist)}
                        </p>

                        <div class="song-meta">

                            <span>
                                ${escapeHTML(song.genre)}
                            </span>

                            <span>
                                ${formatTime(song.duration)}
                            </span>

                        </div>

                    `;


                    card.appendChild(
                        cover
                    );

                    card.appendChild(
                        info
                    );


                    cover
                        .querySelector(
                            ".play-card-button"
                        )
                        .addEventListener(
                            "click",
                            () => {

                                const realIndex =
                                    songs.findIndex(
                                        item =>
                                            item.id ===
                                            song.id
                                    );

                                loadSong(
                                    realIndex,
                                    true
                                );

                            }
                        );


                    musicGrid.appendChild(
                        card
                    );

                }
            );

        }


        /* =================================================
           RECENTLY ADDED
           ================================================= */

        if (songList) {

            songList.innerHTML = "";


            songs
                .slice(0, 10)
                .forEach(
                    (song, index) => {

                        const row =
                            document.createElement(
                                "article"
                            );


                        row.className =
                            "song-row";


                        row.innerHTML = `

                            <div class="
                                small-cover
                                cover-${(index % 7) + 1}
                            ">
                                ♪
                            </div>


                            <div class="row-song-info">

                                <h3>
                                    ${escapeHTML(song.title)}
                                </h3>

                                <p>
                                    ${escapeHTML(song.artist)}
                                </p>

                            </div>


                            <span class="row-genre">
                                ${escapeHTML(song.genre)}
                            </span>


                            <span class="row-duration">
                                ${formatTime(song.duration)}
                            </span>


                            <button
                                class="row-play"
                                aria-label="Play ${escapeHTML(song.title)}"
                            >
                                ▶
                            </button>

                        `;


                        row
                            .querySelector(
                                ".row-play"
                            )
                            .addEventListener(
                                "click",
                                () => {

                                    const realIndex =
                                        songs.findIndex(
                                            item =>
                                                item.id ===
                                                song.id
                                        );

                                    loadSong(
                                        realIndex,
                                        true
                                    );

                                }
                            );


                        songList.appendChild(
                            row
                        );

                    }
                );

        }

    }


    /* =====================================================
       LOAD SONG INTO PLAYER
       ===================================================== */

    function loadSong(
        index,
        autoPlay = false
    ) {

        if (
            index < 0 ||
            index >= songs.length
        ) {

            return;

        }


        const song =
            songs[index];


        if (!song.audioUrl) {

            console.error(
                "Song has no audio URL:",
                song
            );

            return;

        }


        currentSongIndex =
            index;


        audio.pause();


        audio.src =
            song.audioUrl;


        audio.currentTime =
            0;


        playerSongName.textContent =
            song.title;


        playerArtistName.textContent =
            song.artist;


        totalTime.textContent =
            formatTime(
                song.duration
            );


        currentTime.textContent =
            "0:00";


        progressBar.style.width =
            "0%";


        mainPlayButton.textContent =
            "▶";


        if (autoPlay) {

            playSong();

        }

    }


    /* =====================================================
       PLAY
       ===================================================== */

    async function playSong() {

        if (
            currentSongIndex === -1
        ) {

            if (!songs.length) {
                return;
            }

            loadSong(
                0,
                false
            );

        }


        try {

            await audio.play();

            mainPlayButton.textContent =
                "❚❚";

        } catch (error) {

            console.error(
                "Audio play error:",
                error
            );

        }

    }


    /* =====================================================
       PAUSE
       ===================================================== */

    function pauseSong() {

        audio.pause();

        mainPlayButton.textContent =
            "▶";

    }


    /* =====================================================
       MAIN PLAY BUTTON
       ===================================================== */

    if (mainPlayButton) {

        mainPlayButton.addEventListener(
            "click",
            () => {

                if (
                    audio.paused
                ) {

                    playSong();

                } else {

                    pauseSong();

                }

            }
        );

    }


    /* =====================================================
       AUDIO EVENTS
       ===================================================== */

    audio.addEventListener(
        "timeupdate",
        () => {

            if (
                !audio.duration ||
                !isFinite(audio.duration)
            ) {

                return;

            }


            const percentage =
                (
                    audio.currentTime /
                    audio.duration
                ) * 100;


            progressBar.style.width =
                `${percentage}%`;


            currentTime.textContent =
                formatTime(
                    audio.currentTime
                );


            totalTime.textContent =
                formatTime(
                    audio.duration
                );

        }
    );


    audio.addEventListener(
        "loadedmetadata",
        () => {

            totalTime.textContent =
                formatTime(
                    audio.duration
                );

        }
    );


    audio.addEventListener(
        "play",
        () => {

            mainPlayButton.textContent =
                "❚❚";

        }
    );


    audio.addEventListener(
        "pause",
        () => {

            mainPlayButton.textContent =
                "▶";

        }
    );


    audio.addEventListener(
        "ended",
        () => {

            if (isRepeat) {

                audio.currentTime =
                    0;

                playSong();

                return;

            }


            playNextSong();

        }
    );


    /* =====================================================
       NEXT
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                playNextSong();

            }
        );

    }


    function playNextSong() {

        if (!songs.length) {
            return;
        }


        let nextIndex;


        if (isShuffle) {

            nextIndex =
                Math.floor(
                    Math.random() *
                    songs.length
                );

        } else {

            nextIndex =
                currentSongIndex + 1;


            if (
                nextIndex >=
                songs.length
            ) {

                nextIndex = 0;

            }

        }


        loadSong(
            nextIndex,
            true
        );

    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                playPreviousSong();

            }
        );

    }


    function playPreviousSong() {

        if (!songs.length) {
            return;
        }


        let previousIndex =
            currentSongIndex - 1;


        if (
            previousIndex < 0
        ) {

            previousIndex =
                songs.length - 1;

        }


        loadSong(
            previousIndex,
            true
        );

    }


    /* =====================================================
       SHUFFLE
       ===================================================== */

    if (shuffleButton) {

        shuffleButton.addEventListener(
            "click",
            () => {

                isShuffle =
                    !isShuffle;


                shuffleButton.style.color =
                    isShuffle
                        ? "var(--primary-light)"
                        : "";

            }
        );

    }


    /* =====================================================
       REPEAT
       ===================================================== */

    if (repeatButton) {

        repeatButton.addEventListener(
            "click",
            () => {

                isRepeat =
                    !isRepeat;


                repeatButton.style.color =
                    isRepeat
                        ? "var(--primary-light)"
                        : "";

            }
        );

    }


    /* =====================================================
       PROGRESS BAR CLICK
       ===================================================== */

    if (progressTrack) {

        progressTrack.addEventListener(
            "click",
            event => {

                if (
                    !audio.duration ||
                    !isFinite(audio.duration)
                ) {

                    return;

                }


                const rect =
                    progressTrack
                        .getBoundingClientRect();


                const position =
                    event.clientX -
                    rect.left;


                const percentage =
                    position /
                    rect.width;


                audio.currentTime =
                    audio.duration *
                    percentage;

            }
        );

    }


    /* =====================================================
       VOLUME
       ===================================================== */

    if (volumeControl) {

        volumeControl.addEventListener(
            "input",
            () => {

                const value =
                    Number(
                        volumeControl.value
                    );


                audio.volume =
                    value / 100;


                const volumeIcon =
                    document.querySelector(
                        ".player-volume span"
                    );


                if (volumeIcon) {

                    if (value === 0) {

                        volumeIcon.textContent =
                            "🔇";

                    } else if (
                        value < 40
                    ) {

                        volumeIcon.textContent =
                            "🔈";

                    } else if (
                        value < 70
                    ) {

                        volumeIcon.textContent =
                            "🔉";

                    } else {

                        volumeIcon.textContent =
                            "🔊";

                    }

                }

            }
        );

    }


    /* =====================================================
       KEYBOARD CONTROLS
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            const tag =
                document.activeElement
                    ?.tagName
                    ?.toLowerCase();


            if (
                tag === "input" ||
                tag === "textarea" ||
                tag === "select"
            ) {

                return;

            }


            if (
                event.code ===
                "Space"
            ) {

                event.preventDefault();


                if (audio.paused) {

                    playSong();

                } else {

                    pauseSong();

                }

            }


            if (
                event.code ===
                "ArrowRight"
            ) {

                if (
                    audio.duration
                ) {

                    audio.currentTime =
                        Math.min(
                            audio.duration,
                            audio.currentTime + 5
                        );

                }

            }


            if (
                event.code ===
                "ArrowLeft"
            ) {

                if (
                    audio.duration
                ) {

                    audio.currentTime =
                        Math.max(
                            0,
                            audio.currentTime - 5
                        );

                }

            }

        }
    );


    /* =====================================================
       TIME FORMAT
       ===================================================== */

    function formatTime(seconds) {

        seconds =
            Number(seconds);


        if (
            !isFinite(seconds) ||
            seconds < 0
        ) {

            seconds = 0;

        }


        seconds =
            Math.floor(seconds);


        const minutes =
            Math.floor(
                seconds / 60
            );


        const remaining =
            seconds % 60;


        return (
            `${minutes}:` +
            String(
                remaining
            ).padStart(
                2,
                "0"
            )
        );

    }


    /* =====================================================
       HTML ESCAPE
       ===================================================== */

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value;


        return div.innerHTML;

    }


    /* =====================================================
       START
       ===================================================== */

    loadSongsFromFirebase();

});
