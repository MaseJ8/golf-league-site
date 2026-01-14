document.addEventListener("DOMContentLoaded", () => {
  // ===== DOM elements =====
  const courseSelect = document.getElementById("course");
  const teeSelect = document.getElementById("tee");
  const manualCourseContainer = document.getElementById("manual-course-container");
  const manualCourseInput = document.getElementById("manual-course-name");
  const manualTeeInput = document.getElementById("manual-tee-name");
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

  // ===== Render tees dropdown =====
  function renderTees(courseName) {
    teeSelect.innerHTML = '<option value="">Select tee</option>';

    if (!courseName || courseName === "Other") return;

    const selected = courses.find(c => c.name === courseName);
    if (selected) {
      selected.tees.forEach(t => {
        const opt = document.createElement("option");
        opt.value = t;
        opt.textContent = t;
        teeSelect.appendChild(opt);
      });
    }
  }

  // ===== Course select change =====
  courseSelect.addEventListener("change", () => {
    if (courseSelect.value === "Other") {
      manualCourseContainer.style.display = "flex";
      teeSelect.innerHTML = '<option value="">Select tee</option>';
    } else {
      manualCourseContainer.style.display = "none";
      renderTees(courseSelect.value);
    }
  });

  // ===== Manual course/tee input =====
  manualTeeInput.addEventListener("input", () => {
    teeSelect.innerHTML = '<option value="">Select tee</option>';
    const teeName = manualTeeInput.value.trim();
    if (teeName) {
      const option = document.createElement("option");
      option.value = teeName;
      option.textContent = teeName;
      teeSelect.appendChild(option);
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
      ? manualCourseInput.value.trim()
      : courseSelect.value;
    const teeName = courseSelect.value === "Other"
      ? manualTeeInput.value.trim()
      : teeSelect.value;
    const grossScore = parseInt(document.getElementById("score").value);
    const handicap = parseInt(document.getElementById("handicap").value);

    if (!playerName || !courseName || !teeName || !grossScore || handicap === null) {
      alert("Please fill all fields!");
      return;
    }

    // If it’s a new manual course, add it to courses array
    if (courseSelect.value === "Other") {
      const tees = teeName ? [teeName] : [];
      courses.push({ name: courseName, tees });
      renderCoursesDropdown(); // update dropdown with new course
    }

    const netScore = calculateNetScore(grossScore, handicap);

    scores.push({
      player: playerName,
      gross: grossScore,
      net: netScore,
      course: courseName,
      tee: teeName
    });

    // Sort leaderboard by net score
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
        <td>${s.tee}</td>
      `;
      leaderboardBody.appendChild(row);
    });

    // Reset form
    form.reset();
    teeSelect.innerHTML = '<option value="">Select tee</option>';
    manualCourseContainer.style.display = "none";
  });
});
