new Vue({
  el: "#app",
  data: {
    gridWidth: 40,
    gridHeight: 20,
    snakeMatrix: [],
    speed: 250,
    nextDirection: "right",
    snakeTargets: [],
    eatenTargets: [],
    points: 0,
    timeout: null,
    playing: false,
  },
  computed: {
    gridMatrix() {
      const grid = [];

      // rows
      for (let i = 0; i < this.gridHeight; i++) {
        const row = [];

        // cells
        for (let j = 0; j < this.gridWidth; j++) {
          row.push(j);
        }

        grid.push(row);
      }

      return grid;
    },
  },
  methods: {
    moveSnake(isFromTimeout) {
      // console.time("moveSnake");

      if (!isFromTimeout) {
        console.error("moveSnake() called from outside of timeout");
        return;
      }

      const lastCell = this.snakeMatrix[this.snakeMatrix.length - 1];
      const [y, x] = lastCell.split("-");

      // Based on the new direction i must decide
      // where the head of the snake should go
      let nextX; // = +x + 1 > this.gridWidth - 1 ? 0 : +x + 1;
      let nextY; // = +y + 1 > this.gridHeight - 1 ? 0 : +y + 1;

      switch (this.nextDirection) {
        case "right":
          nextX = +x + 1 > this.gridWidth - 1 ? 0 : +x + 1;
          nextY = +y;
          break;
        case "left":
          nextX = +x - 1 < 0 ? this.gridWidth - 1 : +x - 1;
          nextY = +y;
          break;
        case "up":
          nextX = +x;
          nextY = +y - 1 < 0 ? this.gridHeight - 1 : +y - 1;
          break;
        case "down":
          nextX = +x;
          nextY = +y + 1 > this.gridHeight - 1 ? 0 : +y + 1;
          break;
      }

      const newCell = `${nextY}-${nextX}`;

      this.snakeMatrix.push(newCell);

      if (this.snakeTargets.includes(newCell)) {
        this.onTargetCaught(newCell);
      } else {
        this.snakeMatrix.shift();
      }

      this.checkEatenTargets();

      // console.log(this.snakeMatrix[this.snakeMatrix.length - 1]);

      this.timeout = setTimeout(() => {
        // console.timeEnd("moveSnake");
        this.moveSnake(true);
      }, this.speed);
    },
    onTargetCaught(target) {
      const index = this.snakeTargets.indexOf(target);

      if (index > -1) {
        this.snakeTargets.splice(index, 1);
        this.eatenTargets.push(target);

        this.addRandomTargets();
        this.increaseSpeed();
        this.points++;
      }
    },
    checkEatenTargets() {
      this.eatenTargets.forEach((target) => {
        if (!this.snakeMatrix.includes(target)) {
          this.eatenTargets.splice(this.eatenTargets.indexOf(target), 1);
        }
      });
    },
    generateRandomTarget() {
      const randomY = Math.floor(Math.random() * this.gridHeight);
      const randomX = Math.floor(Math.random() * this.gridWidth);

      let toReturn = `${randomY}-${randomX}`;

      if (
        this.snakeTargets.includes(toReturn) ||
        this.snakeMatrix.includes(toReturn)
      ) {
        toReturn = this.generateRandomTarget();
      }

      return toReturn;
    },
    addTarget() {
      const target = this.generateRandomTarget();

      this.snakeTargets.push(target);
    },
    addRandomTargets(amount = 1) {
      for (let i = 0; i < Math.floor(Math.random() * amount) + 1; i++) {
        this.addTarget();
      }
    },
    increaseSpeed() {
      this.speed -= 2;
    },
    playOrPause() {
      if (!this.playing) {
        this.moveSnake(true);
        this.playing = true;
      } else {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
          this.playing = false;
        }
      }
    },
    reset() {
      clearTimeout(this.timeout);
      this.timeout = null;

      this.snakeMatrix = [
        Math.ceil(this.gridHeight / 2) + "-" + Math.ceil(this.gridWidth / 2),
      ];

      this.nextDirection = "right";
      this.eatenTargets = [];
      this.snakeTargets = [];
      this.playing = false
      this.speed = 250;
      this.points = 0;

      this.addRandomTargets(4);
    },
  },
  mounted() {
    this.reset();

    window.addEventListener("keydown", (e) => {
      if (this.playing && e.key.startsWith("Arrow")) {
        e.preventDefault();
      } else {
        return;
      }

      if (
        (this.nextDirection === "right" && e.key === "ArrowLeft") ||
        (this.nextDirection === "left" && e.key === "ArrowRight") ||
        (this.nextDirection === "up" && e.key === "ArrowDown") ||
        (this.nextDirection === "down" && e.key === "ArrowUp")
      ) {
        return;
      }

      switch (e.key) {
        case "ArrowUp":
          this.nextDirection = "up";
          break;
        case "ArrowDown":
          this.nextDirection = "down";
          break;
        case "ArrowLeft":
          this.nextDirection = "left";
          break;
        case "ArrowRight":
          this.nextDirection = "right";
          break;
      }
    });
  },
});
