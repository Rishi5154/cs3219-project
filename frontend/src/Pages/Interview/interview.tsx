import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Editor from "../../Components/Editor/editor";
import Chat from "../../Components/Chat/chat";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import QuestionEasy from "../../questions/question-easy";
import "./interview.css";

const Interview = () => {
  const onClickEndSession = () => {
    console.log("End session");
  };

  return (
    <Container className="main-container">
      <div>
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          style={{ textTransform: "capitalize" }}
        >
          Interview
        </Typography>
        <Typography
          gutterBottom
          variant="body1"
          color="textSecondary"
          component="p"
          style={{ textTransform: "capitalize" }}
        >
          Difficulty: {"FAKE_DIFFICULTY"}
        </Typography>
        <Typography
          gutterBottom
          variant="body1"
          color="textSecondary"
          component="p"
          style={{ textTransform: "capitalize" }}
        >
          Peer: {"FAKE_NAME"}
        </Typography>
      </div>
      <div>
        <Button
          style={{ width: 140 }}
          variant="contained"
          color="secondary"
          onClick={onClickEndSession}
        >
          End Session
        </Button>
      </div>
      <div className="interview-panel" style={{ paddingTop: "20px" }}>
        <div className="left-panel">
          <Card style={{ display: 'flex', flex: 1, marginBottom: 16 }}>
              <CardContent
                style={{ display: 'flex', flex: 1, flexDirection: 'column' }}
              >
                <div className="interview-question-container">
                  <QuestionEasy />
                </div>
              </CardContent>
            </Card>
          <Card style={{ display: "flex", flex: 3, height: "5in" }}>
            <CardContent
              style={{ display: "flex", flex: 1, flexDirection: "column" }}
            >
              <h3>Chat</h3>
              <Chat username="TO_ADD_USERNAME" sessionId="TO_ADD_SESSION_ID" />
            </CardContent>
          </Card>
        </div>
        <div className="right-panel">
          <Card style={{ display: "flex", flex: 7, height: "10.5in"}}>
            <CardContent style={{ width: "9in" }}>
              <Editor />
            </CardContent>
          </Card>
        </div>
      </div>
    <div style={{ paddingBottom: "20px" }} />
  </Container>
  );
};

export default Interview;
