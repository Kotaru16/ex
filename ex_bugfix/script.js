
let players = [];

const nameInput   = document.getElementById("name-input");
const addForm     = document.getElementById("add-form");
const playersList = document.getElementById("players-list");
const countSpan   = document.getElementById("count");

addForm.addEventListener("click", (e) => {
  e.preventDefault();
  const name = nameInput.value;  //убрать пробелы

  if (name === "") return;       

  if (players.includes(name)) {
    alert("Такой участник уже есть!");
    return;
  }

  players.push(name);
  nameInput.value = "";
  renderPlayers();
});

function renderPlayers() {
  playersList.innerHTML = "";


  //обновление счетчика 
  players.forEach((name, i) => {
    const li = document.createElement("li");
    li.textContent = name;

    const btn = document.createElement("button");
    btn.textContent = "✕";

    btn.addEventListener("click", () => {
      players.splice(i); // удалять все элтменты от i,1
      renderPlayers();
    });

    li.append(btn);
    playersList.append(li);
  });


}

//  Таймер
let seconds = 30;
let timerInterval = null;

const timerDisplay = document.getElementById("timer-display");
const startBtn     = document.getElementById("start-btn");
const stopBtn      = document.getElementById("stop-btn");
const resetBtn     = document.getElementById("reset-btn");

function updateTimerDisplay() {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  //.padStart строки а добавляют числа
  timerDisplay.textContent = `${m.padStart(2, "0")}:${s.padStart(2, "0")}`;// при достижение нуля остановится 
}

startBtn.addEventListener("click", () => {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    //условие <=0
    seconds--;
    updateTimerDisplay();
  }, 1000);
});

stopBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerInterval = null;
  seconds = 30;
  updateTimerDisplay();
});

//Генерация команд
const teamSizeInput = document.getElementById("team-size");
const generateBtn   = document.getElementById("generate-btn");
const teamsOutput   = document.getElementById("teams-output");

generateBtn.addEventListener("click", () => {
  //поменять тип данных 
  const size = teamSizeInput.value; 

  if (players.length < size) {
    alert("Нужно больше участников!");
    return;
  }

  // перемешать коппию массива 
  const shuffled = players.sort(() => Math.random() - 0.5);  

  const teams = [];
  for (let i = 0; i < shuffled.length; i += size) {
    teams.push(shuffled.slice(i, i + size));
  }

  teamsOutput.innerHTML = "";
  teams.forEach((team, idx) => {
    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <h3>Команда ${idx + 1}</h3>
      <p>${team.join(", ")}</p>
    `;
    teamsOutput.append(card);
  });
});

// Инициализация
updateTimerDisplay();