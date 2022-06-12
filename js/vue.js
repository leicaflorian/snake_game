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
      this.playing = false;
      this.speed = 250;
      this.points = 0;

      this.addRandomTargets(4);
    },

    decideSnakeMovement(direction) {
      if (
        (this.nextDirection === "right" && direction === "left") ||
        (this.nextDirection === "left" && direction === "right") ||
        (this.nextDirection === "up" && direction === "down") ||
        (this.nextDirection === "down" && direction === "up")
      ) {
        return;
      }

      this.nextDirection = direction;
    },
  },
  mounted() {
    this.reset();

    let touchStart = { x: 0, y: 0 };
    let touchEnd = { x: 0, y: 0 };

    this.$refs.gridContainer.addEventListener("touchstart", (e) => {
      e.preventDefault();
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    this.$refs.gridContainer.addEventListener("touchmove", (e) => {
      e.preventDefault();
      touchEnd = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });
    this.$refs.gridContainer.addEventListener("touchend", (e) => {
      const deltaX = touchEnd.x - touchStart.x;
      const deltaY = touchEnd.y - touchStart.y;
      let direction;

      // Check only the direction of the bigger delta
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (touchEnd.x > touchStart.x) {
          direction = "right";
        } else {
          direction = "left";
        }
      } else {
        if (touchEnd.y > touchStart.y) {
          direction = "down";
        } else {
          direction = "up";
        }
      }

      this.decideSnakeMovement(direction);
    });

    window.addEventListener("keydown", (e) => {
      if (this.playing && e.key.startsWith("Arrow")) {
        e.preventDefault();
      } else {
        return; 
      }
      let direction;

      switch (e.key) {
        case "ArrowUp":
          direction = "up";
          break;
        case "ArrowDown":
          direction = "down";
          break;
        case "ArrowLeft":
          direction = "left";
          break;
        case "ArrowRight":
          direction = "right";
          break;
      }

      this.decideSnakeMovement(direction);
    });
  },
});
