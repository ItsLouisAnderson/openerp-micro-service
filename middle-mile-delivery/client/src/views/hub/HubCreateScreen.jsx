import { FormControl, FormHelperText, Grid, InputLabel, Select, TextField } from "@mui/material";
import { request } from "api";
import SubmitButton from "components/button/SubmitButton";
import { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import LocationPicker from "react-leaflet-location-picker";
import MenuItem from "@mui/material/MenuItem";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function HubCreateScreen(props) {
    const type = props.type;
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: "",
        lat: 0,
        lon: 0,
        regionalHubId: 0
    });

    // Get list of regional hubs if creating a local hub
    const [regionalHubs, setRegionalHubs] = useState([]);
    useEffect(() => {
        if (type === 'local') {
            request("get", "/hub/regional", (res) => {
                setRegionalHubs(res.data);
                setFormData({...formData, regionalHubId: res.data[0].id});
            }).then();
        }
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert(JSON.stringify(formData));
        request(
            "post", 
            `/hub/${type}`, 
            () => alert("Hub has been created successfully"),
            () => alert("There was an error creating your hub. Please try again"),
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
            <h2>Create hub</h2>
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
                        <SubmitButton>Create</SubmitButton>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default HubCreateScreen;