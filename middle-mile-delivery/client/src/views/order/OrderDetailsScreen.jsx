import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { request } from "api";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScaleIcon from '@mui/icons-material/Scale';
import StartIcon from '@mui/icons-material/Start';
import TourIcon from '@mui/icons-material/Tour';
import { orderStatuses } from "utils/OrderStatus";
import L from 'leaflet';
import { MapContainer } from "../../../node_modules/react-leaflet-new/lib/MapContainer";
import { TileLayer } from "../../../node_modules/react-leaflet-new/lib/TileLayer";
import { Marker } from "../../../node_modules/react-leaflet-new/lib/Marker";
import { Popup } from "../../../node_modules/react-leaflet-new/lib/Popup";
import { Polyline } from "../../../node_modules/react-leaflet-new/lib/Polyline";
import dayjs from "dayjs";

function OrderDetailsScreen(props) {
    const mapMarkerIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
    })

    const truckMarkerIcon = L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Delivery_Truck_Flat_Icon_Vector.svg',
        iconSize: [75, 85],
        popupAnchor: [0, -41],
    })

    const packageMarkerIcon = L.icon({
        iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Breathe-package-x-generic.svg',
        iconSize: [40, 40],
        popupAnchor: [0, -41],
    })

    let { id } = useParams();

    if (props.orderId !== undefined) {
        id = props.orderId;
    }

    const history = useHistory();

    const [order, setOrder] = useState({
        description: "",
        createdDate: "",
        weight: 0,
        startLocalHub: {
            name: "",
            lat: 0,
            lon: 0
        },
        startRegionalHub: {
            name: "",
            lat: 0,
            lon: 0
        },
        endLocalHub: {
            name: "",
            lat: 0,
            lon: 0
        },
        endRegionalHub: {
            name: "",
            lat: 0,
            lon: 0
        },
        status: orderStatuses[0],
        trip: false
    });

    useEffect(() => {
        request("get", `/order/${id}`, (res) => {
            setOrder({
                description: res.data.description,
                createdDate: res.data.createdDate,
                weight: res.data.weight,
                startLocalHub: {
                    name: res.data.startHub.name,
                    lat: res.data.startHub.lat,
                    lon: res.data.startHub.lon
                },
                startRegionalHub: {
                    name: res.data.startHub.regionalHub.name,
                    lat: res.data.startHub.regionalHub.lat,
                    lon: res.data.startHub.regionalHub.lon
                },
                endLocalHub: {
                    name: res.data.endHub.name,
                    lat: res.data.endHub.lat,
                    lon: res.data.endHub.lon
                },
                endRegionalHub: {
                    name: res.data.endHub.regionalHub.name,
                    lat: res.data.endHub.regionalHub.lat,
                    lon: res.data.endHub.regionalHub.lon
                },
                status: res.data.status,
                trip: res.data.trip == null ? false : true
            });
        }).then();
    }, [id, props.orderId]);

    const statusSteps = [
        {
            label: "Arrived at starting local hub",
            description: "The order has arrived at " + order.startLocalHub.name 
        },
        {
            label: "Transporting to starting regional hub",
            description: "The order is being transported to " + order.startRegionalHub.name
        },
        {
            label: "Arrived at starting regional hub",
            description: "The order has arrived at " + order.startRegionalHub.name
        },
        {
            label: "Transporting to ending regional hub",
            description: "The order is being transferred to " + order.endRegionalHub.name
        },
        {
            label: "Arrived at ending regional hub",
            description: "The order has arrived at " + order.endRegionalHub.name
        },
        {
            label: "Transporting to ending local hub",
            description: "The order is being transported to " + order.endLocalHub.name
        },
        {
            label: "Arrived at ending local hub",
            description: "The order has arrived at " + order.endLocalHub.name
        }
    ];

    const activeStep = orderStatuses.indexOf(order.status);

    const orderPosition = order => {
        switch (order.status) {
            case "AT_START_LOCAL_HUB":
            default:
                return [order.startLocalHub.lat, order.startLocalHub.lon];
            case "TRANSPORTING_TO_START_REGIONAL_HUB":
                return [
                    (order.startLocalHub.lat + order.startRegionalHub.lat) / 2,
                    (order.startLocalHub.lon + order.startRegionalHub.lon) / 2
                ];
            case "AT_START_REGIONAL_HUB":
                return [order.startRegionalHub.lat, order.startRegionalHub.lon];
            case "TRANSPORTING_TO_END_REGIONAL_HUB":
                return [
                    (order.startRegionalHub.lat + order.endRegionalHub.lat) / 2, 
                    (order.startRegionalHub.lon + order.endRegionalHub.lon) / 2
                ];
            case "AT_END_REGIONAL_HUB":
                return [order.endRegionalHub.lat, order.endRegionalHub.lon];
            case "TRANSPORTING_TO_END_LOCAL_HUB":
                return [
                    (order.endLocalHub.lat + order.endRegionalHub.lat) / 2,
                    (order.endLocalHub.lon + order.endRegionalHub.lon) / 2
                ];
            case "AT_END_LOCAL_HUB":
                return [order.endLocalHub.lat, order.endLocalHub.lon];
        }
    }

    return (
        <div>
            <h2>Order details</h2>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <h3>Information</h3>
                    <List sx={{ width: '100%' }}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <CalendarMonthIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Created date" secondary={dayjs(order.createdDate).format("DD/MM/YYYY HH:mm")}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <DescriptionIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Description" secondary={order.description}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <ScaleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Total weight" secondary={order.weight + " kg"}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <StartIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Start hub" secondary={order.startLocalHub.name}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <TourIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="End hub" secondary={order.endLocalHub.name}/>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <h3>Status</h3>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {statusSteps.map((step, index) => (
                            <Step key={step.label}>
                                <StepLabel>
                                    {step.label}
                                </StepLabel>
                                <StepContent>
                                    <Typography>{step.description}</Typography>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
                <Grid item xs={12}>
                    <h3>Tracking map</h3>
                    <MapContainer center={[16.56, 106.39]} zoom={6}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker 
                            position={[order.startLocalHub.lat, order.startLocalHub.lon]} 
                            icon={
                                order.status === "AT_START_LOCAL_HUB" ?
                                packageMarkerIcon : 
                                mapMarkerIcon
                            }
                        >
                            <Popup>{order.startLocalHub.name}</Popup>
                        </Marker>
                        <Marker 
                            position={[order.startRegionalHub.lat, order.startRegionalHub.lon]} 
                            icon={
                                order.status === "AT_START_REGIONAL_HUB" ?
                                packageMarkerIcon : 
                                mapMarkerIcon
                            }
                        >
                            <Popup>{order.startRegionalHub.name}</Popup>
                        </Marker>
                        <Marker 
                            position={[order.endLocalHub.lat, order.endLocalHub.lon]} 
                            icon={
                                order.status === "AT_END_LOCAL_HUB" ?
                                packageMarkerIcon : 
                                mapMarkerIcon
                            }
                        >
                            <Popup>{order.endLocalHub.name}</Popup>
                        </Marker>
                        <Marker 
                            position={[order.endRegionalHub.lat, order.endRegionalHub.lon]} 
                            icon={
                                order.status === "AT_END_REGIONAL_HUB" ?
                                packageMarkerIcon : 
                                mapMarkerIcon
                            }
                        >
                            <Popup>{order.endRegionalHub.name}</Popup>
                        </Marker>
                        {order.status.includes("TRANSPORTING") ? <Marker
                            icon={truckMarkerIcon}
                            position={orderPosition(order)}
                        /> : null}
                        <Polyline
                            pathOptions={{ color: 'red' }}
                            positions={[
                                [order.startLocalHub.lat, order.startLocalHub.lon],
                                [order.startRegionalHub.lat, order.startRegionalHub.lon]
                            ]}
                        />
                        <Polyline
                            pathOptions={{ color: 'red' }}
                            positions={[
                                [order.startRegionalHub.lat, order.startRegionalHub.lon],
                                [order.endRegionalHub.lat, order.endRegionalHub.lon]
                            ]}
                        />
                        <Polyline
                            pathOptions={{ color: 'red' }}
                            positions={[
                                [order.endRegionalHub.lat, order.endRegionalHub.lon],
                                [order.endLocalHub.lat, order.endLocalHub.lon]
                            ]}
                        />
                    </MapContainer>
                </Grid>
            </Grid>
            
        </div>
    )
}

export default OrderDetailsScreen;