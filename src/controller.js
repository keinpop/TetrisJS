export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.backgroundSound = new Audio();
        this.backgroundSound.src = './src/sound_game.mp3';
        this.backgroundSound.loop = true;
        this.backgroundSound.volume = 0.6;
        this.pauseSound = new Audio();
        this.pauseSound.src = './src/sound_pause.mp3';
        this.pauseSound.volume = 0.4;
        this.loseSound = new Audio();
        this.loseSound.src = './src/sound_lose.wav';
        this.loseSound.loop = false;
        this.loseSound.volume = 0.6;
        this.loseSoundCount = 0;

        this.view.renderStartScreen();
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    play() {
        this.isPlaying = true;
        this.startTimer();
        this.updateView();
        this.backgroundSound.play();
    }

    pause() {
        this.isPlaying = false;
        this.stopTimer();
        this.updateView();
        this.backgroundSound.pause();
        this.pauseSound.play();
    }

    reset() {
        location.reload();
    }

    updateView() {
        const state = this.game.getState();
        const optimalNumberOfSound = 2;

        if (state.isGameOver) {
            this.view.renderEndScreen(state);
            this.backgroundSound.pause();
            if (this.loseSoundCount >= optimalNumberOfSound) {
                this.loseSound.pause();    
            } else {
                this.loseSound.play();
                this.loseSoundCount++;
            }
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen();
        } else {
            this.view.renderMainScreen(this.game.getState());
        }
    }

    startTimer() {
        const startingSpeed = 900;
        const boost = 100;
        const maxSpeed = 100;

        const speed = startingSpeed - this.game.getState().level * boost;

        if (!this.intervalId) {
            this.intervalId = setInterval(() => {
            this.update();
            }, speed > 0 ? speed : maxSpeed);
        }
    } 

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    handleKeyDown(event) {
        const state = this.game.getState();

        switch (event.key) {
            case 'Enter': case 'Escape':
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;
            case 'ArrowLeft': // левая стрелка
                if (this.isPlaying) {
                    this.game.movePieceLeft();
                    this.updateView();
                }
                break;
            case 'ArrowUp': // стрелка вверх
                if (this.isPlaying) {
                    this.game.rotatePiece();
                    this.updateView();
                }
                break;
            case 'ArrowRight': // правая стрелка)
                if (this.isPlaying) {
                    this.game.movePieceRight();
                    this.updateView();
                }
                break;
            case 'ArrowDown': // стрелка вниз
                if (this.isPlaying) {
                    this.stopTimer();
                    this.game.movePieceDown();
                    this.updateView();
                }
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'ArrowDown': // стрелка вниз
                if (this.isPlaying) {
                    this.startTimer();
                }
                break;
            }
    }
}