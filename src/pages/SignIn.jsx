import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { IconButton } from "@mui/material";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";

import cognitoUserPool from "../cognitoUserPool";


const theme = createTheme();


export default function SignIn() {
  const emailValidation = /^[ ]*([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})[ ]*$/i;

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    const user = new CognitoUser({
      Username: email,
      Pool: cognitoUserPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    if (email === "" || password === "") {
      setErrorMessage("Email or password can not be empty.");
    } else {
      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          console.log("On success: ", data);
          console.log(data.accessToken.jwtToken);
          const jwtToken = data.accessToken.jwtToken;
          localStorage.setItem("email", email);
          localStorage.setItem("jwtToken", jwtToken);
          setErrorMessage("");
          navigate("/home");
        },
        onFailure: (err) => {
          setErrorMessage("Incorrect username or password");
          if (err.name === "UserNotConfirmedException") {
            setErrorMessage("Please confirm your email");
          }
          // setError(err)
        },
        newPasswordRequired: (data) => {
          console.log("New password required: ", data);
        },
      });
    }
  };


  const handleEmailChange = (event) => {
    const newValue = event.target.value;
    // setEmail(newValue);
    if (!emailValidation.test(newValue)) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  };

  const handlePasswordChange = (event) => {
    const newValue = event.target.value;
    setPassword(newValue);
    if (newValue.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <h1 align="center">Sentiment Analyzer</h1>

      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
           Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleEmailChange}
                  error={emailError}
                  helperText={emailError && "Please enter valid email address"}
                />
              </Grid>

              {/* <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            /> */}
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  fullWidth
                  required
                  error={passwordError}
                  helperText={
                    passwordError && "Password must be at least 6 characters"
                  }
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Typography color={"red"}>{errorMessage}</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
