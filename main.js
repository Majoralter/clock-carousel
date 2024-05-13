import "./style.css";
import ColorThief from "./node_modules/colorthief/dist/color-thief.mjs";

const secsHand = document.querySelector(".secs-hand"),
  minsHand = document.querySelector(".min-hand"),
  images = Array.from(document.querySelectorAll("#img")),
  app = document.getElementById("app"),
  colorThief = new ColorThief();

let angle = 0,
  minAngle = 0,
  currentImageIndex = 0,
  hexCodesArray = [];

const roundNumber = (num) => {
  return Math.round(num * 10) / 10;
};

const getColors = async () => {
  images.forEach((image) => {
    hexCodesArray.push(colorThief.getColor(image));
  });
};

const carouselControls = async () => {
  let angRad = 2 * Math.PI;

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
  angle += Math.cos(angRad) / 10;
  secsHand.style.transform = `rotate(${angle}deg)`;
  // reset angle to 0 if greater than 360 to accurately get multiples of 45 within 360deg
  if (angle > 360) angle = 0;

  // check if current angle is a multiple of 45 including 0, since multiple angles are returned angleDecimal returns the first
  // angle in the pile hence the angleDecimal < 0.19 check, because just the first angle has it's decimal place less than 0.19,
  // the value 0.19 is specific I know but there's a bug with 270deg and this is the best way to fix it for now, I don't think it
  // affects the code much. "Boo! it's 0.19" "arghh!" lol ;)
  if (angleDecimal < 0.19 && angle % 45 < 0.2) {
    // the basic transition logic for the images pretty easy to understand
    // console.log(angle)
    for (let image of images) image.classList.remove("active");

    app.style.backgroundColor = `rgb(${hexCodesArray[currentImageIndex][0]},${hexCodesArray[currentImageIndex][1]},${hexCodesArray[currentImageIndex][2]})`;

    images[currentImageIndex].classList.add("active");
    // increment and reset currentImageIndex
    currentImageIndex += 1;
    if (currentImageIndex === images.length) currentImageIndex = 0;
  }

  requestAnimationFrame(carouselControls);
};

requestAnimationFrame(carouselControls);

getColors();
