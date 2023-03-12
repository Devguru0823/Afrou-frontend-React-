import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import asyncComponent from '../utils/AsyncComponent';
import NotFound from "../containers/ErrorPages/NotFound/NotFound";

const App = ({ match, user }) => {
  let routes = (
    <Switch>
      <Route path={`${match.url}afroswagger`} component={asyncComponent(() => import('./Afroswagger/Afroswagger'))} />
      {/* <Route path={`${match.url}afrotalent`} component={asyncComponent(() => import('./Afrotalent/Afrotalent'))}/> */}
      {/*<Route path={`${match.url}afromarket`} exact component={asyncComponent(() => import('./Afromarket/Afromarket'))/> */}
      <Route path={`${match.url}afromarket/:itemId`} component={asyncComponent(() => import('./Afromarket/ItemDetail'))} />
      <Route path={`${match.url}afrogroup`} exact component={asyncComponent(() => import('./Afrogroup/Afrogroup'))} />
      <Route path={`${match.url}afrogroup/:groupId`} component={asyncComponent(() => import('./Afrogroup/GroupFeed'))} />
      <Route path={`${match.url}profile`} exact component={asyncComponent(() => import('./Profile/Profile'))} />
      <Route path={`${match.url}profile/photos`} exact component={asyncComponent(() => import('./Profile/Photos'))} />
      <Route path={`${match.url}profile/:id/photos`} exact
        component={asyncComponent(() => import('./Profile/Photos'))} />
      <Route path={`${match.url}profile/settings`} component={asyncComponent(() => import('./Profile/Settings'))} />
      <Route path={`${match.url}find-friends`} exact component={asyncComponent(() => import('./Profile/FindFriends'))} />
      <Route path={`${match.url}find-groups`} exact component={asyncComponent(() => import('./Afrogroup/FindGroups'))} />
      <Route path={`${match.url}profile/:id`} exact component={asyncComponent(() => import('./Profile/Profile'))} />
      <Route
        path={`${match.url}notifications`}
        component={asyncComponent(() => import('./Notifications/Notifications'))}
      />
      <Route path={`${match.url}messages`} exact component={asyncComponent(() => import('./Messages/MessageList'))} />
      <Route
        path={`${match.url}messages/conversation/:messageId`}
        component={asyncComponent(() => import('./Messages/MessageDetail/MessageDetail'))}
      />
      <Route path={`${match.url}friends`} exact component={asyncComponent(() => import('./RoleModels/RoleModels'))} />
      <Route path={`${match.url}followings`} exact component={asyncComponent(() => import('./Following/Following'))} />
      <Route path={`${match.url}followers`} exact component={asyncComponent(() => import('./Followers/Followers'))} />
      <Route
        path={`${match.url}advertisements/request`}
        component={asyncComponent(() => import('./Advertisements/RequestAdvertisement'))}
      />
      <Route path={`${match.url}post/:postId`} component={asyncComponent(() => import('./PostDetail/PostDetail'))} />
      <Route path={`${match.url}advert`} component={asyncComponent(() => import('./Advert/Advert'))} />
      <Route path={`${match.url}introduction`} exact
        component={asyncComponent(() => import('./Introduction/Introduction'))} />
      <Route path={`${match.url}hashtags`} exact component={asyncComponent(() => import('./Explore/Explore'))} />
      <Route path={`${match.url}hashtags/:details`} component={asyncComponent(() => import('./Explore/HashDetails'))} />
      <Redirect to="/not-found" component={NotFound} />
    </Switch>
  );

  if (user && user.introduced === false) {
    routes = (
      <Switch>
        <Route
          path={`${match.url}introduction`} exact
          component={asyncComponent(() => import('./Introduction/Introduction'))}
        />
        <Redirect to="/introduction" />
      </Switch>
    );
  }

  return routes;
};

export default App;
