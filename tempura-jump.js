/*
 * TODO: add monsters
 */

//board
let board;
let context;
let menu = false;

//tempura
let tempuraRightImg;
let tempuraLeftImg;
let tempuraX = 40;
let tempuraY = 400;
let tempuraScale = 0.071;
let tempuraWidth = 985 * tempuraScale;
let tempuraHeight = 415 * tempuraScale;

let tempura = {
  img: null,
  x: tempuraX,
  y: tempuraY,
  width: tempuraWidth,
  height: tempuraHeight,
};

//physics
let velocityX = 0;
let velocityY = -13; //jump speed //set for start screen

//platforms
let platformArray = [];
let movingPlatformArray = [];
let platformScale = 1.7;
let platformWidth = 65;
let leftPlatformWidth = 33.93;
let rightPlatformWidth = 32.07;
let platformHeight = 10.07;
let platformImg;
let platformSpeed = 1;

//score
let score = 0;
let gameOver = false;
let homeReset = false;

// start screen
let playing = false;

//leaves
let leafArray = [];
let leafScale = 0.5;
let leafWidth = 36;
let leafHeight = 56;
let leafImg;

//sliders
let masterVolume = 1;
let musicVolume = 1;
let soundEffectVolume = 1;

let bgMusic;
let jumpSoundEffect;

//mode
let isDark = true;

window.onload = function () {
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //to draw on board

  board.style.backgroundSize = "360px 576px";
  board.style.backgroundImage = introBgImgSrc;

  //load audio
  bgMusic = new Audio();
  bgMusic.src = bgMusicSrc;
  jumpSoundEffect = new Audio();
  jumpSoundEffect.src = jumpSoundSrc;

  jumpSoundEffect.volume = 1;

  //load images
  context.imageSmoothingEnabled = true;

  tempuraRightImg = new Image();
  tempuraRightImg.src = tempuraLightRightImgSrc;
  tempura.img = tempuraRightImg;

  tempuraLeftImg = new Image();
  tempuraRightImg.src = tempuraLightLeftImgSrc;

  //platform starting params
  platformImg = new Image();
  platformImg.src = platformImgSrc;

  movingPlatformImg = new Image();
  movingPlatformImg.src = movingPlatformImgSrc;

  //set all sliders to 100%
  let sliderList = document.querySelectorAll(".slider");
  for (let i = 0; i < sliderList.length; i++) {
    sliderList[i].style.background = "#64ac87";
  }

  TweenLite.set("#leaf-container", { perspective: 600 });
  TweenLite.set("img", { xPercent: "-50%", yPercent: "-50%" });

  setTimeout(intro, 1000);
};

// intro
function intro() {
  // move skip intro button in
  document.getElementById("skip-intro").style.left = "67%";

  // leaf animation with green screen
  leafAnim();

  // name animation
  let letterList = document.querySelectorAll(".letters");
  for (let i = 0; i < letterList.length; i++) {
    setTimeout(function () {
      letterList[i].style.fontSize = "1em";
    }, 200 * i + 3500);
  }

  //move play button in
  setTimeout(function () {
    document.getElementById("intro-play").style.left = "-2%";
  }, 5000);
}

function leafAnim() {
  var total = 500;
  var container = document.getElementById("leaf-container"),
    w = 260,
    h = 476;

  for (i = 0; i < total; i++) {
    var Div = document.createElement("div");
    TweenLite.set(Div, {
      attr: { class: "leaf" },
      x: R(0, w),
      y: R(-200, -150),
      z: R(-200, 200),
    });
    container.appendChild(Div);
    animm(Div);
    if (i == 0) {
      document.getElementById("green-screen").style.top = "100%";
      document.getElementById("green-screen").style.height = "0px";
    }
  }

  function animm(elm) {
    TweenMax.to(elm, R(3, 5.5), {
      y: h + 200,
      ease: Linear.easeNone,
    });
    TweenMax.to(elm, R(1, 4), {
      x: "+=" + R(-100, 100),
      rotationZ: R(0, 180),
      yoyo: true,
      ease: Sine.easeInOut,
    });
  }

  function R(min, max) {
    return min + Math.random() * (max - min);
  }
}

function initialSetup() {
  toggle("intro", false);
  toggle("start", true);
  toggle("instructions", true);
  toggle("home", true);

  bgMusic.currentTime = 0;
  bgMusic.volume = 1;
  bgMusic.loop = true;

  board.style.backgroundImage = darkBgImgSrc;

  requestAnimationFrame(start);
}

//start screen
function start() {
  if (!playing && !menu) {
    displaySetup();

    tempuraSetup();

    platformSetup();
  }
}

function displaySetup() {
  if (isDark) {
    tempuraRightImg.src = tempuraLightRightImgSrc;
    tempuraLeftImg.src = tempuraLightLeftImgSrc;
    document.getElementById("how-to-png").src = lightHowToImgSrc;
  } else {
    tempuraRightImg.src = tempuraDarkRightImgSrc;
    tempuraLeftImg.src = tempuraDarkLeftImgSrc;
    document.getElementById("how-to-png").src = darkHowToImgSrc;
  }

  bgMusic.play();
  toggle("settings-wrapper", false);
  toggle("home", false);
  toggle("instructions", false);
  requestAnimationFrame(start);

  context.clearRect(0, 0, board.width, board.height);

  startWords();
}

function startWords() {
  context.font = "60px segoe";

  context.fillStyle = isDark ? "#face6d" : "#c96f21";
  context.fillText("Tempura", 30, 80);

  context.fillStyle = isDark ? "#e6d5ad" : "#76571f";
  context.fillText("Jump", 165, 150);

  context.font = "18px ink-free";
  context.fillText("credits", 25, 568);
  context.fillText("how to", 210, 568);
  context.fillText("settings", 287, 568);
}

function tempuraSetup() {
  //jump speed
  velocityY += gravity;
  tempura.y += velocityY;

  //draw
  tempuraScale = 1.7;
  context.drawImage(
    tempura.img,
    tempura.x,
    tempura.y,
    tempura.width * tempuraScale,
    tempura.height * tempuraScale
  );
}

function platformSetup() {
  //platform
  const platform = {
    img: platformImg,
    x: 45,
    y: 460,
    width: platformWidth,
    height: platformHeight,
  };

  platformScale = 1.7;
  context.drawImage(
    platformImg,
    platform.x,
    platform.y,
    platform.width * platformScale,
    platform.height * platformScale
  );

  if (tempura.height + tempura.y > platform.y - platform.height) {
    //detect collide w/ account for delay
    velocityY = -13; // jump off platform
    jumpSoundEffect.play();
  }
}

//cutscene from start to gameplay
function cutscene() {
  document.getElementById("sushi").style.top = "75%";
  document.getElementById("stuffing").style.top = "75.6%";

  //hide wrap
  const WRAP = document.getElementById("wrap");
  WRAP.style.top = "77%";
  WRAP.style.height = "0px";

  setTimeout(setup, 1000);
}

//setup gameplay
function setup() {
  game();
  reset();

  playing = true;

  //hide buttons
  toggle("start", false);
}

//gameplay
function game() {
  const HOME = document.getElementById("home");
  toggle("home", true);

  //tempura pos
  tempuraX = boardWidth / 2 - tempuraWidth / 2;
  tempuraY = (boardHeight * 7) / 8 - tempuraHeight;

  velocityY = -7.5;

  placePlatforms();
  requestAnimationFrame(update);
  document.addEventListener("keydown", moveTempura);
}

function update() {
  preCheck();

  context.clearRect(0, 0, board.width, board.height);

  tempuraUpdate();

  platformUpdate();

  scoreUpdate();
}

function preCheck() {
  if (homeReset) {
    return;
  }

  requestAnimationFrame(update);

  if (gameOver) {
    return;
  }
}

function tempuraUpdate() {
  //tempura
  tempura.x += velocityX;

  if (tempura.x - tempura.width > board.width) {
    tempura.x = 0 - tempura.width;
  } else if (tempura.x + tempura.width < 0) {
    tempura.x = board.width;
  }

  velocityY += gravity;
  tempura.y += velocityY;

  if (tempura.y - tempura.height > board.height) {
    gameOver = true;
  }

  context.drawImage(
    tempura.img,
    tempura.x,
    tempura.y,
    tempura.width,
    tempura.height
  );
}

function platformUpdate() {
  platformFunctions();

  movingPlatform();

  //delete old + add new platforms
  replacePlatforms();
}

function platformFunctions() {
  for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];

    if (tempura.y < boardHeight * 0.65) {
      platform.y -= -3; //slide platform down when jumping
      score += 1;
    }

    if (detectCollide(tempura, platform) && velocityY >= 0) {
      velocityY = -9; // jump off platform
      jumpSoundEffect.play();
    }

    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  }
}

function movingPlatform() {
  for (let i = 0; i < movingPlatformArray.length; i++) {
    let platform = movingPlatformArray[i];

    if (tempura.y < boardHeight * 0.65) {
      platform.y -= -3; //slide platform down when jumping
      score += 1;
    }

    if (detectCollide(tempura, platform) && velocityY >= 0) {
      velocityY = -9; // jump off platform
      jumpSoundEffect.play();
    }

    if (platform.x > boardWidth - 10 - platformWidth) {
      platformSpeed = -1;
    } else if (platform.x < 10) {
      platformSpeed = 1;
    }

    platform.x += platformSpeed;

    context.drawImage(
      platform.img,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );
  }

  limitPlatforms();
}

function limitPlatforms() {
  if (movingPlatformArray.length < 3) {
    if (movingPlatformArray.length > 0 && movingPlatformArray[0].y >= 576) {
      movingPlatformArray.shift(); //rem first elem
    }

    let random = Math.floor(Math.random() * 500);

    if (random == 0) {
      newPlatform(
        movingPlatformImg,
        movingPlatformArray,
        platformWidth,
        platformHeight
      );
    }
  }
}

function replacePlatforms() {
  while (platformArray.length > 0 && platformArray[0].y >= 576) {
    platformArray.shift(); //rem first elem

    newPlatform(platformImg, platformArray, platformWidth, platformHeight);
  }
}

function scoreUpdate() {
  context.fillStyle = isDark ? "#ffedcc" : "#362400";
  context.font = "20px ink-free";
  context.fillText("score: " + score, 15, 30);

  if (gameOver) {
    context.fillText(
      "Game Over: Press Space to Restart",
      boardWidth / 10,
      boardHeight / 2
    );
  }
}

function moveTempura(e) {
  if (playing) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
      //move right
      velocityX = 4;
      tempura.img = tempuraRightImg;
    } else if (e.code == "ArrowLeft" || e.code == "KeyA") {
      // move left
      velocityX = -4;
      tempura.img = tempuraLeftImg;
    } else if (e.code == "Space" && gameOver) {
      reset();
    }
  }
}

function reset() {
  tempura = {
    img: tempuraRightImg,
    x: tempuraX,
    y: tempuraY,
    width: tempuraWidth,
    height: tempuraHeight,
  };

  velocityX = 0;
  velocityY = initialVelocityY;

  score = 0;
  gameOver = false;
  homeReset = false;

  placePlatforms();
}

//starting platforms
function placePlatforms() {
  platformArray = [];
  movingPlatformArray = [];

  //create first platform in center
  const PLATFORM = {
    img: platformImg,
    x: boardWidth / 2 - platformWidth / 2,
    y: boardHeight - 50,
    width: platformWidth,
    height: platformHeight,
  };

  platformArray.push(PLATFORM);

  for (let i = 1; i < 7; i++) {
    const RAN_X = Math.floor(Math.random() * boardWidth * 0.75);

    const PLATFORM = {
      img: platformImg,
      x: RAN_X,
      y: boardHeight - i * 90 - 50,
      width: platformWidth,
      height: platformHeight,
    };

    platformArray.push(PLATFORM);
  }
}

function newPlatform(img, arr, width, height) {
  const RAN_X = Math.floor(Math.random() * boardWidth * 0.75);
  let RAN_Y = -height - Math.floor(Math.random() * boardWidth * 0.1);

  for (let i = 0; i < platformArray.length; i++) {
    while (
      platformArray[i].y < RAN_Y - height - 10 &&
      platformArray[i].y > RAN_Y + height + 10
    ) {
      RAN_Y = -height - Math.floor(Math.random() * boardWidth * 0.1);
    }
  }
  const PLATFORM = {
    img: img,
    x: RAN_X,
    y: RAN_Y,
    width: width,
    height: height,
  };

  arr.push(PLATFORM);
}

function detectCollide(a, b) {
  return (
    a.x < b.x + b.width && //a's left doesn't touch b's right
    a.x + a.width > b.x && //a's right passes b's left
    a.y < b.y + b.height && // a's top doesn't touch b's bottom
    a.y + a.height > b.y
  ); // a's bottom passes b's top
}

function goToCredits() {
  goToMenu();
  requestAnimationFrame(credits);
}

function credits() {
  if (menu) {
    requestAnimationFrame(credits);
    context.clearRect(0, 0, board.width, board.height);
    toggle("start", false);
    toggle("home", true);

    board.style.backgroundImage = isDark
      ? darkCrosshatchBgImgSrc
      : lightCrosshatchBgImgSrc;
    board.style.backgroundSize = "360px 576px";

    context.fillStyle = isDark ? "#e6d5ad" : "#76571f";
    context.font = "58px segoe";
    context.fillText("credits", 81, 100);

    context.fillStyle = isDark ? "#ffedcc" : "#362400";
    context.font = "24px fuzzy-bubbles";
    context.fillText("code & art", 27, 180);
    context.fillText("music", 27, 280);

    context.fillStyle = isDark ? "#ffedcc" : "#362400";
    context.font = "22px ink-free";
    context.fillText("Victoria Tsai", 35, 205);
    context.fillText("background music: moodmode", 35, 305);
    context.fillText("jump sound effect: Jofae", 35, 330);
  }
}

function goToHowTo() {
  goToMenu();
  requestAnimationFrame(howTo);
}

function howTo() {
  if (menu) {
    requestAnimationFrame(howTo);
    context.clearRect(0, 0, board.width, board.height);
    toggle("start", false);
    toggle("home", true);
    toggle("instructions", true);

    document.getElementById("instructions").style.color = isDark
      ? "#ffedcc"
      : "#362400";

    board.style.backgroundImage = isDark
      ? darkCrosshatchBgImgSrc
      : lightCrosshatchBgImgSrc;
    board.style.backgroundSize = "360px 576px";

    context.fillStyle = isDark ? "#e6d5ad" : "#76571f";
    context.font = "58px segoe";
    context.fillText("how to", 75, 100);
    context.fillText("play", 115, 163);
  }
}

function goToSettings() {
  goToMenu();
  requestAnimationFrame(settings);
}

function settings() {
  if (menu) {
    requestAnimationFrame(settings);
    context.clearRect(0, 0, board.width, board.height);
    toggle("start", false);
    toggle("home", true);
    toggle("settings-wrapper", true);

    board.style.backgroundImage = isDark
      ? darkCrosshatchBgImgSrc
      : lightCrosshatchBgImgSrc;
    board.style.backgroundSize = "360px 576px";

    context.fillStyle = isDark ? "#e6d5ad" : "#76571f";
    context.font = "58px segoe";
    context.fillText("settings", 70, 100);

    context.fillStyle = isDark ? "#ffedcc" : "#362400";
    context.font = "24px fuzzy-bubbles";
    context.fillText("master volume", 27, 180);

    context.fillText("music", 27, 270);

    context.fillText("sound effects", 27, 360);

    let valList = document.querySelectorAll(".val");
    for (let i = 0; i < valList.length; i++) {
      valList[i].style.color = isDark ? "#ffedcc" : "#362400";
    }
  }
}

function goToMenu() {
  menu = true;
  const HOME = document.getElementById("home");
}

function home() {
  const SUSHI = document.getElementById("sushi");
  SUSHI.style.top = "40.2%";

  const STUFFING = document.getElementById("stuffing");
  STUFFING.style.top = "41.1%";

  const WRAP = document.getElementById("wrap");
  WRAP.style.top = "41.1%";
  WRAP.style.height = "197.1px";

  tempura.x = 40;
  tempura.y = 400;
  tempura.img = tempuraRightImg;
  velocityY = -13;

  gameOver = true;
  playing = false;
  menu = false;
  homeReset = true;
  board.style.backgroundImage = isDark ? darkBgImgSrc : lightBgImgSrc;
  board.style.backgroundSize = "360px 576px";
  toggle("start", true);
  start();
}

function fVolLevel(s, val) {
  slider = document.querySelector(s);
  sliderVal = document.querySelector(val);

  tempSliderVal = slider.value;
  sliderVal.textContent = tempSliderVal;

  const progress = tempSliderVal;

  switch (s) {
    case "#m-vol":
      masterVolume = progress / 100;
      break;
    case "#bg-vol":
      musicVolume = progress / 100;
      break;
    case "#j-vol":
      soundEffectVolume = progress / 100;
      break;
  }

  bgMusic.volume = masterVolume * musicVolume;
  jumpSoundEffect.volume = masterVolume * soundEffectVolume;

  slider.style.background = `linear-gradient(to right, #64ac87 ${progress}%, #bfb39d ${progress}%)`;
}

function dark() {
  document.getElementById("darkImg").src = lightDarkImgSrc;
  document.getElementById("lightImg").src = lightLightImgSrc;
  isDark = true;
}

function light() {
  document.getElementById("darkImg").src = darkDarkImgSrc;
  document.getElementById("lightImg").src = darkLightImgSrc;
  isDark = false;
}

function toggle(id, tog) {
  const ELEM = document.getElementById(id);
  const DISPLAY = tog ? "block" : "none";
  ELEM.style.display = DISPLAY;
}
