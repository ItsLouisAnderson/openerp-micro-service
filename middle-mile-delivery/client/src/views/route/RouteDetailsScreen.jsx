import { request } from "api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import BadgeIcon from '@mui/icons-material/Badge';
import StartIcon from '@mui/icons-material/Start';
import TourIcon from '@mui/icons-material/Tour';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { MapContainer } from "../../../node_modules/react-leaflet-new/lib/MapContainer";
import { TileLayer } from "../../../node_modules/react-leaflet-new/lib/TileLayer";
import L from 'leaflet';
import { Marker } from "../../../node_modules/react-leaflet-new/lib/Marker";
import { Popup } from "../../../node_modules/react-leaflet-new/lib/Popup";
import { Polyline } from "../../../node_modules/react-leaflet-new/lib/Polyline";

function RouteDetailsScreen(props) {
    const mapMarkerIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
    })

    let { id } = useParams();

    const history = useHistory();

    const [route, setRoute] = useState({
        name: "",
        startHub: {
            name: "",
            lat: 0,
            lon: 0
        },
        endHub: {
            name: "",
            lat: 0,
            lon: 0,
        },
        startTimes: []
    });

    useEffect(() => {
        request("get", `/route/${id}`, (res) => {
            setRoute({
                name: res.data.name,
                startHub: {
                    name: res.data.startHub.name,
                    lat: res.data.startHub.lat,
                    lon: res.data.startHub.lon
                },
                endHub: {
                    name: res.data.endHub.name,
                    lat: res.data.endHub.lat,
                    lon: res.data.endHub.lon
                },
                startTimes: res.data.startTimes
            });
        }).then();
    }, [id]);

    return (
        <div>
            <h2>Route details</h2>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <h3>Information</h3>
                    <List sx={{ width: '100%' }}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <BadgeIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Name" secondary={route.name} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <StartIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Start hub" secondary={route.startHub.name}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <TourIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="End hub" secondary={route.endHub.name}/>
                        </ListItem>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar>
                                    <AccessTimeIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary="Start times" 
                                secondary={
                                    <div>
                                        {route.startTimes.map(item => <div>{item}</div>)}
                                    </div>
                                }
                            />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <h3>Route map</h3>
                    <MapContainer center={[16.56, 106.39]} zoom={6}>
                        <TileLayer 
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[route.startHub.lat, route.startHub.lon]} icon={mapMarkerIcon}>
                            <Popup>{'Start: ' + route.startHub.name}</Popup>
                        </Marker>
                        <Marker position={[route.endHub.lat, route.endHub.lon]} icon={mapMarkerIcon}>
                            <Popup>{'Start: ' + route.endHub.name}</Popup>
                        </Marker>
                        <Polyline
                            pathOptions={{ color: 'red' }}
                            positions={[
                                [route.startHub.lat, route.startHub.lon],
                                [route.endHub.lat, route.endHub.lon]
                            ]}
                        />
                    </MapContainer>
                </Grid>
            </Grid>
        </div>
    )
}

export default RouteDetailsScreen;