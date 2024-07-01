import Button from "@mui/material/Button"
import SendIcon from "@mui/icons-material/Send"
import { Link } from "react-router-dom/cjs/react-router-dom"

function SubmitButton(props) {
    return (
        <Button
            variant="contained"
            startIcon={<SendIcon />}
            type="submit"
            {...props}>
                {props.children}
        </Button>
    )
}

export default SubmitButton;