document.addEventListener("DOMContentLoaded", () => {

  console.log("JS CONNECTED");

  const courseSelect = document.getElementById("course");
  const teeSelect = document.getElementById("tee");
  const manualBox = document.getElementById("manual-slope-container");
  const form = document.getElementById("score-form");
  const leaderboardBody = document.querySelector("#leaderboard tbody");

  let scores = [];

  // DATABASE
  const courses = [
    { name: "Gold Mountain", tees: ["Blue", "White"] },
    { name: "Kitsap GC", tees: ["Championship", "Member"] },
    { name: "Pebble Beach", tees: ["Blue", "White", "Red"] }
  ];

  // ===== Render courses =====
  function renderCoursesDropdown() {
    courseSelect.innerHTML = `<option value="">Select course</option>`;

    courses.forEach(course => {
      const opt = document.createElement("option");
      opt.value = course.name;
      opt.textContent = course.name;
      courseSelect.appendChild(opt);
    });

    const other = document.createElement("option");
    other.value = "Other";
    other.textContent = "Other (Add new)";
    courseSelect.appendChild(other);
  }

  renderCoursesDropdown();

  // ===== Tee logic =====
  courseSelect.addEventListener("change", () => {
    teeSelect.innerHTML = `<option value="">Select tee</option>`;

    if (courseSelect.value === "Other") {
      manualBox.style.display = "block";
      return;
    } else {
      manualBox.style.display = "none";
    }

    const selected = courses.find(c => c.name === courseSelect.value);

    if (selected) {
      selected.tees.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        teeSelect.appendChild(opt);
      });
    }
  });

  // ===== Submit =====
  form.addEventListener("submit", e => {
    e.preventDefault();

    const player = document.getElementById("player-name").value;
    const gross = +document.getElementById("score").value;
    const handicap = +document.getElementById("handicap").value;
    const course = courseSelect.value;
    const tee = teeSelect.value;

    const net = gross - handicap;

    scores.push({ player, gross, net, course, tee });

    scores.sort((a,b)=>a.net-b.net);

    leaderboardBody.innerHTML = "";
    scores.forEach(s=>{
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${s.player}</td>
        <td>${s.gross}</td>
        <td>${s.net}</td>
        <td>${s.course}</td>
        <td>${s.tee}</td>
      `;
      leaderboardBody.appendChild(row);
    });

    form.reset();
    teeSelect.innerHTML = `<option value="">Select tee</option>`;
  });

});
