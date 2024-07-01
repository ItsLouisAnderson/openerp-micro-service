import { Box, Checkbox, Chip, FormControl, FormHelperText, Grid, InputLabel, ListItemText, Select, TextField } from "@mui/material";
import { request } from "api";
import SubmitButton from "components/button/SubmitButton";
import { useEffect, useState, useRef } from "react";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function RouteCreateScreen(props) {
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: "",
        startHubId: 0,
        endHubId: 0,
        startTimes: []
    })

    // Get list of regional hubs if creating a local hub
    const [regionalHubs, setRegionalHubs] = useState([]);
    useEffect(() => {
        request("get", "/hub/regional", (res) => {
            setRegionalHubs(res.data);
            setFormData({...formData, startHubId: res.data[0].id, endHubId: res.data[0].id});
        }).then();
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert(JSON.stringify(formData));
        request(
            "post", 
            `/route/create`, 
            () => alert("Route has been created successfully"),
            () => alert("There was an error creating your route. Please try again"),
            formData)
        .then(() => history.push(`/route`))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    let times = [];
    for (let i = 0; i < 24; i++)
        for (let j = 0; j < 60; j = j + 15)
            times.push(i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) 
                + ":" 
                + j.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}));

    return (
        <div>
            <h2>Create route</h2>
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
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="start-hub-select-label">Start hub</InputLabel>
                            <Select
                                labelId="start-hub-select-label"
                                id="start-hub-select"
                                name="startHubId"
                                value={formData.startHubId}
                                onChange={handleChange}
                                required
                            >
                                {regionalHubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )}
                            </Select>
                            <FormHelperText>Choose a regional hub that this route starts from</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="end-hub-select-label">End hub</InputLabel>
                            <Select
                                labelId="end-hub-select-label"
                                id="end-hub-select"
                                name="endHubId"
                                value={formData.endHubId}
                                onChange={handleChange}
                                required
                            >
                                {regionalHubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )}
                            </Select>
                            <FormHelperText>Choose a regional hub that this route ends at</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="start-times-select-label">Start times</InputLabel>
                            <Select
                                labelId="start-time-select-label"
                                id="start-times-select"
                                name="startTimes"
                                value={formData.startTimes}
                                onChange={handleChange}
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
                                {times.map(item => 
                                    <MenuItem key={item} value={item}>
                                        <Checkbox checked={formData.startTimes.indexOf(item) > -1} />
                                        <ListItemText primary={item}/>
                                    </MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <SubmitButton>Create</SubmitButton>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default RouteCreateScreen;