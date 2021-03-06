import { useEffect, useState } from "react";
import ReactScrollToBottom from "react-scroll-to-bottom";
import io, { Socket } from "socket.io-client";
import { TextField, Chip, Typography } from "@material-ui/core";
import { Button } from "react-bootstrap";
import { MSG_URL } from "../../api";
import { useParams } from "react-router-dom";
import "./chat.css";

const Chat = (props: any) => {
  const { interviewId } = useParams<string>();
  const username = props.username;
  const [socket, setSocket] = useState<Socket>();
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (connected === false) {
      const socket = io(MSG_URL);
      socket.on(interviewId, (msg: {text: string}) => {
        console.log(`Msg recvd ${msg.text}`)
        setMessages((history) => [...history, msg]);
        // socket.disconnect();
      });
      socket.on(`${interviewId}@disconnected`, (signal: {user: string}) => {
        const user = signal.user;
        console.log(`${user} has disconnected`);
        if (user !== username) {
          setMessages((history) => [...history, 
            {sender: "system", text: `-- ${user} has disconnected --`}
          ]);
        }
      })
      setSocket(socket);
      setConnected(true);
      setMessages((history) => [
        ...history,
        { sender: "system", text: "-- Connected --" },
      ]);
    }
    return;
  }, [interviewId, connected, socket, username]);

  const sendMessage = () => {
    if (draft !== "") {
      console.log(`Emitted ${interviewId} ${username} ${draft}`);
      socket.emit("new-message", {
        interviewId: interviewId,
        newMsg: {
          sender: username,
          text: draft,
        },
      });
      setDraft("");
      // socket.disconnect();
    }
  };

  const msgOnChange = (e) => {
    setDraft(e.target.value);
  };

  return (
    <>
      <ReactScrollToBottom className="chat-message-container">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.sender === username ? "chat-right" : "chat-left"}
          >
            <Typography
              variant="caption"
              style={{ textTransform: "capitalize" }}
              color="textSecondary"
            >
              {m.sender}
            </Typography>
            <Chip label={m.text} />
          </div>
        ))}
      </ReactScrollToBottom>
      <div className="chat-text-field">
        <TextField
          fullWidth
          size="small"
          value={draft}
          type="text"
          name="message"
          placeholder="Enter message here..."
          variant="outlined"
          onChange={msgOnChange}
          onKeyUp={(e) => (e.key === "Enter" ? sendMessage() : null)}
          style={{ paddingTop: "5px" }}
        />
        <Button
          onClick={sendMessage}
          type="submit"
          className="ms-1"
          variant="outline-info"
        >
          Send
        </Button>
      </div>
    </>
  );
};

export default Chat;
