import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useEffect, useState } from "react";
import { request } from "api";
import { FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import SubmitButton from "components/button/SubmitButton";

function TruckCreateScreen(props) {
    const history = useHistory();

    const [formData, setFormData] = useState({
        licensePlate: "",
        manufacturer: "",
        maxWeight: 0,
        hubId: 0
    });

    // Get list of regional hubs
    const [hubs, setHubs] = useState([]);
    useEffect(() => {
        request("get", "/hub/all", (res) => {
            setHubs(res.data);
            setFormData({...formData, hubId: res.data[0].id});
        }).then();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert(JSON.stringify(formData));
        request(
            "post", 
            `/truck/create`, 
            () => alert("Truck has been created successfully"),
            () => alert("There was an error creating your truck. Please try again"),
            formData)
        .then(() => history.push(`/truck`))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div>
            <h2>Create truck</h2>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="License plate"
                            name="licensePlate"
                            id="license-plate-input"
                            value={formData.licensePlate}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Manufacturer"
                            name="manufacturer"
                            id="manufacturer-input"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            label="Max weight"
                            type="number"
                            name="maxWeight"
                            id="max-weight-input"
                            value={formData.maxWeight}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                inputProps: { min: 0 }
                            }}
                            required
                        />                    
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="hub-select-label">Hub</InputLabel>
                            <Select
                                labelId="hub-select-label"
                                id="hub-select"
                                name="hubId"
                                value={formData.hubId}
                                onChange={handleChange}
                                required
                            >
                                {hubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )}
                            </Select>
                            <FormHelperText>Choose a Hub that manages this truck</FormHelperText>
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

export default TruckCreateScreen;