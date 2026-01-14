 // ===== 1. Courses database =====
  const courses = [
    { name: "Pebble Beach", tees: ["Blue", "White", "Red"] },
    { name: "St George GC", tees: ["Blue", "White", "Red"] },
    { name: "Augusta National", tees: ["Masters", "Member"] }
  ];

  // ===== 2. DOM elements =====
  const courseSelect = document.getElementById("course");
  const teeSelect = document.getElementById("tee");
  const manualCourseContainer = document.getElementById("manual-course-container");
  const form = document.getElementById("score-form");
  const leaderboardBody = document.querySelector("#leaderboard tbody");

  let scores = [];

  // ===== 3. Render courses dropdown dynamically =====
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

  // ===== 4. Dynamic tee selection =====
  courseSelect.addEventListener("change", () => {
    teeSelect.innerHTML = '<option value="">Select tee</option>';

    if (courseSelect.value === "Other") {
      manualCourseContainer.style.display = "block";
      return;
    } else {
      manualCourseContainer.style.display = "none";
    }

    const selectedCourse = courses.find(c => c.name === courseSelect.value);
    if (selectedCourse) {
      selectedCourse.tees.forEach(tee => {
        const option = document.createElement("option");
        option.value = tee;
        option.textContent = tee;
        teeSelect.appendChild(option);
      });
    }
  });

  // ===== 5. Net score calculation =====
  function calculateNetScore(gross, handicap) {
    return gross - handicap;
  }

  // ===== 6. Form submission =====
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

    // Sort leaderboard by net score ascending
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

    form.reset();
    teeSelect.innerHTML = '<option value="">Select tee</option>';
    manualCourseContainer.style.display = "none";
  });
</script>
