import { request } from "../../api";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "components/dialog/ConfirmDialog";
import { Grid } from "@mui/material";
import AddButton from "components/button/AddButton";
import { StandardTable } from "erp-hust/lib/StandardTable";

function TruckListScreen(props) {
    const [trucks, setTrucks] = useState([]);

    const [showDelete, setShowDelete] = useState(false);
    const [deleteId, setDeleteId] = useState("");

    useEffect(() => {
        request("get", `/truck/all`, (res) => {
            setTrucks(res.data);
        }).then();
    }, [])

    const columns = [
        {
            title: "License Plate",
            field: "licensePlate"
        },
        {
            title: "Manufacturer",
            field: "manufacturer"
        },
        {
            title: "Max Weight",
            field: "maxWeight"
        },
        {
            title: "Hub",
            field: "hub.name"
        },
        {
            title: "Delete",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => showDeleteDialog(rowData.licensePlate)}
                    variant="contained"
                    color="error"
                >
                    <DeleteIcon/>
                </IconButton>
            ),
        },
    ]

    const showDeleteDialog = (id) => {
        setDeleteId(id);
        setShowDelete(true);
    }

    const onConfirmDelete = () => {
        request(
            "post", 
            `/truck/delete/${deleteId}`, 
            () => alert("Truck deleted successfully!"),
            () => alert("There was an error creating your truck. Please try again"))
        .then(() => {
            setShowDelete(false);
            request("get", `/truck`, (res) => {
                setTrucks(res.data);
            }).then();
        });
    }

    return (
        <div>
            <ConfirmDialog
                title="Delete truck"
                open={showDelete}
                setOpen={setShowDelete}
                onConfirm={onConfirmDelete}>
                    Are you sure you want to delete this truck?
            </ConfirmDialog>

            <Grid container spacing={2}>
                <Grid item>
                    <AddButton to={`/truck/create`}>Create truck</AddButton>
                </Grid>
                <Grid item xs={12}>
                    <StandardTable
                        title="Trucks"
                        columns={columns}
                        data={trucks}
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

export default TruckListScreen;