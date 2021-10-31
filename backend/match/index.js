require('dotenv').config();
// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');

let cors = require('cors');

// Initialise the app
let app = express();

// Import routes
let apiRoutes = require("./api-routes");

const matchController = require("./matchController");

// http.listen(5004, async () => {
//     try {
//         await client.connect();
//         collection = client.db("MyFirstDataBase").collection("matches");
//         console.log("Listening on port :%s...", http.address().port);
//     } catch (e) {
//         console.error(e);
//     }
// });

const dbUsername = process.env.DBUSERNAME;
const dbPassword = process.env.DBPASSWORD;

// Configure bodyparser to handle post requests
app.use(express.urlencoded({
    extended: false
}));
app.use(cors());
app.use(express.json());

// Connect to Mongoose and set connection variable
const uri = `mongodb+srv://${dbUsername}:${dbPassword}@team23.77voc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection

// Added check for DB connection
if(!db) {
    console.log("Error connecting db")
}
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 5004;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello welcome to peerprep!'));

// Use Api routes in the App
app.use('/api', apiRoutes);
// Launch app to listen to specified port

const http = require('http').createServer(app);

http.listen(port, () => {
    console.log(`Match ms listening to port ${port}`);
})

const io = require("socket.io")(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
})

io.on("connection", (socket) => {
    socket.on("send-username", username => {
        io.emit("receive-username", "NAH USERNAME GIVE U " + username)
    })
    console.log(socket.id);
});

module.exports = io;