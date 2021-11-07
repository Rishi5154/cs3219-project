import { Button, Modal } from "react-bootstrap";
import LoadingModal from "../LoadingModal/loadingmodal";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import { MATCH_URL, QNS_API_URL, API_HEADERS } from "../../api";


// Small popup for matching with a friend
const MatchModal = ({ show, onHide, username, declinedCallback }) => {

  const [loading, setLoading] = useState(false);
  const [cookies] = useCookies(["userInfo"]);
  const history = useHistory();
  const [myUsername, setMyUsername] = useState();

  const [socket, setSocket] = useState<Socket>();
  const [connected, setConnected] = useState(false);
  

  useEffect(() => {
    if (!myUsername) {
      const myUsernameFromCookies = cookies.userInfo.user.username;
      setMyUsername(myUsernameFromCookies);
    }
  }, [setMyUsername, cookies.userInfo.user.username, myUsername])


   // connect to match socket
  useEffect(() => {
    const getSessionId = (matchUsername: String) => {
      if (myUsername < matchUsername) {
          return `${myUsername}-${matchUsername}`;
      } else {
          return `${matchUsername}-${myUsername}`;
      }
    }
    const updateUserProfile = async (matchedUsername, questionTitle) => {
      await fetch(USER_API_URL + `/user/profile/interview/${myUsername}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json; charset=utf-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          partnerUsername: matchedUsername,
          question: questionTitle,
        }),
      })
        .then(async (res) => {
          var result = await res.json();
          console.log(result.message);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (connected === false && myUsername) {
      const sock = io(MATCH_URL);
      sock.on(`${myUsername}@friend_match`, (result) => {
        if (result.accept) {
            const questionTitle = result.questionTitle;
            const sessionId = getSessionId(result.match);
            console.log("SESSION ID IS: " + sessionId);
            updateUserProfile(username, questionTitle);
            setLoading(false);
            history.push(`/interview/${sessionId}/${questionTitle}`);           
        } else {
            console.log("Show declined notification..");
            declinedCallback();
            setLoading(false);
            onHide();
        }
        sock.disconnect();
      });
      setSocket(sock);
      setConnected(true);
    }
  }, [socket, connected, myUsername, cookies, history, setSocket, setConnected, username, declinedCallback, onHide]);


  const fetchRandomQuestion = async (qnDifficulty: String) => {
    const qnTitle = await fetch(QNS_API_URL + `/questions/difficulty/${qnDifficulty.toLowerCase()}`, {
      method: "GET",
      headers: API_HEADERS
    }).then(async (res) => {
      var result = await res.json();
      return result.data.title;
    }).catch((err) => {
      console.log(err);
      return null; // TODO: require error handling
    });
    return qnTitle;
  }

  const onRequestForMatch = async () => {
      setLoading(true);
      console.log(`You want to match with ${username}!`);

      //fetch a random easy question
      const qnTitle = await fetchRandomQuestion("Easy");

      //delete match
      await fetch(MATCH_API_URL + "/matches", {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json; charset=utf-8",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          username: username,
        }),
      })
        .then(async (res) => {
          var result = await res.json();
          console.log(result.message);
        })
        .catch((err) => {
          console.log(err);
        });

      //send signal to user:username
      console.log(`Send signal to user: ${username}`);
      socket.emit(`${username}@incoming_request`, {
        requester: myUsername,
        qnTitle: qnTitle
      })

      //wait for signal back
      console.log(`Waiting for signal from ${username}`);

      //on match
      console.log("On match!");

  }

  return (
    loading 
        ? <LoadingModal show={loading} onHide={() => setLoading(false)} /> 
        :
    <>
        <Modal show={show} onHide={() => onHide()} >
        <Modal.Header>
            <Modal.Title>{`Match with friend ${username}?`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Button variant="primary" onClick={onRequestForMatch}>
            {"Yes"}
            </Button>
            {" "}
            <Button variant="danger" onClick={onHide}>
            {"No"}
            </Button>
        </Modal.Body>
        <Modal.Footer>
            
        </Modal.Footer>
        </Modal>
    </>
  );
};

export default MatchModal;
