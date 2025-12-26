import { Box, Button, Stack, Typography } from "@mui/joy";
import { ReactNode } from "react";
import useStyles from "./useStyles";

interface NavActionProps {
    label: string;
    icon: ReactNode;
    value: string;
    onClick: (value: string) => void;
}

const NavAction = ({ label, icon, value, onClick }: NavActionProps) => {
    const isSelected = value === "home";
    const { root, button, actionLabel, iconStyles } = useStyles({ isSelected });

    return (
        <Box sx={root}>
            <Button
                variant="plain"
                color="primary"
                onClick={() => onClick(value)}
                sx={button}
                size="sm"
            >
                <Stack alignItems="center" spacing={0}>
                    <Box sx={iconStyles}>{icon}</Box>
                    <Typography level="body-xs" sx={actionLabel}>
                        {label}
                    </Typography>
                </Stack>
            </Button>
        </Box>
    );
};

export default NavAction;
