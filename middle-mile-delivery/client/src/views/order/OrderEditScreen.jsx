import { FormControl, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { request } from "api";
import SubmitButton from "components/button/SubmitButton";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { orderStatusDisplayValue, orderStatuses } from "utils/OrderStatus";

function OrderEditScreen(props) {
    let { id } = useParams();

    const history = useHistory();

    const [formData, setFormData] = useState({
        description: "",
        weight: 0,
        startHubId: 0,
        endHubId: 0,
        status: "AT_START_LOCAL_HUB"
    });

    // Get list of local hubs
    const [localHubs, setLocalHubs] = useState([]);
    useEffect(() => {
        request("get", `/order/${id}`, (res) => {
            setFormData({
                description: res.data.description,
                weight: res.data.weight,
                startHubId: res.data.startHub.id,
                endHubId: res.data.endHub.id,
                status: res.data.status
            })
        }).then();
        request("get", "/hub/local", (res) => {
            setLocalHubs(res.data);
        }).then();
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //alert(JSON.stringify(formData));
        request(
            "post",
            `/order/edit/${id}`,
            () => alert("Order has been edited successfully"),
            () => alert("There was an error editing your order. Please try again"),
            formData
        ).then(() => history.push("/order/all"))
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    return ( 
        <div>
            <h2>Edit order</h2>
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
                                disabled={!(formData.status === "AT_START_LOCAL_HUB")}
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
                                disabled={!(formData.status === "AT_START_LOCAL_HUB")}
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
                        <SubmitButton>Save</SubmitButton>
                    </Grid>
                </Grid>
            </form>
        </div>
    )
}

export default OrderEditScreen;