const MusicPlayer = {
    tracks: [
        "Aetheric - Rainbow (freetouse.com).mp3",
        "Aylex - Happy Moments (freetouse.com).mp3",
        "Bluewave - A Better Future (freetouse.com).mp3",
        "Calima - Sunday Drive (freetouse.com).mp3",
        "Dagored - Quiet Fields (freetouse.com).mp3",
        "Hazelwood - At Ease (freetouse.com).mp3",
        "Johny Grimes - Senseless (freetouse.com).mp3",
        "Luke Bergs - Aurora (freetouse.com).mp3",
        "Lukrembo - Cloud (freetouse.com).mp3",
        "Moavii - Sunset Dreams (freetouse.com).mp3",
        "Piki - Fancy Park (freetouse.com).mp3",
        "Pufino - Enjoy (freetouse.com).mp3",
        "Spiring - City Life (freetouse.com).mp3",
        "Zambolino - Beautiful Day (freetouse.com).mp3",
        "Zambolino - Slowburn (freetouse.com).mp3",
        "shandr - Drifting Away (freetouse.com).mp3"
    ],
    currentTrackIndex: 0,
    audioElement: null,
    isPlaying: false,

    init: function() {
        if (!this.audioElement) {
            this.audioElement = new Audio();
            this.audioElement.loop = false;
            this.audioElement.volume = 0.3;
            this.audioElement.addEventListener('ended', () => this.nextTrack());
            
            // Randomizza la prima traccia
            this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
            this.loadTrack(this.currentTrackIndex);
        }
    },

    loadTrack: function(index) {
        if (index < 0) index = this.tracks.length - 1;
        if (index >= this.tracks.length) index = 0;
        this.currentTrackIndex = index;
        this.audioElement.src = `assets/Musica/${this.tracks[this.currentTrackIndex]}`;
        this.updateUI();
    },

    togglePlay: function() {
        if (!this.audioElement) this.init();

        if (this.isPlaying) {
            this.audioElement.pause();
            this.isPlaying = false;
            this.updateUI();
        } else {
            this._doPlay();
        }
    },

    // Avvia la riproduzione (interno)
    _doPlay: function() {
        if (!this.audioElement) this.init();
        if (localStorage.getItem('palestra_audio_muted') === 'true') return;

        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateUI();
            }).catch(() => {
                // Autoplay bloccato dal browser — riprova al primo click (listener globale)
                this.isPlaying = false;
                this.updateUI();
            });
        } else {
            this.isPlaying = true;
            this.updateUI();
        }
    },

    nextTrack: function() {
        if (!this.audioElement) this.init();
        // Riproduzione casuale
        let nextIndex;
        do {
            nextIndex = Math.floor(Math.random() * this.tracks.length);
        } while (nextIndex === this.currentTrackIndex && this.tracks.length > 1);
        
        this.loadTrack(nextIndex);
        if (this.isPlaying) {
            this.audioElement.play().catch(() => {
                this.isPlaying = false;
                this.updateUI();
            });
        }
    },

    prevTrack: function() {
        // Shuffle mode -> same logic as nextTrack
        this.nextTrack();
    },

    updateUI: function() {
        const titleEl = document.getElementById('music-track-title');
        const playBtnEl = document.getElementById('music-play-btn');
        if (titleEl) {
            let title = this.tracks[this.currentTrackIndex].replace(" (freetouse.com).mp3", "");
            titleEl.textContent = title;
        }
        if (playBtnEl) {
            playBtnEl.innerHTML = this.isPlaying
                ? '⏸️'
                : '▶️';
        }
    }
};

window.MusicPlayer = MusicPlayer;

// Inizializza al caricamento DOM
document.addEventListener('DOMContentLoaded', () => {
    MusicPlayer.init();

    // Tenta autoplay immediato
    setTimeout(() => {
        MusicPlayer._doPlay();
    }, 800);
});

// Fallback: avvia al primo click/touch se ancora non in play
(function() {
    let _started = false;
    function startOnInteraction(e) {
        if (_started) return;
        
        if (e && e.target) {
            const isAudioBtn = e.target.closest('#music-play-btn');
            if (isAudioBtn) {
                _started = true;
                document.removeEventListener('click', startOnInteraction, true);
                document.removeEventListener('touchstart', startOnInteraction, true);
                document.removeEventListener('keydown', startOnInteraction, true);
                return;
            }
        }
        
        _started = true;
        document.removeEventListener('click', startOnInteraction, true);
        document.removeEventListener('touchstart', startOnInteraction, true);
        document.removeEventListener('keydown', startOnInteraction, true);
        setTimeout(() => {
            if (window.MusicPlayer && !window.MusicPlayer.isPlaying) {
                window.MusicPlayer._doPlay();
            }
        }, 300);
    }
    document.addEventListener('click', startOnInteraction, true);
    document.addEventListener('touchstart', startOnInteraction, true);
    document.addEventListener('keydown', startOnInteraction, true);
})();
