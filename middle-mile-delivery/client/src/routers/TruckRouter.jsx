import { Route, Switch, useRouteMatch } from "react-router";
import TruckCreateScreen from "views/truck/TruckCreateScreen";
import TruckListScreen from "views/truck/TruckListScreen";

export default function TruckRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={`${path}`}>
                    <TruckListScreen />
                </Route>
                <Route exact path={`${path}/create`}>
                    <TruckCreateScreen />
                </Route>
            </Switch>
        </div>
    )
}