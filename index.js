// Import some packages
const { ipcRenderer } = require('electron');
const fs = require('fs');

// Some variables
const playbutton = document.getElementById('play-button');
const leftinfo = document.getElementById('left');
const rightinfo = document.getElementById('right');
const img = document.getElementById('img');
const music = document.getElementById('music');
const musicname = document.getElementById('music-name');
let source = false;
let play = false;

// When the user click on the play button
playbutton.addEventListener('click', () => {
    play = !play;
    // Plays music if source loaded and play is true
    if (play && source) {
        img.classList.add('playing');
        music.play();
        playbutton.setAttribute('src', './images/pause.png');
    } else {
        if(source){
            music.pause();   
        }
        img.classList.remove('playing');
        playbutton.setAttribute('src', './images/play.png');
    }
})

// Function to format the time
function formatTime(second){
    let min = Math.floor(second / 60);
    let sec = Math.floor(second % 60);
    if(sec < 10){
        sec = '0' + sec;
    }
    if(min < 10){
        min = '0' + min;
    }
    return min + ':' + sec;
}

// When the music is playing
function startPlaying(){
    const line = document.querySelector('.line');
    const linewidth = line.offsetWidth; // The width of the line
    const circle = document.querySelector('.circle');
    line.addEventListener('click', (e) => {
        let x = e.offsetX;
        let time = x / linewidth * music.duration;
        music.currentTime = time;
        circle.style.left = x + 'px';
    });
    setInterval(() => {
        let current = music.currentTime;
        const left = (current / music.duration) * linewidth;
        circle.style.left = left + 'px';
        if(current === music.duration){
            circle.style.left = '0px';
            img.classList.remove('playing');
            playbutton.setAttribute('src', './images/play.png');
            play = false;
            return;
        } else {
            leftinfo.innerHTML = formatTime(current);
        }
    },500)
}

// When file opened
ipcRenderer.on('open-file', (event, filepath) => {
    if(filepath !== undefined){
        source = true;
        let filename = filepath.split('/').pop();
        let musicName = filename.split('.')[0];
        musicname.innerHTML = musicName;
        music.src = filepath;
        music.addEventListener('loadedmetadata', () => {
            let duration = formatTime(music.duration);
            rightinfo.innerHTML = duration;
            startPlaying();
        })
    }
})