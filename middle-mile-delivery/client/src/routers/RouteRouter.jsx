import { Route, Switch, useRouteMatch } from "react-router";
import RouteCreateScreen from "views/route/RouteCreateScreen";
import RouteDetailsScreen from "views/route/RouteDetailsScreen";
import RouteListScreen from "views/route/RouteListScreen";

export default function RouteRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={`${path}`}>
                    <RouteListScreen />
                </Route>
                <Route exact path={`${path}/details/:id`}>
                    <RouteDetailsScreen />
                </Route>
                <Route exact path={`${path}/create`}>
                    <RouteCreateScreen />
                </Route>
            </Switch>
        </div>
    )
}