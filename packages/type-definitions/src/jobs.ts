import { ImageComponent } from "./dynamicPage";

export type JobState = "pending" | "resolved" | "failed";

export interface JobReport {
    documentId: string;
    id: number;
    title: string;
    description: string;
    media: ImageComponent | null;
    state: JobState | null;
    type_of_report: string | null;
    job_id: number | null;
    raw_payload: any | null; // The raw payload from the job, which can be of any type
    created_at: string;
    updated_at: string;
}
