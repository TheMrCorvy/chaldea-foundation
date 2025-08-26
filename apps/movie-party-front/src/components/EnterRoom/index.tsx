import type { FC } from "react";
import { useContext } from "react";

import { RoomContext } from "../../context/roomContext";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

import { Signals } from "@repo/type-definitions/rooms";

const CreateRoom: FC = () => {
    const { ws } = useContext(RoomContext);

    const createRoom = () => {
        ws.emit(Signals.CREATE_ROOM);
    };

    return (
        <Container
            maxWidth="xl"
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Button variant="contained" onClick={createRoom}>
                Create Room
            </Button>
        </Container>
    );
};

export default CreateRoom;
