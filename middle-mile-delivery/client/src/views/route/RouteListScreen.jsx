import { Grid, IconButton } from "@mui/material";
import { request } from "api";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from "@mui/icons-material/Delete";
import AddButton from "components/button/AddButton";
import PlaceIcon from "@mui/icons-material/Place";
import CloseIcon from '@mui/icons-material/Close';
import { StandardTable } from "erp-hust/lib/StandardTable";
import ConfirmDialog from "components/dialog/ConfirmDialog";
import { Button } from "../../../node_modules/@mui/material/index";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet-new';
import L from 'leaflet';

function RouteListScreen(props) {
    const mapMarkerIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12.5, 41],
        popupAnchor: [0, -41],
    })

    const history = useHistory();

    const [routes, setRoutes] = useState([]);
    const [regionalHubs, setRegionalHubs] = useState([]);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        request("get", `/route/all`, (res) => {
            setRoutes(res.data);
        }).then();
        request("get", "/hub/regional", (res) => {
            setRegionalHubs(res.data);
        }).then();
    }, []);

    const columns = [
        {
            title: "Name",
            field: "name"
        },
        {
            title: "Start Hub",
            field: "startHub.name"
        },
        {
            title: "End Hub",
            field: "endHub.name"
        },
        {
            title: "Details",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => history.push(`/route/details/${rowData.id}`)}
                    variant="contained"
                    color="success"
                >
                    <VisibilityIcon />
                </IconButton>
            )
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
        }
    ];

    const showDeleteDialog = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    }

    const onConfirmDelete = () => {
        request(
            "post", 
            `/route/delete/${deleteId}`, 
            () => alert("Route deleted successfully!"),
            () => alert("There was an error creating your route. Please try again"))
        .then(() => {
            setShowDelete(false);
            request("get", `/route/all`, (res) => {
                setRoutes(res.data);
            }).then();
        });
    }

    return (
        <div>
            <ConfirmDialog
                title="Delete route"
                open={showDelete}
                setOpen={setShowDelete}
                onConfirm={onConfirmDelete}>
                    Are you sure you want to delete this route?
            </ConfirmDialog>

            <Grid container spacing={2}>
                <Grid item>
                    <AddButton to={`/route/create`}>Create route</AddButton>
                </Grid>
                <Grid item>
                    {!showMap && <Button
                        variant="contained"
                        startIcon={<PlaceIcon />}
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
                        {regionalHubs.map(item => 
                            <Marker key={item.id} position={[item.lat, item.lon]} icon={mapMarkerIcon}>
                                <Popup>
                                    {item.name}
                                </Popup>
                            </Marker>
                        )}
                        {routes.map(item =>
                            <Polyline 
                                pathOptions={{ color: 'red' }}
                                positions={[
                                    [item.startHub.lat, item.startHub.lon],
                                    [item.endHub.lat, item.endHub.lon]
                                ]}
                            />
                        )}
                    </MapContainer>}
                    {!showMap && <StandardTable
                        title="Routes"
                        columns={columns}
                        data={routes}
                        options={{
                            selection: false,
                            pageSize: 20,
                            search: true,
                            sorting: true
                        }}
                    />}
                </Grid>
            </Grid>
        </div>
    )
}

export default RouteListScreen;