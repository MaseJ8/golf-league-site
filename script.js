document.addEventListener("DOMContentLoaded", () => {
  // ===== DOM elements =====
  const courseSelect = document.getElementById("course");
  const teeSelect = document.getElementById("tee");
  const manualCourseContainer = document.getElementById("manual-course-container");
  const form = document.getElementById("score-form");
  const leaderboardBody = document.querySelector("#leaderboard tbody");

  let scores = [];

  // ===== Courses database =====
  const courses = [
    { name: "Pebble Beach", tees: ["Blue", "White", "Red"] },
    { name: "St George GC", tees: ["Blue", "White", "Red"] },
    { name: "Augusta National", tees: ["Masters", "Member"] }
  ];

  // ===== Render courses dropdown =====
  function renderCoursesDropdown() {
    courseSelect.innerHTML = '<option value="">Select course</option>';

    courses.forEach(c => {
      const option = document.createElement("option");
      option.value = c.name;
      option.textContent = c.name;
      courseSelect.appendChild(option);
    });

    const otherOption = document.createElement("option");
    otherOption.value = "Other";
    otherOption.textContent = "Other (Add new course)";
    courseSelect.appendChild(otherOption);
  }

  renderCoursesDropdown();

  // ===== Dynamic tees dropdown =====
  courseSelect.addEventListener("change", () => {
  teeSelect.innerHTML = '<option value="">Select tee</option>';

  if (courseSelect.value === "Other") {
    manualCourseContainer.style.display = "block";

    // When user types a manual tee name, add it as an option
    const manualTeeInput = document.getElementById("manual-tee-name");
    manualTeeInput.addEventListener("input", () => {
      teeSelect.innerHTML = ""; // clear previous options
      const teeName = manualTeeInput.value.trim();
      if (teeName) {
        const option = document.createElement("option");
        option.value = teeName;
        option.textContent = teeName;
        teeSelect.appendChild(option);
      }
    });

    return;
  } else {
    manualCourseContainer.style.display = "none";
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

  // ===== Net score calculation =====
  function calculateNetScore(gross, handicap) {
    return gross - handicap;
  }

  // ===== Form submission =====
  form.addEventListener("submit", e => {
    e.preventDefault();

    const playerName = document.getElementById("player-name").value.trim();
    const courseName = courseSelect.value === "Other" 
      ? document.getElementById("manual-course-name").value.trim() 
      : courseSelect.value;
    const teeName = courseSelect.value === "Other" 
      ? document.getElementById("manual-tee-name").value.trim() 
      : teeSelect.value;
    const grossScore = parseInt(document.getElementById("score").value);
    const handicap = parseInt(document.getElementById("handicap").value);

    if (!playerName || !courseName || !teeName || !grossScore || handicap === null) {
      alert("Please fill all fields!");
      return;
    }

    const netScore = calculateNetScore(grossScore, handicap);

    scores.push({
      player: playerName,
      gross: grossScore,
      net: netScore,
      course: courseName,
      tee: teeName
    });

    scores.sort((a, b) => a.net - b.net);

    leaderboardBody.innerHTML = "";
    scores.forEach(s => {
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
    teeSelect.innerHTML = '<option value="">Select tee</option>';
    manualCourseContainer.style.display = "none";
  });
});

