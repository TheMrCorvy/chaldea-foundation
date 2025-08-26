import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { Signals } from "@repo/type-definitions/rooms";

interface EnterRoomParams {
    roomId: string;
}

export const roomHandler = (socket: Socket) => {
    const enterRoom = ({ roomId }: EnterRoomParams) => {
        socket.join(roomId);
        console.log("user asked to enter the room: ", roomId);
    };

    const createRoom = () => {
        const roomId = uuidv4();
        socket.emit(Signals.ROOM_CREATED, { roomId });
        console.log("user asked to create a room");
    };

    socket.on(Signals.CREATE_ROOM, createRoom);
    socket.on(Signals.ENTER_ROOM, enterRoom);
};
