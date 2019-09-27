function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

class GameState {
    constructor(props) {
        this.boardConfiguration = props.boardConfiguration || {}
        this.snake = props.snake
        this.fruits = props.fruits
        this.walls = props.walls
        this.fruitTypes = props.fruitTypes
        this.tick = 0
        this.board = []
        this.tickTimer = props.tickTimer
        this.backupTick = this.tickTimer
        this.direction = 'Right'
        this.score = 0
        this.gameRunning = true
        this.initializeBoard()
    }
    isOver() {
        return !this.gameRunning
    }
    endGame() {
        this.gameRunning = false
        this.reRender()
    }
    initializeBoard() {
        let snakeLength = this.snake.length
        this.board = Array.apply(null, { length: this.getHeight() * this.getWidth() })
        this.snake.currentPosition = []
        for (let i = 0; i < snakeLength; i++) {
            this.snake.currentPosition.push({
                y: this.snake.pos[0],
                x: this.snake.pos[1] + i,
            })
        }
        this.updateBoard()
        this.initializeEvents()
        this.initializeTimer()
    }
    initializeEvents() {
        window.addEventListener('keydown', (e) => {
            this.isKeyDown = true
            this.direction = e.key.replace('Arrow', '')
        })
        window.addEventListener('keyup',() => {
            this.isKeyDown = false
        })
    }
    getScore() {
        return this.score;
    }
    handleTimerForKeyPress(){
        if(this.isKeyDown) {
            if (this.tickTimer > 200) {
                this.tickTimer -= 200
                this.timerChanged = true
                this.initializeTimer()
            }
        } else {
            if(this.timerChanged) {
                this.tickTimer = this.backupTick
                this.initializeTimer()
                this.timerChanged = false
            }
        }

    }
    updateBoard() {
        this.handleTimerForKeyPress()
        let width = this.boardConfiguration.width
        let height = this.boardConfiguration.height
        this.snake.currentPosition.map((val, ind) => {
            if (ind == this.snake.currentPosition.length - 1) {
                this.board[val.y * height + val.x] = {
                    type: "snake head"
                }
            } else
                this.board[val.y * height + val.x] = {
                    type: "snake"
                }
        })
        this.fruits.map((val, ind) => {
            this.board[val.y * height + val.x] = {
                type: "fruit" + " " + val.type,
                value: val.value
            }
        })
        if (!this.walls) {
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    if (j === 0 || j === width - 1 || i === 0 || i === height - 1) {
                        this.board[i * height + j] = {
                            type: "wall",
                        }
                    }
                }
            }
        } else {
            this.walls.map(val => {
                this.board[val.y * height + val.x] = {
                    type: "wall"
                }
            })
        }

    }
    validateBorders(head) {
        if (head.y >= this.boardConfiguration.height || head.y < 0) {
            return false
        } else if (head.x >= this.boardConfiguration.width || head.x < 0) {
            return false
        }
        return true
    }
    setNewFruit() {
        let newX = Math.round(Math.random() * this.boardConfiguration.width - 1);
        let newY = Math.round(Math.random() * this.boardConfiguration.height - 1);
        if (this.board[newY * this.boardConfiguration.height + newX]) {
            this.setNewFruit.bind(this)()
        } else {
            const type = Math.round(getRandom(0, 2))
            this.fruits = [
                {
                    type: 'fruit' + ` ${this.fruitTypes[type].type}`,
                    x: newX,
                    y: newY,
                    value: this.fruitTypes[type].value
                }
            ]
        }
        if (this.tickTimer > 200) {
            this.tickTimer -= 200
        }
        this.initializeTimer()
    }
    move(newHead, hasFruit, fruitValue) {
        this.snake.currentPosition.push(newHead)
        if (!hasFruit) {
            const lastHead = this.snake.currentPosition.shift()
            this.board[lastHead.y * this.boardConfiguration.height + lastHead.x] = undefined;
        }
        if (hasFruit) {
            this.score += fruitValue
            this.setNewFruit()
        }
    }
    updateState() {
        const currentHead = this.snake.currentPosition[this.snake.currentPosition.length - 1]
        let newHead = {}, newRight;
        switch (this.direction) {
            case 'Right':
                newRight = currentHead.x + 1
                newHead = {
                    y: currentHead.y,
                    x: newRight
                }
                break
            case 'Left':
                newRight = currentHead.x - 1
                newHead = {
                    y: currentHead.y,
                    x: newRight
                }
                break
            case 'Up':
                const newUp = currentHead.y - 1
                newHead = {
                    y: newUp,
                    x: currentHead.x
                }
                break
            case 'Down':
                const newDown = currentHead.y + 1
                newHead = {
                    y: newDown,
                    x: currentHead.x
                }
        }

        const validBorders = this.validateBorders(newHead)
        if (!validBorders) {
            return this.endGame()
        }
        const elAtBoard = this.board[newHead.y * this.boardConfiguration.height + newHead.x] || {}
        const type = elAtBoard.type || ''
        let moveType
        if (elAtBoard.type) {
            if (type.startsWith('fruit')) {
                moveType = 2
                this.score += elAtBoard.value
            } else if (type == 'wall') {
                this.endGame()
            } else {
                moveType = 1
            }
        } else {
            moveType = 1
        }
        switch (moveType) {
            case 1:
                this.move(newHead)
                break
            case 2:
                this.move(newHead, true, elAtBoard.value)
                break
        }
        this.updateBoard()
    }
    initializeTimer() {
        if (this.timer) {
            window.clearInterval(this.timer)
        }
        this.timer = window.setInterval(() => {
            if (this.isOver()) {
                clearInterval(this.timer)
            }
            if (this.reRender) {
                this.updateState()
                this.reRender(() => ++this.tick)
            }
        }, this.tickTimer)
    }
    setRenderFunc(reRender) {
        this.reRender = reRender || function () { }
    }
    getGameState() {
        return this.board
    }
    getWidth() {
        return this.boardConfiguration.width
    }
    getHeight() {
        return this.boardConfiguration.height
    }
    getResolution() {
        return this.boardConfiguration.resolution
    }
    getTick() {
        return this.tick
    }

}

export default GameState