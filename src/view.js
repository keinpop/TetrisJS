export default class View {
    static colors = {
        '1': '#4169e1', // cyan
        '2': '#0000cd', // blue
        '3': '#ff4500', //orange
        '4': '#FFFF00', //yellow
        '5': '#32CD32', //green
        '6': '#9400D3', // purple
        '7': '#ff0000' // red 
    };

    constructor(element, width, height, rows, columns) {
        this.element = element;
        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context  = this.canvas.getContext('2d');
        
        this.playfieldBorderWidth = 4;
        this.playfieldX = this.playfieldBorderWidth;
        this.playfieldY = this.playfieldBorderWidth;
        this.playfieldWidth = this.width * 2 / 3;
        this.playfieldHeight = this.height;
        this.playfieldInnerWidth = this.playfieldWidth - this.playfieldBorderWidth * 2;
        this.playfieldInnerHeight = this.playfieldHeight - this.playfieldBorderWidth * 2;

        this.blockWidth = this.playfieldInnerWidth / columns;
        this.blockHeight = this.playfieldInnerHeight / rows;

        this.panelX = this.playfieldWidth + 10;
        this.panelY = 0;
        this.panelWidth = this.width / 3;
        this.panelHeight = this.height;
        
        this.element.appendChild(this.canvas);

        this.stepHeightLines = 48;
    }
    
    renderMainScreen(state) {
        this.cleareScreen();
        this.renderPlayfield(state);
        this.renderPanel(state);
    }

    renderStartScreen() {
        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Start', this.width / 2, this.height / 2);
    }

    renderPauseScreen() {
        this.context.fillStyle = 'rgb(0,0,0,0.75)';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('Press ENTER to Resume', this.width / 2, this.height / 2);
    }

    renderEndScreen({ score }) {
        this.cleareScreen();

        this.context.fillStyle = 'white';
        this.context.font = '18px "Press Start 2P"';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText('GAME OVER', this.width / 2, this.height / 2 - this.stepHeightLines);
        this.context.fillText(`Score: ${score}`, this.width / 2, this.height / 2);
        this.context.fillText('Press ENTER to Restart', this.width / 2, this.height / 2 + this.stepHeightLines);
    }

    cleareScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }


    renderPlayfield({ playfield }) {
        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield.length; x++) {
                const block = playfield[y][x];

                if (block) {
                    this.renderBlock(
                        this.playfieldX + (x * this.blockWidth), 
                        this.playfieldY + (y * this.blockHeight), 
                        this.blockWidth, 
                        this.blockHeight, 
                        View.colors[block]
                        )
                }
            }
        }

        this.context.strokeStyle = 'rgba(71, 75, 79, 1)';
        this.context.lineWidth - this.playfieldWidth;
        this.context.strokeRect(0, 0, this.playfieldWidth, this.playfieldHeight);
        this.context.rect(this.playfieldWidth + this.playfieldBorderWidth - 2, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = 'rgb(112, 122, 128)';
        this.context.fill(); 
    }

    renderPanel({ level, score, lines, nextPiece }) {
        this.context.textAlign = 'start';
        this.context.textBaseline = 'top';
        this.context.fillStyle = 'white';
        this.context.font = '14px "Press Start 2P"';
        
        this.context.fillText(`Score: ${score}`, this.panelX, this.panelY + 0);
        this.context.fillText(`Lines: ${lines}`, this.panelX, this.panelY + 24);
        this.context.fillText(`Level: ${level}`, this.panelX, this.panelY + this.stepHeightLines);
        this.context.fillText('Next:', this.panelX, this.panelY + 96);

        for (let y = 0; y < nextPiece.blocks.length; y++) {
            for (let x = 0; x < nextPiece.blocks[y].length; x++) {
                const block = nextPiece.blocks[y][x];

                if (block) {
                    this.renderBlock(
                        this.panelX - 1 + (x * this.blockWidth * 0.5),
                        this.panelY + 100 + (y * this.blockHeight * 0.5),
                        this.blockWidth * 0.5,
                        this.blockHeight * 0.5,
                        View.colors[block]
                    );
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = this.darker(color);
        this.context.lineWidth = 5;

        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height);
    }

    darker(color, amount = 40) {
        let rHex = color.slice(1, 3);
        let gHex = color.slice(3, 5);
        let bHex = color.slice(5, 7);
      
        let r = parseInt(rHex, 16);
        let g = parseInt(gHex, 16);
        let b = parseInt(bHex, 16);

        let rStep = r / 100;
        let gStep = g / 100;
        let bStep = b / 100;
      
        r = Math.round(r - rStep * amount);
        g = Math.round(g - gStep * amount);
        b = Math.round(b - bStep * amount);
      
        rHex = r.toString(16).padStart(2, '0');
        gHex = g.toString(16).padStart(2, '0');
        bHex = b.toString(16).padStart(2, '0');
      
        let result = "#" + rHex + gHex + bHex;

        return result
    }
}