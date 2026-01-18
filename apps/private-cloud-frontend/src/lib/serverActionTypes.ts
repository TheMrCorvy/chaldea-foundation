export type AuthFormState = {
    submitState: "not_sent" | "success" | "error";
    message?: string;
    data: {
        identifier?: string;
        username?: string;
        email?: string;
        password: string;
    };
};

export type ReportFormState = {
    submitState: "not_sent" | "success" | "error";
    message?: string;
    fieldErrors?: {
        title?: string[];
        description?: string[];
        media?: string[];
    };
};
