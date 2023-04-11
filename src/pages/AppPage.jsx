import React, { Component } from "react";

import { useState } from "react";
import "./homePage.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  VictoryPie,
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from "victory";
import { height } from "@mui/system";
import cognitoUserPool from "../cognitoUserPool";

// let sentiment_data = [
//   { x: "Positive", y: 0.0 },
//   { x: "Negative", y: 0.0 },
//   { x: "Neutral", y: 0.0 },
//   { x: "Mix", y: 0.0 },
// ];

let sentiment_data = null;

export default function AppPage() {
  
  const navigate = useNavigate();
  const [sentimentText, setSentimentText] = useState("");
  const [sentimentScore, setSentimentScore] = useState("");
  const [showSentiment, setShowSentiment] = useState(false);
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  const email = localStorage.getItem("email");

  const handleAnalyzeClick = () => {

    // Get the user input
    const text = document.getElementById("input-text").value;
    // const data_json = { body: value };
    const data_json = { email: email, text: value };
    setMessage("Loading...");
    console.log(data_json);

    let headers = new Headers();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // // headers.append('Authorization', 'Basic ' + base64.encode(username + ":" +  password));
    // // headers.append('Origin','http://localhost:3000');
    // headers.append("Access-Control-Allow-Origin", "*");
    // headers.append('Access-Control-Allow-Credentials', 'true');

    axios({
      // Endpoint to send files
      // url: "https://zj2de273p2.execute-api.us-east-1.amazonaws.com/Prod/sentiment_function",
      url: "https://zj2de273p2.execute-api.us-east-1.amazonaws.com/Prod/sentiment_function",
      method: "POST",
      data: data_json,
    })
      // Handle the response from backend here
      .then((res) => {
        console.log("res: ", res);
        const SentimentScore = res.data.SentimentScore;
        console.log("data: ", sentiment_data);
        sentiment_data = [
          { x: "Positive", y: parseFloat (SentimentScore.Positive.toFixed(2)) },
          { x: "Negative", y: parseFloat (SentimentScore.Negative.toFixed(2)) },
          { x: "Neutral", y: parseFloat (SentimentScore.Neutral.toFixed(2)) },
          { x: "Mix", y: parseFloat (SentimentScore.Mixed.toFixed(2)) },
        ];
        const sentiment = res.data.Sentiment;
        setSentimentText(sentiment);
        setSentimentScore(res.data.SentimentScore.sentiment);
        setShowSentiment(true);

        console.log("sentimentText: ", sentimentText);
        console.log("sentimentScore: ", sentimentScore);

        console.log("data: ", sentiment_data);
      })
      .catch((err) => {
        console.log("Something went wrong");
        console.log(err);
      });
  };

  function uploadImage() {
    console.log("uploadImage");
  }

  function handleHistory() {
    navigate("/history");
  }

  function handleLogOut() {
    const user = cognitoUserPool.getCurrentUser();
    user.signOut();
    window.location.href = '/';
  }

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
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"
        integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"
        integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"
        crossorigin="anonymous"
      ></script>
      <div align="right">{email}</div>
      <div align="right">
      <button  style={{ margin: '0.8rem' }} className="btn btn-primary" type="button" onClick={() => handleHistory()}>
              History
        </button>
        <button  className="btn btn-danger" type="button" onClick={() => handleLogOut()}>
              Logout
        </button>
      </div>
      <h1 align="center">Sentiment Analysis Dashboard</h1>
      <div className="div_container">
        <div className="component">
          <label htmlFor="input-text">Enter Text:</label>
          <textarea
            className="form-control"
            id="input-text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder="Enter text here"
          />
        </div>
        {/* <div align="center" padding="10px">
          OR
        </div>
        <div className="component">
          <label htmlFor="input-text">Input image:</label>
          <form>
            <input type="file" id="image-input" />
            <button type="button" onClick={() => uploadImage()}>
              Upload
            </button>
          </form>
        </div> */}
      </div>
      <div align="center">
        <button
          type="button"
          className="btn btn-primary"
          id="analyze-button"
          onClick={handleAnalyzeClick}
        >
          Analyze
        </button>
      </div>
      {showSentiment && (
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
          {/* <div className="form-group">
            <label htmlFor="sentiment-score">Score:</label>
            <input
              type="text"
              className="form-control"
              id="sentiment-score"
              value={sentimentScore}
              readOnly
            />
          </div> */}
        </div>
      )}
      {/* <div id="chart"></div> */}
      {/* <VictoryPie
        data={data}
        height={200}
        colorScale={["#2ecc71", "#e74c3c", "#3498db", "#95a5a6"]}
        labelRadius={30}
        labelPosition={({ index }) => (index ? "centroid" : "startAngle")}
        labelPlacement={({ index }) => (index ? "parallel" : "vertical")}
        style={{ labels: { fill: "white", fontSize: 5, fontWeight: "bold" } }}
      /> */}

      {showSentiment && (
        <div>
          <label htmlFor="sentiment-text">Confidence Score:</label>
        <VictoryChart
          width={200}
          height={150}
          theme={VictoryTheme.material}
          domainPadding={{ x: 10 }}
        >
          <VictoryAxis
            style={{
              axis: { fontSize: 5 },
              tickLabels: { fontSize: 5 },
            }}
            dependentAxis
            tickFormat={(tick) => `${tick * 1}`}
          />
          <VictoryBar
            barRatio={0.8}
            data={sentiment_data}
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
          </div>
      )}
    </div>
  );
}
