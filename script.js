document.addEventListener("DOMContentLoaded", () => {
  console.log("JS CONNECTED");

  const courseSelect = document.getElementById("course");
  const form = document.getElementById("score-form");
  const leaderboardBody = document.querySelector("#leaderboard tbody");

  let scores = [];

  // ===== DATABASE =====
  const courses = [
    { name: "Gold Mountain" },
    { name: "Kitsap GC" },
    { name: "Pebble Beach" }
  ];

  // ===== Render Courses Dropdown =====
  function renderCoursesDropdown() {
    courseSelect.innerHTML = `<option value="">Select course</option>`;
    courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      courseSelect.appendChild(opt);
    });
  }

  renderCoursesDropdown();

  // ===== Submit Form =====
  form.addEventListener("submit", e => {
    e.preventDefault();

    const player = document.getElementById("player-name").value;
    const course = courseSelect.value;
    const gross = +document.getElementById("score").value;
    const handicap = +document.getElementById("handicap").value;

    if (!player || !course || isNaN(gross) || isNaN(handicap)) {
      alert("Please fill all fields correctly");
      return;
    }

    const net = gross - handicap;

    scores.push({ player, gross, net, course });

    // Sort by net score
    scores.sort((a, b) => a.net - b.net);

    // Render leaderboard
    leaderboardBody.innerHTML = "";
    scores.forEach(s => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.player}</td>
        <td>${s.gross}</td>
        <td>${s.net}</td>
        <td>${s.course}</td>
      `;
      leaderboardBody.appendChild(row);
    });

    form.reset();
  });
});
