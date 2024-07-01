import { Grid, TextField } from "@mui/material";
import SubmitButton from "components/button/SubmitButton";
import { useState } from "react";
import OrderDetailsScreen from "./OrderDetailsScreen";

function OrderTrackScreen(props) {
    const [orderId, setOrderId] = useState("");
    const [showDetails, setShowDetails] = useState(false);

    const [submittedOrderId, setSubmittedOrderId] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedOrderId(orderId);
        setShowDetails(true);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrderId(value);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={10}>
                        <TextField
                            fullWidth
                            label="Order ID"
                            name="orderId"
                            id="order-id-input"
                            value={orderId}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <SubmitButton 
                            fullWidth
                            style={{ height: '100%' }}
                        >
                            Find order
                        </SubmitButton>
                    </Grid>
                </Grid>
            </form>
            {showDetails ? <OrderDetailsScreen orderId={submittedOrderId} /> : null}
        </div>
    )
}

export default OrderTrackScreen;