import { useContext, useEffect, type FC } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/roomContext";

const Room: FC = () => {
    const { roomId } = useParams();
    const { ws } = useContext(RoomContext);

    useEffect(() => {
        if (roomId) {
            ws.emit("enter-room", { roomId });
        }
    }, [roomId, ws]);

    return (
        <div>
            <h1>Room</h1>
            <p>Room ID: {roomId}</p>
        </div>
    );
};
export default Room;
