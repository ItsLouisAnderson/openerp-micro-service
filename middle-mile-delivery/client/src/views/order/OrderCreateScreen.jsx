import { FormControl, Grid, InputAdornment, InputLabel, Select, TextField } from "@mui/material";
import { request } from "api";
import MenuItem from "@mui/material/MenuItem";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import SubmitButton from "components/button/SubmitButton";

function OrderCreateScreen(props) {
    const history = useHistory();

    const [formData, setFormData] = useState({
        description: "",
        startHubId: 0,
        endHubId: 0,
        status: "AT_START_LOCAL_HUB",
        weight: 0
    });

    // Get list of local hubs
    const [localHubs, setLocalHubs] = useState([]);
    useEffect(() => {
        request("get", "/hub/local", (res) => {
            setLocalHubs(res.data);
            setFormData({...formData, startHubId: res.data[0].id, endHubId: res.data[0].id});
        }).then();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert(JSON.stringify(formData));
        request(
            "post",
            "/order/create",
            () => alert("Order has been created successfully"),
            () => alert("There was an error creating your order. Please try again"),
            formData
        ).then(() => history.push("/order/all"))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    return ( 
        <div>
            <h2>Create new order</h2>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description (optional)"
                            name="description"
                            id="description-input"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Total weight"
                            type="number"
                            name="weight"
                            id="weight-input"
                            value={formData.weight}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                inputProps: { min: 0 }
                            }}
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
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
                                {localHubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
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
                                {localHubs.map(item => 
                                    <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
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

export default OrderCreateScreen;