import { request } from "api";
import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { tripStatuses } from "utils/TripStatus";
import { Avatar, Grid, List, ListItem, ListItemAvatar, ListItemText, Paper, Step, StepContent, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "../../../node_modules/@mui/material/index";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import StartIcon from '@mui/icons-material/Start';
import TourIcon from '@mui/icons-material/Tour';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import dayjs from 'dayjs';
import { tripTypeDisplayValue } from "utils/TripType";

function TripDetailsScreen(props) {
    let { id } = useParams();

    const history = useHistory();

    const [trip, setTrip] = useState({
        type: "",
        startHub: { name: "" },
        endHub: { name: "" },
        startTime: "",
        startDate: "",
        status: "",
        truck: { licensePlate: "", maxWeight: 0 },
        orders: []
    });

    useEffect(() => {
        request("get", `/trip/${id}`, (res) => {
            setTrip({
                type: res.data.type,
                startHub: { name: res.data.startHub.name },
                endHub: { name: res.data.endHub.name },
                startTime: res.data.startTime,
                startDate: res.data.startDate,
                status: res.data.status,
                truck: { licensePlate: res.data.truck.licensePlate, maxWeight: res.data.truck.maxWeight },
                orders: res.data.orders
            });
        }).then();
    }, [id]);

    const statusSteps = [
        {
            label: "Planned",
            description: "The trip has been planned"
        },
        {
            label: "Departed",
            description: "The trip has departed to its destination"
        },
        {
            label: "Arrived",
            description: "The trip has arrived at its destination"
        },
        {
            label: "Canceled",
            description: "The trip has been canceled"
        }
    ]

    const activeStep = tripStatuses.indexOf(trip.status);

    return (
        <div>
            <h2>Trip details</h2>
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
                            <ListItemText primary="Start date" secondary={dayjs(trip.startDate).format("DD/MM/YYYY")} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <AccessTimeIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Start time" secondary={trip.startTime} />
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <MultipleStopIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Type" secondary={tripTypeDisplayValue(trip.type)}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <StartIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Start hub" secondary={trip.startHub.name}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <TourIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="End hub" secondary={trip.endHub.name}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <LocalShippingIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="Truck" secondary={trip.truck.licensePlate + ' (' + trip.truck.maxWeight + ' kg)'}/>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <h3>Status</h3>
                    <Stepper activeStep={activeStep} orientation="vertical">
                        {statusSteps.map((step, index) => (
                            <Step key="step.label">
                                <StepLabel>{step.label}</StepLabel>
                                <StepContent>
                                    <Typography>{step.description}</Typography>
                                </StepContent>
                            </Step>
                        ))}
                    </Stepper>
                </Grid>
                <Grid item xs={12}>
                    <h3>Orders</h3>
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Weight&nbsp;(kg)</TableCell>
                                    <TableCell>Start&nbsp;hub</TableCell>
                                    <TableCell>End&nbsp;hub</TableCell>
                                    <TableCell>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {trip.orders.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.weight}</TableCell>
                                        <TableCell>{item.startHub.name}</TableCell>
                                        <TableCell>{item.endHub.name}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </div>
    )
}

export default TripDetailsScreen;