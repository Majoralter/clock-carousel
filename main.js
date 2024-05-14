import "./style.css";
import ColorThief from "./node_modules/colorthief/dist/color-thief.mjs";
import tinycolor from "tinycolor2";

const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  cw = canvas.width,
  ch = canvas.height;

ctx.lineWidth = 30;
ctx.strokeStyle = "#FFFFFF";

let cx = cw / 2,
  cy = ch / 2,
  PI = Math.PI,
  a = 0,
  direction = 1,
  radius = cw / 2 - 60;

const secsHand = document.querySelector(".secs-hand"),
  minsHand = document.querySelector(".min-hand"),
  images = Array.from(document.querySelectorAll("#img")),
  colorThief = new ColorThief(),
  slideIndicator = document.querySelector(".slide-indicator");

const root = document.querySelector(":root");

let angle = 0,
  minAngle = 0,
  currentImageIndex = 0,
  hexCodesArray = [];

const roundNumber = (num) => {
  return Math.round(num * 10) / 10;
};

const getColors = async () => {
  for (let i = 0; i < images.length; i++) {
    if (images[i].complete) {
      hexCodesArray.push(colorThief.getColor(images[i]));
    } else {
      images[i].addEventListener("load", () => {
        hexCodesArray.push(colorThief.getColor(images[i]));
      });
    }
  }
};

const draw = (sa, ea) => {
  var counterclockwise = direction > 0 ? false : true;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, sa, ea, counterclockwise);
  ctx.stroke();
};

const carouselControls = async () => {
  let startAngle, endAngle;

  // if (a < 0 || a > PI * 2) {
  //   a = 0;
  //   direction *= -1;
  // }

  // Set mins hand rotation angle based on a complete revolution of the seconds hand
  if (angle === 0) {
    minAngle += 5;
    minsHand.style.transform = `rotate(${minAngle}deg)`;
    if (minAngle > 360) minAngle = 0;
  }

  // init important variables to control image transition time based on multiples of 45(deg)
  let roundedAngle, angleDecimal;

  // check if current angle is divisible by 45, should get 8 angles in total including 0deg
  if (angle % 45 < 1) {
    // call roundNumber function and pass the current angle to round it to one decimal place e.g 45.1, 45.2 etc...
    roundedAngle = roundNumber(angle);
    // get decimal value of roundedAngle so if roundedAngle is 45.1 this will calc will return range up to 0.2 max
    // max is 0.2 because of bug with angle 270deg
    angleDecimal = roundedAngle - Math.floor(roundedAngle);
  }

  // increment angle by o.1 every 10ms in setInterval below, rotate seconds hand by the value of angle in clockwise direction
  // change += to -= for anticlockwise movement but init angle to 360 instead of 0
  angle += 0.1;
  secsHand.style.transform = `rotate(${angle}deg)`;
  // reset angle to 0 if greater than 360 to accurately get multiples of 45 within 360deg
  if (angle > 360) angle = 0;

  // check if current angle is a multiple of 45 including 0, since multiple angles are returned angleDecimal returns the first
  // angle in the pile hence the angleDecimal < 0.19 check, because just the first angle has it's decimal place less than 0.19,
  // the value 0.19 is specific I know but there's a bug with 270deg and this is the best way to fix it for now, I don't think it
  // affects the code much. "Boo! it's 0.19" "arghh!" lol ;)
  if (angleDecimal < 0.19 && angle % 45 < 0.2) {
    ctx.clearRect(0, 0, cw, ch);
    startAngle = angle * (PI / 180) - 1.5 - 0.1;

    a += PI / 120;
    endAngle = startAngle + PI / 4;

    let bgColor = `rgb(${hexCodesArray[currentImageIndex][0]},${hexCodesArray[currentImageIndex][1]},${hexCodesArray[currentImageIndex][2]})`,
      color = tinycolor(bgColor);

    // the basic transition logic for the images pretty easy to understand
    // console.log(angle)
    for (let image of images) image.classList.remove("active");
    slideIndicator.textContent = `0${currentImageIndex + 1} / 0${
      images.length
    }`;

    document.body.style.backgroundColor = bgColor;

    if (color.isDark()) {
      root.style.setProperty("--color", "#f9f7f3");
    } else {
      root.style.setProperty("--color", "#676567");
    }

    images[currentImageIndex].classList.add("active");
    // increment and reset currentImageIndex
    currentImageIndex += 1;
    if (currentImageIndex === images.length) currentImageIndex = 0;

    ctx.strokeStyle = bgColor;
    draw(startAngle, endAngle);
  }

  requestAnimationFrame(carouselControls);

  // console.log(startAngle, endAngle, a);
};

requestAnimationFrame(carouselControls);

window.addEventListener("DOMContentLoaded", getColors);
