var socket = io("http://localhost:3000/user-namespace", {
  auth: {
    token: sender_id,
    emailID: "<%= currentUser.email %>",
  },
});

socket.on("sendOnlineBroadcast", function (data) {
  $("#" + data.user_id + "-status").removeClass("offline-status");
  $("#" + data.user_id + "-status").addClass("online-status");
});

socket.on("sendOfflineBroadcast", function (data) {
  $("#" + data.user_id + "-status").removeClass("online-status");
  $("#" + data.user_id + "-status").addClass("offline-status");
  $("#last-seen-" + data.user_id).html();
});
$("#chat-form").submit(function (event) {
  event.preventDefault();
  const message = $("#message").val();

  if (sender_id && receiver_id && message) {
    console.log({ sender_id, receiver_id, message });

    fetch("/api/v1/chat/save-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender_id, receiver_id, message }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          $("#message").val("");

          // Append the message to the chat container
          const chat = data.data.message;
          const chatClass =
            data.data.sender_id === sender_id
              ? "current-user-chat"
              : "distance-user-chat";
          const html = `<div><h5 class="${chatClass}">${chat}</h5></div>`;
          $("#chat-container").append(html);

          // Emit the chat message
          socket.emit("newChat", data.data);
        } else {
          console.log("Failed to save chat:", data.error);
        }
      })
      .catch((error) => console.error("Error:", error));
  } else {
    console.log("Sender or Receiver ID is missing, or message is empty.");
  }
});

socket.on("loadNewChat", function (data) {
  // Debugging output
  console.log("Received new chat message data:", data);
  console.log(sender_id, receiver_id);

  // Ensure data contains the necessary properties
  if (data && data.message && data.sender_id && data.receiver_id) {
    // Check if the message is for the current chat
    if (sender_id == data.receiver_id && receiver_id == data.sender_id) {
      let chat = data.message;
      let html = `
          <div>
            <h5 class="distance-user-chat">${chat}</h5>
          </div>
        `;
      console.log("Displaying new chat message:", chat);
      $("#chat-container").append(html);
      chatContainer.scrollTop(chatContainer[0].scrollHeight);
    }
  } else {
    console.log("Invalid message data received:", data);
  }
});
