import "./style.css";

const canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  cw = canvas.width,
  ch = canvas.height;


const R = cw / 2
const root = document.querySelector(":root");

const images = Array.from(document.querySelectorAll("img"))
let currentImage = 0


let minuteProgress = 0

function drawMinute(progress) {
  const angle = progress * 2 * Math.PI
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  ctx.beginPath();
  ctx.moveTo(cw / 2, ch / 2);
  ctx.lineTo(cw / 2 + Math.cos(angle) * R, ch / 2 + Math.sin(angle) * R);
  ctx.stroke();
}
const drawProgessImage = (start, progress) => {
  ctx.beginPath();
  ctx.arc(cw / 2, ch / 2, R, start * Math.PI * 2, (start + progress) * Math.PI * 2, false);
  ctx.stroke();
};

let lastTime = 0
const raf = (t) => {
  ctx.clearRect(0, 0, cw, ch)
  // in milliseconds, roughly 16
  const delta = t - lastTime
  lastTime = t

  minuteProgress += (delta / 5000) % 1


  currentImage = Math.floor(images.length * minuteProgress) 
  console.log(currentImage);
  const currentImageProgress = minuteProgress - currentImage / images.length

  drawProgessImage(currentImage / images.length, currentImageProgress)

  drawMinute(minuteProgress)

  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)
