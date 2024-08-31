document.querySelectorAll(".username").forEach((username) => {
  const userId = username.id.split("-")[1];
  const tooltip = document.getElementById(`tooltip-${userId}`);
  let tooltipTimeout;

  username.addEventListener("mouseenter", () => {
    tooltipTimeout = setTimeout(() => {
      tooltip.style.visibility = "hidden";
      tooltip.style.opacity = "0";
    }, 2000); // 2 seconds delay
  });

  username.addEventListener("mouseleave", () => {
    clearTimeout(tooltipTimeout);
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
  });

  username.addEventListener("mousemove", () => {
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
  });
});

$(document).ready(function () {
  const toggleButton = $("#theme-toggle");
  const body = $("body");

  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    body.addClass(savedTheme);
    toggleButton.text(
      savedTheme === "dark-mode"
        ? "Switch to Light Mode"
        : "Switch to Dark Mode"
    );
  }

  toggleButton.click(function () {
    if (body.hasClass("dark-mode")) {
      body.removeClass("dark-mode").addClass("light-mode");
      toggleButton.text("Switch to Dark Mode");
      localStorage.setItem("theme", "light-mode");
    } else {
      body.removeClass("light-mode").addClass("dark-mode");
      toggleButton.text("Switch to Light Mode");
      localStorage.setItem("theme", "dark-mode");
    }
  });
});
