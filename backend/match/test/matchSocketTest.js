// Test
const io = require("socket.io-client");
const url = 'https://match-6i7ougacoq-de.a.run.app';
const local = "http://localhost:5004";
const socket = io(url);

console.log("Start test.js ")
// socket.emit("send-username", "testUsername");

// socket.on("receive-username", (msg) => {
//     console.log(`Received msg ${msg}`);
// })
// socket.on("connection", (socket) => {
//     console.log("connected");
//     socket.emit("test@incoming_request", {
//         requester: "user1",
//         qnTitle: "Two Sum"
//     })

//     socket.emit("match-found-test", {
//         match: "user1",
//         questionTitle: "Two Sum"
//     })
// })


socket.emit("incoming_request", {
    requester: 'test',
    selectedFriend: 'user1',
    qnTitle: "Two Sum"
})