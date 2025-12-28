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
