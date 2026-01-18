document.addEventListener("DOMContentLoaded", () => {
  console.log("JS CONNECTED");

  const courseSelect = document.getElementById("course");
  const manualCourseContainer = document.getElementById("manual-course-container");
  const manualCourseInput = document.getElementById("manual-course");
  const form = document.getElementById("score-form");
  const leaderboardBody = document.querySelector("#leaderboard tbody");

  let scores = [];

  // ===== Course Database =====
  let courses = [
    { name: "Gold Mountain" 
      par: 72,
      tees: "black","blue","white"
    },
    { name: "Kitsap GC"
      par: 72 },
    { name: "Pebble Beach"
      par: 72 },
    { name: "Rolling Hills"
      par 72 },
  ];

  // ===== Render courses dropdown =====
  function renderCoursesDropdown() {
    courseSelect.innerHTML = `<option value="">Select course</option>`;

    courses.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c.name;
      opt.textContent = c.name;
      courseSelect.appendChild(opt);
    });

    const otherOpt = document.createElement("option");
    otherOpt.value = "Other";
    otherOpt.textContent = "Other (Add new)";
    courseSelect.appendChild(otherOpt);
  }

  renderCoursesDropdown();

  // ===== Show manual course input if "Other" selected =====
  courseSelect.addEventListener("change", () => {
    if (courseSelect.value === "Other") {
      manualCourseContainer.style.display = "block";
    } else {
      manualCourseContainer.style.display = "none";
    }
  });

  // ===== Handle form submission =====
  form.addEventListener("submit", e => {
    e.preventDefault();

    const playerName = document.getElementById("player-name").value.trim();
    let courseName = courseSelect.value;
    const courseHandicap = parseInt(document.getElementById("handicap").value);
    const grossScore = parseInt(document.getElementById("score").value);

    if (!playerName || !courseName || isNaN(courseHandicap) || isNaN(grossScore)) {
      alert("Please fill out all fields!");
      return;
    }

    // If "Other", take manual course name and add to database
    if (courseName === "Other") {
      const manualName = manualCourseInput.value.trim();
      if (!manualName) {
        alert("Please enter the new course name.");
        return;
      }
      courseName = manualName;
      courses.push({ name: manualName });
      renderCoursesDropdown(); // refresh dropdown with new course
    }

    // Calculate Net score (CH handles math)
    const netScore = grossScore - courseHandicap;

    // Add to leaderboard
    scores.push({
      player: playerName,
      gross: grossScore,
      net: netScore,
      course: courseName
    });

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

    // Reset form
    form.reset();
    manualCourseContainer.style.display = "none";
  });
});
