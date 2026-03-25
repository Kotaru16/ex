const API = "/api";

const movieList  = document.getElementById("movie-list");
const movieForm  = document.getElementById("movie-form");
const movieTitle = document.getElementById("movie-title");
const movieGenre = document.getElementById("movie-genre");
const movieYear  = document.getElementById("movie-year");

async function loadMovies() {
  try {
    const res  = await fetch(`${API}/movies/`);
    const data = await res.json();
    movieList.innerHTML = "";

    data.forEach((m) => {
      const li = document.createElement("li");

      const info = document.createElement("div");
      info.className = "info";
      info.innerHTML = `
        <span class="title">${m.title}</span>
        <div class="meta">${m.genre} · ${m.year}</div>
      `;

      const btn = document.createElement("button");
      btn.textContent = "✕";
      btn.addEventListener("click", () => deleteMovie(m.id));

      li.append(info, btn);
      movieList.append(li);
    });

    updateMovieSelects(data);
  } catch (err) {
    movieList.innerHTML = "<li style='color:red'>❌ Ошибка загрузки. Запущен ли сервер?</li>";
    console.error("loadMovies error:", err);
  }
}

movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  await fetch(`${API}/movies/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: movieTitle.value.trim(),
      genre: movieGenre.value.trim(),
      year:  Number(movieYear.value),
    }),
  });
  movieForm.reset();
  loadMovies();
});

async function deleteMovie(id) {
  await fetch(`${API}/movies/${id}`, { method: "DELETE" });
  loadMovies();
  loadSessions();  
}

function updateMovieSelects(movies) {
  const filterSelect = document.getElementById("filter-movie");

  const currentFilter = filterSelect.value;
  filterSelect.innerHTML = '<option value="">Все сеансы</option>';
  movies.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.title;
    filterSelect.append(opt);
  });
  filterSelect.value = currentFilter;

  const sessionMovie = document.getElementById("session-movie");
  if (sessionMovie) {
    const currentVal = sessionMovie.value;
    sessionMovie.innerHTML = '<option value="">Выбери фильм...</option>';
    movies.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.title;
      sessionMovie.append(opt);
    });
    sessionMovie.value = currentVal;
  }
}

/* ═══════════════════════════════════════
   СЕАНСЫ
   ═══════════════════════════════════════ */

const sessionList  = document.getElementById("session-list");
const filterMovie  = document.getElementById("filter-movie");

filterMovie.addEventListener("change", () => loadSessions());

async function loadSessions() {
  try {
    let url = `${API}/sessions/`;
    if (filterMovie.value) {
      url += `?movie_id=${filterMovie.value}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Не удалось загрузить сеансы");
    const data = await res.json();
    
    sessionList.innerHTML = "";
    
    if (data.length === 0) {
      sessionList.innerHTML = "<p style='color:#999'>Сеансов пока нет.</p>";
      return;
    }

    data.forEach((session) => {
      const card = document.createElement("div");
      card.className = "session-card";
      
      const info = document.createElement("div");
      info.className = "session-info";
      info.innerHTML = `
        <div class="session-time">${session.time}</div>
        <div class="session-meta">Фильм ID: ${session.movie_id} · ${session.price} ₽ · ${session.seats} мест</div>
      `;
      
      const btn = document.createElement("button");
      btn.textContent = "✕";
      btn.addEventListener("click", () => deleteSession(session.id));
      
      card.append(info, btn);
      sessionList.append(card);
    });
  } catch (err) {
    sessionList.innerHTML = `<p style='color:red'>❌ Ошибка: ${err.message}</p>`;
    console.error("loadSessions error:", err);
  }
}

async function deleteSession(id) {
  await fetch(`${API}/sessions/${id}`, { method: "DELETE" });
  loadSessions();
}

// Форма добавления сеанса
const sessionForm = document.getElementById("session-form");
const sessionMovie = document.getElementById("session-movie");
const sessionTime = document.getElementById("session-time");
const sessionPrice = document.getElementById("session-price");
const sessionSeats = document.getElementById("session-seats");

if (sessionForm) {
  sessionForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await fetch(`${API}/sessions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        movie_id: Number(sessionMovie.value),
        time: sessionTime.value.trim(),
        price: Number(sessionPrice.value),
        seats: Number(sessionSeats.value),
      }),
    });
    sessionForm.reset();
    loadSessions();
  });
}

/* ── Старт ── */
loadMovies();
loadSessions();