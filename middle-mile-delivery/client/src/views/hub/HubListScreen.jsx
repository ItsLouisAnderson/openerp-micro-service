import React, {useEffect, useState} from "react";
import {request} from "../../api";
import { StandardTable } from "erp-hust/lib/StandardTable";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from '@mui/icons-material/Close';
import AddButton from "components/button/AddButton";
import PlaceIcon from "@mui/icons-material/Place";
import { Button, Grid } from "@mui/material";
import ConfirmDialog from "components/dialog/ConfirmDialog";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet-new'
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import L from 'leaflet';
import dayjs from 'dayjs';

function HubListScreen(props) {
    const mapMarkerIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
    })

    const type = props.type;
    const history = useHistory();

    const [hubs, setHubs] = useState([]);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        request("get", `/hub/${type}`, (res) => {
            setHubs(res.data);
        }).then();
    }, [type])

    const regionalColumns = [
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Creation time",
            field: "createdDate",
            render: (rowData) => (
                <div>{dayjs(rowData.createdDate).format('DD/MM/YYYY HH:mm')}</div>
            )
        },
        {
            title: "Edit",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => history.push(`/hub/regional/edit/${rowData.id}`)}
                    variant="contained"
                    color="success"
                >
                    <EditIcon/>
                </IconButton>
            ),
        },
        {
            title: "Delete",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => showDeleteDialog(rowData.id)}
                    variant="contained"
                    color="error"
                >
                    <DeleteIcon/>
                </IconButton>
            ),
        },
    ];

    const localColumns = [
        {
            title: "Name",
            field: "name",
        },
        {
            title: "Creation time",
            field: "createdDate",
            render: (rowData) => (
                <div>{dayjs(rowData.createdDate).format('DD/MM/YYYY HH:mm')}</div>
            )
        },
        {
            title: "Regional hub",
            field: "regionalHub.name",
        },
        {
            title: "Edit",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => history.push(`/hub/local/edit/${rowData.id}`)}
                    variant="contained"
                    color="success"
                >
                    <EditIcon/>
                </IconButton>
            ),
        },
        {
            title: "Delete",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => showDeleteDialog(rowData.id)}
                    variant="contained"
                    color="error"
                >
                    <DeleteIcon/>
                </IconButton>
            ),
        },
    ];

    const showDeleteDialog = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    }

    const onConfirmDelete = () => {
        request(
            "post", 
            `/hub/${type}/delete/${deleteId}`, 
            () => alert("Hub deleted successfully!"),
            () => alert("There was an error deleting your hub. Please try again"))
        .then(() => {
            setShowDelete(false);
            request("get", `/hub/${type}`, (res) => {
                setHubs(res.data);
            }).then();
        });
    }

    return (
        <div>
            <ConfirmDialog
                title="Delete hub"
                open={showDelete}
                setOpen={setShowDelete}
                onConfirm={onConfirmDelete}>
                    Are you sure you want to delete this hub?
            </ConfirmDialog>
            
            <Grid container spacing={2}>
                <Grid item>
                    <AddButton to={`/hub/${type}/create`}>Create hub</AddButton>
                </Grid>
                <Grid item>
                    {!showMap && <Button
                        variant="contained"
                        startIcon={<PlaceIcon/>}
                        onClick={() => setShowMap(true)}>
                            View on map
                    </Button>}
                    {showMap && <Button
                        variant="contained"
                        startIcon={<CloseIcon/>}
                        onClick={() => setShowMap(false)}>
                            Close map
                    </Button>}
                </Grid>
                <Grid item xs={12}>
                    {showMap && <MapContainer center={[16.56, 106.39]} zoom={6}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {hubs.map(item => 
                            <Marker key={item.id} position={[item.lat, item.lon]} icon={mapMarkerIcon}>
                                <Popup>
                                    {item.name}
                                </Popup>
                            </Marker>)
                        }
                    </MapContainer>}  
                    {!showMap && <StandardTable
                        title={type === "regional" ? "Regional Hubs" : "Local Hubs"}
                        columns={type === "regional" ? regionalColumns : localColumns}
                        data={hubs}
                        options={{
                            selection: false,
                            pageSize: 20,
                            search: true,
                            sorting: true,
                        }}
                    />}
                </Grid>
            </Grid>
            
        </div>
    )
}

export default HubListScreen;