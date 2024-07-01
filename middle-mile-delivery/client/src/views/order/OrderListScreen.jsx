import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from "@mui/icons-material/Edit";
import { request } from "api";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Grid } from "@mui/material";
import AddButton from "components/button/AddButton";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { orderStatusDisplayValue } from "utils/OrderStatus";
import dayjs from 'dayjs';

function OrderListScreen(props) {
    const history = useHistory();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        request("get", "/order/all", (res) => {
            setOrders(res.data)
        }).then();
    }, []);

    const columns = [
        {
            title: "ID",
            field: "id"
        },
        {
            title: "Creation time",
            field: "createdDate",
            render: (rowData) => 
                <div>{dayjs(rowData.createdDate).format("DD/MM/YYYY HH:mm")}</div>
        },
        {
            title: "Weight",
            field: "weight",
            render: (rowData) => <div>{rowData.weight + " kg"}</div>
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
            title: "Status",
            field: "status",
            render: (rowData) => orderStatusDisplayValue(rowData.status)
        },
        {
            title: "Details",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => history.push(`/order/details/${rowData.id}`)}
                    variant="contained"
                    color="success"
                >
                    <VisibilityIcon />
                </IconButton>
            )
        },
        {
            title: "Edit",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => history.push(`/order/edit/${rowData.id}`)}
                    variant="contained"
                    color="success"
                >
                    <EditIcon/>
                </IconButton>
            ),
        },
    ];

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item>
                    <AddButton to="/order/create">Create order</AddButton>
                </Grid>
                <Grid item xs={12}>
                    <StandardTable
                        title="Orders"
                        columns={columns}
                        data={orders}
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

export default OrderListScreen;