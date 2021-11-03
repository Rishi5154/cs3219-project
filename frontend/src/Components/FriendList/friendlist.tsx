import { Card, ListGroup } from "react-bootstrap";
import { PersonSquare } from "react-bootstrap-icons";
import friends from "../../assets/friends.svg";

export const FriendList = (props: { friendList }) => {
  return (
    <Card className="home-card" style={{ height: "202px" }}>
      <Card.Body className="d-grid">
        <Card.Title className="fs-4 mb-3"> Friend List</Card.Title>
        <div style={{ overflow: "scroll", height: "130px" }}>
          {props.friendList.length === 0 ? (
            <div className="text-center no-match pb-4">
              <img
                className="mb-1"
                src={friends}
                alt="friends"
                width={88}
                height={88}
              />
              <p className="fw-light">
                Oops, seems like you have no friends so far.
              </p>
            </div>
          ) : (
            <>
              <div>
                <ListGroup>
                  {props.friendList.map((item, idx) => {
                    return (
                      <ListGroup.Item
                        action
                        variant="primary"
                        // className="my-2"
                        key={idx}
                      >
                        <PersonSquare className="mb-1 me-2" />
                        {"  " + item.friend_username}
                        <br />
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
                <div
                  className="text-center mt-2"
                  style={{ height: props.friendList.length <= 1 ? 230 : 32.5 }}
                >
                  <p>Reached the end of list.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
