import { logData } from "@repo/shared-utils/log-data";

export default async function uploadToPS(
    mediaFile: File,
    jwt: string
): Promise<string[] | null> {
    const strapiUrl =
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

    const uploadFormData = new FormData();
    uploadFormData.append("files", mediaFile);

    try {
        const uploadResponse = await fetch(`${strapiUrl}/api/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
            body: uploadFormData,
        });

        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            logData({
                title: "Error uploading media to Strapi",
                layer: "bug_report",
                data: {
                    status: uploadResponse.status,
                    statusText: uploadResponse.statusText,
                    error: errorText,
                },
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });
            return null;
        }

        const uploadedFiles = (await uploadResponse.json()) as Array<{
            id: string;
        }>;

        if (!uploadedFiles || uploadedFiles.length === 0) {
            logData({
                title: "No files returned from Strapi upload",
                layer: "bug_report",
                data: { uploadedFiles },
                type: "error",
                timeStamp: true,
                addSeparatorAfter: true,
                addSpaceAfter: true,
            });
            return null;
        }

        return uploadedFiles.map((file) => file.id);
    } catch (err) {
        logData({
            title: "Error uploading media to Strapi (catch)",
            layer: "bug_report",
            data: err,
            type: "error",
            timeStamp: true,
            addSeparatorAfter: true,
            addSpaceAfter: true,
        });
        return null;
    }
}
