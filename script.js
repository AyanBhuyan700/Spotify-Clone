// var currFolder;
// let music;
async function getSongs(folder) {
    currFolder = folder;
    let response = await fetch(`http://127.0.0.1:5500/Songs/`);
    let text = await response.text();
    let div = document.createElement("div");
    div.innerHTML = text;
    let as = div.getElementsByTagName("a");
    let music = [];
    for (const element of as) {
        if (element.href.endsWith(".mp3")) {
            music.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    return music;
}

async function main() {
    let songs = await getSongs(`Songs`);
    let songUl = document.querySelector(".head ul");
    songUl.innerHTML = " ";
    songs.forEach((music, index) => {
        songUl.innerHTML += `
            <li>
                <img src="Svg/music.svg" alt="music">
                <div> ${music.replaceAll("%20", " ").replaceAll(".mp3" , " ")}</div>
                <div class="playNow">
                    <button class="play-btn" data-index="${index}">
                        <span id ="txt">Play</span>
                        <img src="Svg/circle-play.svg" alt="play">
                    </button>
                </div>
            </li>`;
    });


    function convertSeconds(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return "00:00";
        }
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = Math.floor(seconds % 60);

        let minutesFormatted = minutes.toString().padStart(2, '0');
        let secondsFormatted = remainingSeconds.toString().padStart(2, '0');
        return `${minutesFormatted}:${secondsFormatted}`;
    }

    const playButtons = document.querySelectorAll(".play-btn");
    var currentAudio = null;

    playButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const songIndex = e.currentTarget.getAttribute("data-index");
            const songUrl = songs[songIndex];

            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            // Play the selected song
            currentAudio = new Audio(`http://127.0.0.1:5500/Songs/${songUrl}`);
            currentAudio.addEventListener("loadeddata", () => {
                currentAudio.play();
                play.src = "pause.svg"
                document.querySelector(".songinfo").innerHTML = songUrl.replaceAll("%20", " ").replaceAll(".mp3" , " ");
                document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

                currentAudio.addEventListener("timeupdate", () => {
                    document.querySelector(".songtime").innerHTML = `${convertSeconds(currentAudio.currentTime)} : ${convertSeconds(currentAudio.duration)}`
                    document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";

                })
                let songbtn = document.querySelector(".songbutton")
                if (currentAudio.play()) {
                    songbtn.style.cursor = "pointer";
                }

            });

            play.addEventListener("click", () => {
                if (currentAudio.paused) {
                    currentAudio.play();
                    play.src = "pause.svg"
                }
                else {
                    currentAudio.pause()
                    play.src = "play.svg"
                }
            })
        });
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let persent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = persent + "%"
        currentAudio.currentTime = ((currentAudio.duration) * persent) / 100
    })

    document.querySelector(".bar").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    document.querySelector(".xmark").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    document.querySelector("#next").addEventListener("click", () => {
        let index = songs.findIndex(song => currentAudio.src.includes(song));

        if (index < songs.length - 1) {
            let nextSongUrl = songs[index + 1];

            currentAudio.pause();
            currentAudio.currentTime = 0;

            // Play the next song
            currentAudio = new Audio(`http://127.0.0.1:5500/Songs/${nextSongUrl}`);
            currentAudio.play();

            // Update UI
            document.querySelector(".songinfo").innerHTML = nextSongUrl.replaceAll("%20", " ");
            document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

            currentAudio.addEventListener("timeupdate", () => {
                document.querySelector(".songtime").innerHTML = `${convertSeconds(currentAudio.currentTime)} : ${convertSeconds(currentAudio.duration)}`;
                document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
            });
        }
    });

    document.querySelector("#previous").addEventListener("click", () => {
        let index = songs.findIndex(song => currentAudio.src.includes(song));

        if (index > 0) {
            let previousSongUrl = songs[index - 1];

            currentAudio.pause();
            currentAudio.currentTime = 0;

            // Play the previous song
            currentAudio = new Audio(`http://127.0.0.1:5500/Songs/${previousSongUrl}`);
            currentAudio.play();

            // Update UI
            document.querySelector(".songinfo").innerHTML = previousSongUrl.replaceAll("%20", " ");
            document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

            currentAudio.addEventListener("timeupdate", () => {
                document.querySelector(".songtime").innerHTML = `${convertSeconds(currentAudio.currentTime)} : ${convertSeconds(currentAudio.duration)}`;
                document.querySelector(".circle").style.left = (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
            });
        }
    });


}
main();

