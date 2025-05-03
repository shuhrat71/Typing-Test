let text = "";
let index = 0;
let startTime = null;
let intervalId = null;

const container = document.getElementById('container');
const timerDisplay = document.getElementById('timer');

async function fetchRandomText() {
  const res = await fetch('text.json');
  const texts = await res.json();
  text = texts[Math.floor(Math.random() * texts.length)];
  renderText();
}

function renderText() {
  container.innerHTML = '';
  index = 0;
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement('span');
    span.innerText = text[i];
    span.classList.add('char');
    if (i === 0) span.classList.add('current');
    container.appendChild(span);
  }
  resetTimer();
}

function resetTimer() {
  startTime = null;
  clearInterval(intervalId);
  timerDisplay.innerText = "⏱ 0s";
}

function startTimer() {
  startTime = Date.now();
  intervalId = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.innerText = `⏱ ${elapsed}s`;
  }, 1000);
}

document.addEventListener('keydown', (e) => {
  const spans = document.querySelectorAll('.char');

  // Backspace
  if (e.key === 'Backspace') {
    if (index > 0) {
      spans[index].classList.remove('current');
      index--;
      spans[index].classList.remove('correct', 'incorrect');
      spans[index].classList.add('current');
    }
    e.preventDefault();
    return;
  }

  // Skip other keys
  if (e.key.length !== 1 || index >= text.length) return;

  // Start timer on first input
  if (index === 0 && !startTime) {
    startTimer();
  }

  const expected = text[index];
  const pressed = e.key;

  if (pressed === expected) {
    spans[index].classList.add('correct');
  } else {
    spans[index].classList.add('incorrect');
  }

  spans[index].classList.remove('current');
  index++;

  if (index < text.length) {
    spans[index].classList.add('current');
  } else {
    clearInterval(intervalId);
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    alert(`✅ Tugadi! Siz ${totalSeconds} sekundda yozdingiz.`);
  }
});

fetchRandomText();
