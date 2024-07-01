import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import { Link } from "react-router-dom/cjs/react-router-dom";

function AddButton(props) {
    return (
        <Button
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            {...props}>
                {props.children}
        </Button>
    )
}

export default AddButton;