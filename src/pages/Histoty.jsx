import React from "react";

import { useState, useEffect } from "react";
import "./homePage.css";
import { useNavigate } from "react-router-dom";
import { Paper, Divider, Grid } from "@mui/material";

import axios from "axios";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory";
import cognitoUserPool from "../cognitoUserPool";

export default function History() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
    const [historyData, setHistoryData] = useState({});
    
    const [message, setMessage] = useState("Loading...");

  const email = localStorage.getItem("email");

  function handleBack() {
    navigate("/home");
  }

  function handleLogOut() {
      const user = cognitoUserPool.getCurrentUser();
        user.signOut();
        window.location.href='/';
  }
  useEffect(() => {
    const data_json = { email: localStorage.getItem("email") };
    axios({
      // Endpoint to fetch organizer profile
      url: process.env.REACT_APP_API_LINK+"sentiment-read-dynamo",
      method: "POST",
      data: data_json,
    })
      // Handle the response from backend here
      .then((res) => {
        setCount(res["Count"]);

        
          setHistoryData(res);
          if (count === 0) {
              setMessage("No History found");
          }
          else {
              setMessage("");
          }
      })

      // Catch errors if any
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container">
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />

      <script
        src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
        crossorigin="anonymous"></script>
      <script
        src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"></script>

      {/* {showSentiment && (
        <div className="sentiment">
          <h3>Sentiment Analysis Result:</h3>
          <div className="form-group">
            <label htmlFor="sentiment-text">Sentiment:</label>
            <input
              type="text"
              className="form-control"
              id="sentiment-text"
              value={sentimentText}
              readOnly
            />
          </div>
         
        </div>
      )} */}
      <div align="right">{email}</div>
      <div align="right">
        <button
          style={{ margin: "0.8rem" }}
          className="btn btn-primary"
          type="button"
          onClick={() => handleBack()}>
          Back
        </button>
        <button
          className="btn btn-danger"
          type="button"
          onClick={() => handleLogOut()}>
          Logout
        </button>
      </div>
      {count !== 0 &&
        historyData["data"]["body"]["Items"].map((data) => (
          // backgroundColor: '#'+Math.floor(Math.random() * 16777215).toString(16)
            <div>
            <Paper  borderRadius='20px' borderColor="#000" elevation={9} style={{ margin: "16px 0px" }}>
            
            <div className="sentiment">
              <div className="form-group">
                <label htmlFor="sentiment-text">Input:</label>
                <input
                  type="text"
                  width={5}
                  className="form-control"
                  id="sentiment-text"
                  value={data["input"]["S"]}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label htmlFor="sentiment-text">Sentiment:</label>
                <input
                  type="text"
                  className="form-control"
                  id="sentiment-text"
                  value={data["sentiment"]["S"]}
                  readOnly
                />
              </div>
            </div>
              <Divider />
              
          <label htmlFor="sentiment-text">Confidence Score:</label>
            <VictoryChart
              width={200}
              height={150}
              theme={VictoryTheme.material}
              domainPadding={{ x: 5 }}>
              <VictoryAxis
                style={{
                  axis: { fontSize: 8 },
                  tickLabels: { fontSize: 5 },
                }}
                dependentAxis
                tickFormat={(tick) => `${tick * 1}`}
              />
              <VictoryBar
                barRatio={0.8}
                data={[
                    {
                      x: "Positive",
                      y: parseFloat(data["PositiveScore"]["S"]),
                    },
                    {
                      x: "Negative",
                      y: parseFloat(data["NegativeScore"]["S"]),
                    },
                    {
                      x: "Neutral",
                      y: parseFloat(data["NeutralScore"]["S"]),
                    },
                    { x: "Mix", y: parseFloat(data["MixedScore"]["S"]) },
                  ]}
                alignment="start"
                style={{
                  data: {
                    fill: "#c43a31",
                    stroke: "black",
                    strokeWidth: 0.5,
                  },
                }}
                labels={({ datum }) => `${datum.x}: ${datum.y}`}
                labelComponent={<VictoryLabel style={{ fontSize: 5 }} />}
              />
            </VictoryChart>
           
            </Paper>
            <Grid>
              
                </Grid>
                </div>
            
        ))}
          {count === 0 && (
              <div align='center'><h3>{message}</h3></div>
          )}
    </div>
  );
}
