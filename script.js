function setDirection(currDir) {
  const currPosition = document.getElementsByClassName("rover")[0];
  currPosition.classList.remove("rotate0");
  currPosition.classList.remove("rotate90");
  currPosition.classList.remove("rotate180");
  currPosition.classList.remove("rotate270");
  // let currId = currPosition.id;
  // let x = currId.substr(0, 1);
  // let y = currId.substr(1, 1);

  if (currDir == 0) {
    currPosition.classList.add("rotate0");
  } else if (currDir == 1) {
    currPosition.classList.add("rotate90");
  } else if (currDir == 2) {
    currPosition.classList.add("rotate180");
  } else if (currDir == 3) {
    currPosition.classList.add("rotate270");
  }
}
function turn(turnDir, currDir) {
  if (turnDir == "R") currDir++;
  else currDir--;

  if (currDir == 4) currDir = 0;

  if (currDir == -1) currDir = 3;
  setDirection(currDir);
  return currDir;
}
function move(currDir) {
  const currPosition = document.getElementsByClassName("rover")[0];
  currPosition.classList.remove("rover");
  let currId = currPosition.id;
  let x = currId.substr(0, 1);
  let y = currId.substr(1, 1);
  if (currDir == 0) {
    y = +y + 1;
  } else if (currDir == 1) {
    x = +x + 1;
  } else if (currDir == 2) {
    y = +y - 1;
  } else if (currDir == 3) {
    x = +x - 1;
  }

  let newPosition = x + "" + y;
  if (
    x > 5 ||
    y > 5 ||
    x < 0 ||
    y < 0 ||
    collisionDetection(x + "" + y) ||
    (x == 5 && y == 5)
  ) {
    newPosition = getASuitableNewPosition();
    console.log(newPosition);
  }
  document.getElementById(newPosition).classList.add("rover");
  setDirection(currDir);

  //west  -y    +y east      3      1
  //south -x    +x north     2      0
}

function fetchData() {
  //Instead of hard coding we can fetch this data from WEB API in order to involve backend part in DOT NET
  window.commands = [
    "33E|DMMRMM",
    "11E|MMRMM",
    "43E|MMRMMM",
    "00N|MMRMM",
    "33E|MMRM",
    "11E|MMRMMR",
    "13E|MMRMMMRML",
    "00N|MMRMM",
    "43E|MMMLMR",
    "11E|MMRMMRMR",
    "23E|MMRRMR",
    "00N|MMMMRMR",
    "33E|MMR",
    "11E|MMMRMR",
    "53E|MMMMRMR",
    "00N|MMRMMR",
    "11E|MMRMMR",
    "13E|MMRMMMRML",
    "00N|MMRMM",
    "43E|MMMLMR",
    "11E|MMRMMRMR",
    "23E|MMRRMR",
    "00N|MMMMRMR",
    "33E|MMR",
    "11E|MMMRMR",
    "53E|MMMMRMR",
    "00N|MMRMMR",
  ];
  process();
}

function collisionDetection(nextId) {
  const nextPosition = document.getElementById(nextId);
  return nextPosition.classList.contains("stopped-rover");
}
function getASuitableNewPosition() {
  startingPositionX = 0;
  startingPositionY = 0;

  while (collisionDetection(startingPositionX + "" + startingPositionY)) {
    startingPositionX = Math.floor(Math.random() * 6);
    startingPositionY = Math.floor(Math.random() * 6);
  }

  console.log(
    "To Avoid Collision/To Keep Rover Within the Maze, Rover has been Relocated & New position is (" +
      startingPositionX +
      "," +
      startingPositionY +
      ")"
  );

  return startingPositionX + "" + startingPositionY;
}

function process() {
  if (window.commands.length > 0) {
    let dirs = ["N", "E", "S", "W"];

    window.currCommand = window.commands.shift();
    startingPositionX = window.currCommand[0];
    startingPositionY = window.currCommand[1];
    window.dirIndex = dirs.indexOf(window.currCommand[2]);
    window.currCommand = window.currCommand.substring(4);
    let nextPosition = startingPositionX + "" + startingPositionY;
    if (collisionDetection(nextPosition)) {
      nextPosition = getASuitableNewPosition();
    }

    let startingBoxElement = document.getElementById(nextPosition);
    startingBoxElement.classList.add("rover");

    setDirection(window.dirIndex);
    console.log(1);
    window.interval = setInterval(function () {
      nextAction();
    }, 500);
  }
}

function nextAction() {
  if (window.currCommand.length == 0) {
    const currPosition = document.getElementsByClassName("rover")[0];
    currPosition.classList.remove("rover");
    currPosition.classList.add("stopped-rover");

    clearInterval(window.interval);
    process();
  } else {
    command = window.currCommand[0];
    console.log("command: " + command);
    window.currCommand = window.currCommand.substring(1);
    if (command == "M") {
      move(window.dirIndex);
    } else if (command == "R" || command == "L") {
      window.dirIndex = turn(command, window.dirIndex);
    } else {
      console.log("INVALID COMMAND RECEIVED: " + command);
    }
  }
}
