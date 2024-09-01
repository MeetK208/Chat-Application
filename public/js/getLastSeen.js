document.addEventListener("DOMContentLoaded", () => {
  const getLastSeen = (user) => {
    if (user.is_online === "1") return ""; // User is online, show 'Online'

    const now = new Date();
    const lastSeenDate = new Date(user.lastseen);

    if (now.toDateString() === lastSeenDate.toDateString()) {
      // If the last seen date is today, return only the time
      return (
        "last seen at " +
        lastSeenDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    } else {
      // If it's a different day, return date and time
      return (
        "last seen at " +
        lastSeenDate.toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }
  };

  // Ensure that users are defined and is an array
  if (Array.isArray(users)) {
    users.forEach((user) => {
      const lastSeenElement = document.getElementById(`last-seen-${user._id}`);
      if (lastSeenElement) {
        lastSeenElement.textContent = getLastSeen(user);
      }
    });
  } else {
    console.error("Users data is not an array:", users);
  }
});
