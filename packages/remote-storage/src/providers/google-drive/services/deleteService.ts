import type { drive_v3 } from "googleapis";
import type { DeleteInput, DeleteResult } from "../../../types";

export async function deleteService(
    drive: drive_v3.Drive,
    input: DeleteInput
): Promise<DeleteResult> {
    await drive.files.delete({
        fileId: input.file.id,
        supportsAllDrives: true,
    });

    return {
        deleted: true,
        fileId: input.file.id,
    };
}
