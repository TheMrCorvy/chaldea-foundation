import { createContext, useEffect, type FC } from "react";
import { useNavigate } from "react-router-dom";
import SocketIOClient from "socket.io-client";

const WS = "http://localhost:4000";

export const RoomContext = createContext<null | any>(null);

const ws = SocketIOClient(WS);

interface RoomProviderProps {
    children: React.ReactNode;
}

interface EnterRoomResponse {
    roomId: string;
}

export const RoomProvider: FC<RoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();

    const enterRoom = ({ roomId }: EnterRoomResponse) => {
        navigate(`/room/${roomId}`);
    };

    useEffect(() => {
        ws.on("room-created", enterRoom);
    }, []);

    return (
        <RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>
    );
};
