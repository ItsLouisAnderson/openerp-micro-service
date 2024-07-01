import { useState } from "react";
import Select from "@mui/material/Select/Select";
import { Box, Chip, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup } from "@mui/material/index";
import { request } from "api";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import dayjs from 'dayjs';
import SubmitButton from "components/button/SubmitButton";
import { tripTypeDisplayValue, tripTypes } from "utils/TripType";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function TripCreateScreen(props) {

    const history = useHistory();

    const [formData, setFormData] = useState({
        startHubId: 0,
        endHubId: 0,
        truckId: "",
        startTime: dayjs().format('HH:mm'),
        startDate: dayjs().format('YYYY-MM-DD'),
        status: "PLANNED",
        type: "",
        orderIds: []
    });

    const [startHubs, setStartHubs] = useState([]);
    const [endHubs, setEndHubs] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [routeMsg, setRouteMsg] = useState("");
    const [trucks, setTrucks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [startTimes, setStartTimes] = useState([]);

    const [maxWeight, setMaxWeight] = useState(0);
    const [currentWeight, setCurrentWeight] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        request(
            "post", 
            `/trip/create`, 
            () => alert("Trip has been created successfully"),
            () => alert("There was an error creating your trip. Please try again"),
            formData)
        .then(() => history.push(`/trip/planned`))
    }

    const handleTypeChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        switch (value) {
            case "REGIONAL_TO_REGIONAL":
                request("get", "/hub/regional", (res) => {
                    setStartHubs(res.data);
                    setEndHubs(res.data);
                }).then();
                break;
            case "LOCAL_TO_REGIONAL":
                request("get", "/hub/all", (res) => {
                    setStartHubs(res.data.filter(item => 'regionalHub' in item));
                    setEndHubs(res.data.filter(item => !('regionalHub' in item)));
                }).then();
                break;
            case "REGIONAL_TO_LOCAL":
                request("get", "/hub/regional", (res) => {
                    setStartHubs(res.data);
                }).then();
                break;
            default:
                break;
        }
        setStartTimes([]);
        setTrucks([]);
        setOrders([]);
    }

    const handleStartHubChange = (e) => {
        const { value } = e.target;

        request("get", `/truck/get-by-hub/${value}`, (res) => {
            setTrucks(res.data);
        }).then();

        switch (formData.type) {
            case "REGIONAL_TO_REGIONAL":
                request("get", `/route/get-by-start-hub/${value}`, (res) => {
                    //alert(JSON.stringify(res.data));
                    setRoutes(res.data);
                }).then();
                setFormData({
                    ...formData,
                    startHubId: value,
                    endHubId: 0
                });
                setRouteMsg("")
                break;
            case "LOCAL_TO_REGIONAL":
                request("get", `/order/get-at-start-local-hub/${value}`, (res) => {
                    //alert(JSON.stringify(res.data))
                    setOrders(res.data);
                }).then();
                setFormData({
                    ...formData,
                    startHubId: value,
                    endHubId: startHubs.find(o => o.id === value).regionalHub.id
                });
                break;
            case "REGIONAL_TO_LOCAL":
                request("get", `/hub/local/get-by-regional-hub/${value}`, (res) => {
                    //alert(JSON.stringify(res.data));
                    setEndHubs(res.data);
                }).then();
                setFormData({
                    ...formData,
                    startHubId: value
                });
                break;
            default:
                break;
        }
    }

    const handleEndHubChange = (e) => {
        const { value } = e.target;
        setFormData({...formData, endHubId: value});

        switch (formData.type) {
            case "REGIONAL_TO_REGIONAL":
                let cur = routes.find(o => o.endHub.id === value);
                if (cur === undefined) {
                    setRouteMsg("There is currently no route set up for these hubs. Please create one.");
                    setStartTimes([]);
                } else {
                    setRouteMsg("Current route: " + cur.name + " (" + cur.startHub.name + " → " + cur.endHub.name + ")");
                    setStartTimes(cur.startTimes);
                }
                request("get", `/order/get-at-start-regional-hub/${formData.startHubId}/${value}`, (res) => {
                    setOrders(res.data);
                }).then();
                break;
            case "REGIONAL_TO_LOCAL":
                request("get", `/order/get-at-end-regional-hub/${value}`, (res) => {
                    //alert(JSON.stringify(res.data))
                    setOrders(res.data);
                }).then();
                break;
            default:
                break;
        }
    }

    const handleTruckChange = (e) => {
        const { value } = e.target;
        setFormData({...formData, truckId: value});

        let truck = trucks.find(o => o.licensePlate === value);
        setMaxWeight(truck.maxWeight);
    }

    const handleOrderChange = (e) => {
        const { value } = e.target;
        setFormData({...formData, orderIds: value});

        let newCurrentWeight = 0;
        for (let i = 0; i < value.length; i++) {
            let order = orders.find(o => o.id === value[i]);
            newCurrentWeight += order.weight;
        }
        setCurrentWeight(newCurrentWeight);
    }

    return (
        <div>
            <h2>Create new trip</h2>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <FormLabel id="trip-type-label">Trip type</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="trip-type-label"
                                name="type"
                                value={formData.type}
                                onChange={handleTypeChange}
                                required
                            >
                                {tripTypes.map(type =>
                                    <FormControlLabel
                                        value={type}
                                        control={<Radio />}
                                        label={tripTypeDisplayValue(type)}
                                    />
                                )}
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="start-hub-select-label">Start hub</InputLabel>
                            <Select
                                labelId="start-hub-select-label"
                                id="start-hub-select"
                                name="startHubId"
                                value={formData.startHubId}
                                onChange={handleStartHubChange}
                                required
                            >
                                {startHubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="end-hub-select-label">End hub</InputLabel>
                            <Select
                                labelId="end-hub-select-label"
                                id="end-hub-select"
                                name="endHubId"
                                value={formData.endHubId}
                                onChange={handleEndHubChange}
                                required
                                disabled={formData.type === "LOCAL_TO_REGIONAL"}
                            >
                                {endHubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    {formData.type === "REGIONAL_TO_REGIONAL" && routeMsg !== "" &&
                        <Grid item xs={12}>
                            {routeMsg}
                        </Grid>
                    }
                    <Grid item xs={6}>
                        <DesktopDatePicker
                            sx={{ width: '100%' }}
                            label="Start date"
                            value={dayjs(formData.startDate)}
                            onChange={(newValue) => setFormData({...formData, startDate: newValue.format("YYYY-MM-DD")})}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {formData.type === "REGIONAL_TO_REGIONAL" && 
                            <FormControl fullWidth>
                                <InputLabel id="start-time-select-label">Start time</InputLabel>
                                <Select
                                    labelId="start-time-select-label"
                                    id="start-time-select"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                >
                                    {startTimes.map(item => 
                                        <MenuItem key={item} value={item}>{item}</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        }
                        {formData.type !== "REGIONAL_TO_REGIONAL" &&
                            <DesktopTimePicker
                                sx={{ width: '100%' }}
                                label="Start time"
                                value={dayjs(formData.startTime)}
                                onChange={(newValue) => setFormData({...formData, startTime: newValue.format("HH:mm")})}
                                required
                            />
                        }
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="truck-select-label">Truck</InputLabel>
                            <Select
                                labelId="truck-select-label"
                                id="truck-select"
                                name="truckId"
                                value={formData.truckId}
                                onChange={handleTruckChange}
                                required
                            >
                                {trucks.map(item => 
                                    <MenuItem key={item.licensePlate} value={item.licensePlate}>
                                        {item.licensePlate + ": " + item.maxWeight + " kg"}
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="orders-select-label">Orders</InputLabel>
                            <Select 
                                labelId="orders-select-label"
                                id="orders-select"
                                name="orderIds"
                                value={formData.orderIds}
                                onChange={handleOrderChange}
                                multiple
                                required
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value} />
                                        ))}
                                    </Box>
                                )}
                            >
                                {orders.map(item => 
                                    <MenuItem 
                                        key={item.id} 
                                        value={item.id}
                                        disabled={
                                            !(formData.orderIds.indexOf(item.id) > -1) &&
                                            (currentWeight + item.weight > maxWeight)
                                        }
                                    >
                                        <Checkbox checked={formData.orderIds.indexOf(item.id) > -1} />
                                        <ListItemText primary={"Order ID " + item.id} secondary={
                                            <div>
                                                <div>{item.weight} kg</div>
                                                <div>
                                                    {item.startHub.name + " → " +
                                                    item.startHub.regionalHub.name + " → " +
                                                    item.endHub.regionalHub.name + " → " +
                                                    item.endHub.name}
                                                </div>
                                            </div>
                                        }/>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        Current weight: {currentWeight} kg
                    </Grid>
                    <Grid item xs={12}>
                        <SubmitButton>Create</SubmitButton>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default TripCreateScreen;