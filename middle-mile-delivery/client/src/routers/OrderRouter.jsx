import { Route, Switch, useRouteMatch } from "react-router";
import OrderCreateScreen from "views/order/OrderCreateScreen";
import OrderDetailsScreen from "views/order/OrderDetailsScreen";
import OrderEditScreen from "views/order/OrderEditScreen";
import OrderListScreen from "views/order/OrderListScreen";
import OrderTrackScreen from "views/order/OrderTrackScreen";

export default function OrderRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route exact path={`${path}/track`}>
                    <OrderTrackScreen />
                </Route>
                <Route exact path={`${path}/details/:id`}>
                    <OrderDetailsScreen />
                </Route>
                <Route exact path={`${path}/create`}>
                    <OrderCreateScreen />
                </Route>
                <Route exact path={`${path}/all`}>
                    <OrderListScreen />
                </Route>
                <Route exact path={`${path}/edit/:id`}>
                    <OrderEditScreen />
                </Route>
            </Switch>
        </div>
    )
}