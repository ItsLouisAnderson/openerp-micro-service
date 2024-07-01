import TripCreateScreen from "views/trip/TripCreateScreen";
import { Route, Switch, useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";
import TripListScreen from "views/trip/TripListScreen";
import TripDetailsScreen from "views/trip/TripDetailsScreen";

export default function TripRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={`${path}/planned`}>
                    <TripListScreen type="PLANNED"/>
                </Route>
                <Route exact path={`${path}/departed`}>
                    <TripListScreen type="DEPARTED"/>
                </Route>
                <Route exact path={`${path}/arrived`}>
                    <TripListScreen type="ARRIVED"/>
                </Route>
                <Route exact path={`${path}/details/:id`}>
                    <TripDetailsScreen />
                </Route>
                <Route exact path={`${path}/create`}>
                    <TripCreateScreen />
                </Route>
            </Switch>
        </div>
    )
}