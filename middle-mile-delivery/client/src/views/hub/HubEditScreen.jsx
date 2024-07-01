import { FormControl, FormHelperText, Grid, InputLabel, Select, TextField } from "@mui/material";
import { request } from "api";
import SubmitButton from "components/button/SubmitButton";
import { useEffect, useState, useRef } from "react";
import { Redirect, useParams } from "react-router-dom/cjs/react-router-dom";
import LocationPicker from "react-leaflet-location-picker";
import MenuItem from "@mui/material/MenuItem";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function HubEditScreen(props) {
    const type = props.type;

    let { id } = useParams(); 

    const history = useHistory();

    const [formData, setFormData] = useState({
        name: "",
        lat: 0,
        lon: 0,
        regionalHubId: 0
    });

    // Get list of regional hubs if editing a local hub
    const [regionalHubs, setRegionalHubs] = useState([]);
    useEffect(() => {
        request("get", `/hub/${type}/${id}`, (res) => {
            setFormData({
                name: res.data.name,
                lat: res.data.lat,
                lon: res.data.lon,
                regionalHubId: type === 'local' ? res.data.regionalHub.id : 0
            });
        }).then();
        if (type === 'local') {
            request("get", "/hub/regional", (res) => {
                setRegionalHubs(res.data);
            }).then();
        }
    }, [id, type])

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert(JSON.stringify(formData));
        request(
            "post", 
            `/hub/${type}/edit/${id}`, 
            () => alert("Hub has been edited successfully"),
            () => alert("There was an error editing your hub. Please try again"),
            formData)
        .then(() => history.push(`/hub/${type}`))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Configurations for location picker
    const pointMode = {
        banner: true,
        control: {
            values: [[formData.lat, formData.lon]],
            onClick: point => {
                setFormData({...formData, lat: point[0], lon: point[1]});
            }
        }
    }

    return (
        <div>
            <h2>Edit hub</h2>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth 
                            label="Name"
                            name="name"
                            id="name-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Latitude"
                            name="lat"
                            id="lat-input"
                            value={formData.lat}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Longitude"
                            name="lon"
                            value={formData.lon}
                            disabled
                        />
                    </Grid>
                    { 
                    type === "local" && 
                    (<Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="regional-hub-select-label">Regional hub</InputLabel>
                            <Select
                                labelId="regional-hub-select-label"
                                id="regional-hub-select"
                                name="regionalHubId"
                                value={formData.regionalHubId}
                                onChange={handleChange}
                                required
                            >
                                {regionalHubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )}
                            </Select>
                            <FormHelperText>Choose a regional hub that manages this local hub</FormHelperText>
                        </FormControl>
                    </Grid>)
                    }
                    <Grid item xs={12}>
                        <LocationPicker pointMode={pointMode} showInputs={false} showControls={false}/>
                    </Grid>
                    <Grid item xs={12}>
                        <SubmitButton>Save</SubmitButton>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default HubEditScreen;