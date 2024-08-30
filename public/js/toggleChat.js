$(".user-list").click(function () {
  $(".chat-section").toggle();
  var id = $(this).attr("data-id"); // This sets the receiver_id correctly when a user is clicked
  receiver_id = id;
  console.log("Receiver ID Set:", receiver_id);

  socket.emit("existChat", {
    sender_id: sender_id,
    receiver_id: receiver_id,
  });

  socket.on("loadCHats", (data) => {
    var userChats = data.chats;
    $(".chat-section").html();
    console.log(userChats);
    let html = "";
    for (let x = 0; x < userChats.length; x++) {
      let addClass = "";
      if (userChats[x]["sender_id"] == sender_id) {
        addClass = "current-user-chat";
      } else {
        addClass = "distance-user-chat";
      }

      html += `
        <div>
          <h5 class="${addClass}">${userChats[x]["message"]}</h5>
        </div>
      `;
    }
    $("#chat-container").html(html);
  });

  setTimeout(() => {
    $("#chat-container").scrollTop($("#chat-container")[0].scrollHeight);
  }, 100);
});
