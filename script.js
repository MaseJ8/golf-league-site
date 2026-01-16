document.addEventListener("DOMContentLoaded", () => {
  console.log("JS CONNECTED");

  const courseSelect = document.getElementById("course");
  const manualCourseContainer = document.getElementById("course");
  const manualCourseInput = document.getElementById("manual-course-name);
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
    //option for adding a new course
    const other = document.createElement("option");
    other.value = "Other";
    other.textContent = "Other (Add new)";
    courseSelect.appendChild(other);    
  }

  renderCoursesDropdown();

  // ===== Show manual course input if "Other" selected =====
  courseSelect.addEventListener("change", () => {
    if (courseSelect.value === "Other") {
      manualCourseContainer.style.display = "block";
    } else {
      manualCourseContainer.style.display = "none";
      manualCourseInput.value = "";
    }
  });

 // ===== Handle form submit =====
  form.addEventListener("submit", e => {
    e.preventDefault();

    const player = document.getElementById("player-name").value;
    let courseName = courseSelect.value;
    const gross = +document.getElementById("score").value;
    const handicap = +document.getElementById("handicap").value;

    if (courseName === "Other") {
      const newCourse = manualCourseInput.value.trim();
      if (!newCourse) {
        alert("Please enter a course name");
        return;
      }
      // Add new course to database
      courses.push({ name: newCourse });
      courseName = newCourse;

      // Re-render dropdown to include the new course
      renderCoursesDropdown();
      courseSelect.value = newCourse; // Automatically select the new course
      manualCourseContainer.style.display = "none";
      manualCourseInput.value = "";
    }

    const net = gross - handicap;

    scores.push({ player, gross, net, course: courseName });

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
