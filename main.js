import "./style.css";

const secsHand = document.querySelector(".secs-hand"),
  minsHand = document.querySelector(".min-hand"),
  images = Array.from(document.querySelectorAll("#img"));

let angle = 0,
  minAngle = 0,
  currentImageIndex = 0;

const roundNumber = (num) => {
  return Math.round(num * 10) / 10;
};

const angleControls = () => {
  if (angle === 0) {
    minAngle += 5;
    minsHand.style.transform = `rotate(${minAngle}deg)`;
    if (minAngle > 360) minAngle = 0;
  }

  let roundedAngle, angleDecimal;

  if (angle % 45 < 1) {
    roundedAngle = roundNumber(angle);
    angleDecimal = roundedAngle - Math.floor(roundedAngle);
  }

  angle += 0.1;
  secsHand.style.transform = `rotate(${angle}deg)`;
  if (angle > 360) angle = 0;

  if (angleDecimal < 0.19 && angle % 45 < 1) {
    images.forEach((image) => image.classList.remove("active"));

    images[currentImageIndex].classList.add("active");

    currentImageIndex += 1;
    if (currentImageIndex > images.length - 1) currentImageIndex = 0;
  }
};

setInterval(angleControls, 10);
