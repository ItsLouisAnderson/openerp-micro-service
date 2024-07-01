import AddButton from "components/button/AddButton";
import { Grid } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { request } from "api";
import { StandardTable } from "erp-hust/lib/StandardTable/index";
import dayjs from 'dayjs';
import { tripTypeDisplayValue } from "utils/TripType";
import Snackbar from '@mui/material/Snackbar';
import Alert from "@mui/material/Alert";
import StartIcon from '@mui/icons-material/Start';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';

function TripListScreen(props) {
    const type = props.type;

    const history = useHistory();

    const [trips, setTrips] = useState([]);

    useEffect(() => {
        request("get", `/trip/${type.toLowerCase()}`, (res) => {
            setTrips(res.data)
        }).then();
    }, [props.type]);

    const depart = (id) => {
        request(
            "post", 
            `/trip/depart/${id}`, 
            () => {setOpenSuccess(true)},
            () => {setOpenError(true)}
        ).then(() => {
            request("get", `/trip/${type.toLowerCase()}`, (res) => {
                setTrips(res.data)
            }).then();    
        });
    }

    const arrive = (id) => {
        request(
            "post", 
            `/trip/arrive/${id}`, 
            () => {setOpenSuccess(true)},
            () => {setOpenError(true)}
        ).then(() => {
            request("get", `/trip/${type.toLowerCase()}`, (res) => {
                setTrips(res.data)
            }).then();    
        })
    }

    const cancel = (id) => {
        request(
            "post", 
            `/trip/cancel/${id}`, 
            () => {setOpenSuccess(true)},
            () => {setOpenError(true)}
        ).then(() => {
            request("get", `/trip/${type.toLowerCase()}`, (res) => {
                setTrips(res.data)
            }).then();    
        })
    }

    const plannedColumns = [
        {
            title: "Start date",
            field: "startDate",
            render: (rowData) => dayjs(rowData.startDate).format("DD/MM/YYYY")
        },
        {
            title: "Start time",
            field: "startTime"
        },
        {
            title: "Type",
            field: "type",
            render: (rowData) => tripTypeDisplayValue(rowData.type)
        },
        {
            title: "Truck",
            field: "truck.licensePlate"
        },
        {
            title: "Start hub",
            field: "startHub.name"
        },
        {
            title: "End hub",
            field: "endHub.name"
        },
        {
            title: "Details",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => history.push(`/trip/details/${rowData.id}`)}
                    variant="contained"
                    color="success"
                >
                    <VisibilityIcon />
                </IconButton>
            )
        },
        {
            title: "Depart",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => depart(rowData.id)}
                    variant="contained"
                    color="success"
                >
                    <StartIcon />
                </IconButton>
            )
        },
        {
            title: "Cancel",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => cancel(rowData.id)}
                    variant="contained"
                    color="error"
                >
                    <CancelIcon />
                </IconButton>
            )
        }
    ];

    const departedColumns = [
        {
            title: "Start date",
            field: "startDate",
            render: (rowData) => dayjs(rowData.startDate).format("DD/MM/YYYY")
        },
        {
            title: "Start time",
            field: "startTime"
        },
        {
            title: "Type",
            field: "type",
            render: (rowData) => tripTypeDisplayValue(rowData.type)
        },
        {
            title: "Truck",
            field: "truck.licensePlate"
        },
        {
            title: "Start hub",
            field: "startHub.name"
        },
        {
            title: "End hub",
            field: "endHub.name"
        },
        {
            title: "Details",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => history.push(`/trip/details/${rowData.id}`)}
                    variant="contained"
                    color="success"
                >
                    <VisibilityIcon />
                </IconButton>
            )
        },
        {
            title: "Arrive",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => arrive(rowData.id)}
                    variant="contained"
                    color="success"
                >
                    <CheckCircleIcon />
                </IconButton>
            )
        },
        {
            title: "Cancel",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => cancel(rowData.id)}
                    variant="contained"
                    color="error"
                >
                    <CancelIcon />
                </IconButton>
            )
        }
    ];

    const arrivedColumns = [
        {
            title: "Start date",
            field: "startDate",
            render: (rowData) => dayjs(rowData.startDate).format("DD/MM/YYYY")
        },
        {
            title: "Start time",
            field: "startTime"
        },
        {
            title: "Type",
            field: "type",
            render: (rowData) => tripTypeDisplayValue(rowData.type)
        },
        {
            title: "Truck",
            field: "truck.licensePlate"
        },
        {
            title: "Start hub",
            field: "startHub.name"
        },
        {
            title: "End hub",
            field: "endHub.name"
        }
    ];

    const getColumns = (type) => {
        switch (type) {
            case "PLANNED":
                return plannedColumns;
            case "DEPARTED":
                return departedColumns;
            case "ARRIVED":
                return arrivedColumns;
            default:
                return null;
        }
    }

    const title = (type) => {
        switch (type) {
            case "PLANNED":
                return "Planned Trips";
            case "DEPARTED":
                return "Departed Trips";
            case "ARRIVED":
                return "Arrived Trips";
            default:
                return "Trips";
        }
    }

    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccess(false);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenError(false);
    };

    return (
        <div>
            <Snackbar open={openSuccess} onClose={handleCloseSuccess} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="success" variant="filled" sx={{ width: '100%' }}>
                    Operation completed successfully!
                </Alert>
            </Snackbar>
            <Snackbar open={openError} onClose={handleCloseError} autoHideDuration={6000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert severity="error" variant="filled" sx={{ width: '100%' }}>
                    There was an error performing your operation.
                </Alert>
            </Snackbar>
            <Grid container spacing={2}>
                <Grid item>
                    <AddButton to="/trip/create">Create trip</AddButton>
                </Grid>
                <Grid item xs={12}>
                    <StandardTable
                        title={title(type)}
                        columns={getColumns(type)}
                        data={trips}
                        options={{
                            selection: false,
                            pageSize: 20,
                            search: true,
                            sorting: true,
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

export default TripListScreen;