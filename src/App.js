import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import { observer, inject } from "mobx-react";
import MediaCards from "./Components/MediaCards/MediaCards";
import Notifications from "./Components/Notifications/Notifications";
import CreatorPage from "./Components/CreatorPage/CreatorPage";
import AddCreator from "./Components/CreatorPage/AddCreator";
import io from "socket.io-client";


//user params hook
import { ThemeProvider, Paper } from "@material-ui/core";
import { useTheme, useIsAuth } from "./hooks/hooks";
import { MapsLocalHospital } from "material-ui/svg-icons";

const PORT = 3001 

let socket = io(`localhost:${PORT}`)

socket.on('connect', () => {
  socket.on('newNotification', (data) => {
    console.log(data)
  })  
})

socket.on('connection', () => console.log('sup'))

const App = inject(
  "userStore",
  "mediaStore"
)(
  observer((props) => {
    const { darkState, isLoggedIn, cookieLogIn } = props.userStore;
    const darkTheme = useTheme(darkState);
    useIsAuth(cookieLogIn);


    return (
      <Router>
        <ThemeProvider theme={darkTheme}>
          <Paper>
            <div id="main-container">
              <Route
                exact
                path="/"
                render={() =>
                  isLoggedIn ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <Redirect to="/auth/login" />
                  )
                }
              />
              <Route
                exact
                path="/auth/login"
                render={() =>
                  isLoggedIn ? <Redirect to="/dashboard" /> : <Landing />
                }
              />
              <Route
                exact
                path="/auth/register"
                render={() =>
                  isLoggedIn ? <Redirect to="/dashboard" /> : <Landing />
                }
              />
              <Route exact path="/dashboard" render={() => <MediaCards />} />
              <Route exact path="/explore" render={() => <MediaCards />} />
              <Route exact path="/creator/:id" render={() => <CreatorPage />} />
              <Route
                exact
                path="/notifications"
                render={() => <Notifications />}
              />
              <Route exact path="/add/creator" render={() => <AddCreator />} />
            </div>
          </Paper>
        </ThemeProvider>
      </Router>
    );
  })
);

export default App;
