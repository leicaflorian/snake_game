const data = {
  gridWidth: 80,
  gridHeight: 80,
  snakeMatrix: ["4-4", "4-5", "4-6", "4-7"],
  speed: 100,
  nextDirection: "right",
};

function moveSnake(isFromTimeout) {
  console.time("moveSnake");

  if (!isFromTimeout) {
    console.error("moveSnake() called from outside of timeout");
    return;
  }

  const lastCell = data.snakeMatrix[data.snakeMatrix.length - 1];
  const [y, x] = lastCell.split("-");

  // Based on the new direction i must decide
  // where the head of the snake should go
  let nextX; // = +x + 1 > data.gridWidth - 1 ? 0 : +x + 1;
  let nextY; // = +y + 1 > data.gridHeight - 1 ? 0 : +y + 1;

  switch (data.nextDirection) {
    case "right":
      nextX = +x + 1 > data.gridWidth - 1 ? 0 : +x + 1;
      nextY = +y;
      break;
    case "left":
      nextX = +x - 1 < 0 ? data.gridWidth - 1 : +x - 1;
      nextY = +y;
      break;
    case "up":
      nextX = +x;
      nextY = +y - 1 < 0 ? data.gridHeight - 1 : +y - 1;
      break;
    case "down":
      nextX = +x;
      nextY = +y + 1 > data.gridHeight - 1 ? 0 : +y + 1;
      break;
  }

  data.snakeMatrix.push(`${nextY}-${nextX}`);
  data.snakeMatrix.shift();

  console.log(data.snakeMatrix[data.snakeMatrix.length - 1]);

  setTimeout(() => {
    console.timeEnd("moveSnake");
    moveSnake(true);
  }, data.speed);
}

window.addEventListener("keypressed", (e) => {
 /*  if (e.key.startsWith("Arrow")) {
    e.preventDefault();
  } else {
    return;
  } */
  const keyPressed = e.keyCode;
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  /*  switch (e.key) {
    case "ArrowUp":
      data.nextDirection = "up";
      break;
    case "ArrowDown":
      data.nextDirection = "down";
      break;
    case "ArrowLeft":
      data.nextDirection = "left";
      break;
    case "ArrowRight":
      data.nextDirection = "right";
      break;
  } */

  if (keyPressed === LEFT_KEY) {
    data.nextDirection = "left";
  }

  if (keyPressed === RIGHT_KEY) {
    data.nextDirection = "right";
  }

  if (keyPressed === UP_KEY) {
    data.nextDirection = "up";
  }

  if (keyPressed === DOWN_KEY) {
    data.nextDirection = "down";
  }
});

setInterval(() => {
  // moveSnake(true);
  console.log(data.snakeMatrix[data.snakeMatrix.length - 1]);
}, data.speed);
