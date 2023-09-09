"use strict";

const socket = io();

function send() {
  console.log("button clicked");
  const param = {
    name: $("#userName").val(),
    message: $(".chatting-input").val(),
  };
  socket.emit("chat", param);
  $(".chatting-input").val("");
}

$(".chatting-input").keypress(function (event) {
  if (event.keyCode === 13) send();
});

$(".send-button").on("click", send);

socket.on("chat", (data) => {
  const { name, message, time } = data;
  const item = new LiModel(name, message, time);

  item.makeLi();

  $(".display-container").scrollTop($(".display-container")[0].scrollHeight);
});

function LiModel(name, message, time) {
  this.name = name;
  this.message = message;
  this.time = time;

  this.makeLi = () => {
    let dom;
    if (this.name === $("#userName").val()) {
      dom = `<li class="sent"><span class="profile">
                <span class="user">${this.name}</span>
                <img src="https://picsum.photos/50/50" alt="any" />
              </span>
              <span class="message">${this.message}</span>
              <span class="time">${this.time}</span></li>`;
    } else {
      dom = `<li class="received"><span class="profile">
                <span class="user">${this.name}</span>
                <img src="https://picsum.photos/50/50" alt="any" />
              </span>
              <span class="message">${this.message}</span>
              <span class="time">${this.time}</span></li>`;
    }
    $(".chatting-list").append(dom);
  };
}
