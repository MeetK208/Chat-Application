const getLastSeen = (user) => {
  if (user.is_online === "1") return null; // User is online, no need to show last seen

  const now = new Date();
  const lastSeenDate = new Date(user.lastseen);

  if (now.toDateString() === lastSeenDate.toDateString()) {
    // If the last seen date is today, return only the time
    return lastSeenDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    // If it's a different day, return date and time
    return lastSeenDate.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};
