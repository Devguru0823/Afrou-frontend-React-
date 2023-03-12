import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import ErrorBoundary from "./utils/ErrorBoundary";
import configureStore from "./redux/store/store";
import App from "./containers/App/App";
import Apple_app_site_assocition from "./components/Apple-app-site-assocition";

class NextApp extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Provider store={configureStore}>
          <BrowserRouter>
            <Switch>
              <Route
                path="/.well-known/apple-app-site-association"
                exact
                component={Apple_app_site_assocition}
              />
              <Route path="/" component={App} />
            </Switch>
          </BrowserRouter>
        </Provider>
      </ErrorBoundary>
    );
  }
}

export default NextApp;
