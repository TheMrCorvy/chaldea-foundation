import { ImageComponent } from "./dynamicPage";

export type JobState = "pending" | "resolved" | "failed";

export interface Report {
    documentId: string;
    id: number;
    title: string;
    description: string;
    media: ImageComponent;
    state: JobState;
    type_of_report: string;
    job_id: number;
}
