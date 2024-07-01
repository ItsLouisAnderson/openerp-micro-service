import { Route, Switch, useRouteMatch } from "react-router";
import HubCreateScreen from "views/hub/HubCreateScreen";
import HubListScreen from "views/hub/HubListScreen";
import HubEditScreen from "views/hub/HubEditScreen";

export default function HubRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={`${path}/regional`}>
                    <HubListScreen type="regional" />
                </Route>
                <Route exact path={`${path}/regional/create`}>
                    <HubCreateScreen type="regional" />
                </Route>
                <Route exact path={`${path}/regional/edit/:id`}>
                    <HubEditScreen type="regional" />
                </Route>
                <Route exact path={`${path}/local`}>
                    <HubListScreen type="local" />
                </Route>
                <Route exact path={`${path}/local/create`}>
                    <HubCreateScreen type="local" />
                </Route>
                <Route exact path={`${path}/local/edit/:id`}>
                    <HubEditScreen type="local" />
                </Route>
            </Switch>
        </div>
    )
}