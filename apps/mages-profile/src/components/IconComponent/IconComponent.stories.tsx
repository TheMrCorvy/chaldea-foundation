import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import IconComponent from "./index";
import { Box, Typography } from "@mui/material";
import * as MuiIcons from "@mui/icons-material";

const meta = {
    title: "Components/IconComponent",
    component: IconComponent,
    parameters: {
        layout: "centered",
        backgrounds: {
            default: "dark",
            values: [{ name: "dark", value: "#000000" }],
        },
        docs: {
            description: {
                component:
                    "A dynamic icon component that renders any Material-UI icon by name.",
            },
        },
    },
    tags: ["autodocs"],
    argTypes: {
        icon: {
            control: "select",
            options: Object.keys(MuiIcons).filter(
                (key) =>
                    key !== "default" &&
                    key !== "createSvgIcon" &&
                    typeof MuiIcons[key as keyof typeof MuiIcons] === "object"
            ),
        },
        color: {
            control: "select",
            options: [
                "inherit",
                "action",
                "disabled",
                "primary",
                "secondary",
                "error",
                "info",
                "success",
                "warning",
            ],
        },
        fontSize: {
            control: "select",
            options: ["small", "medium", "large", "inherit"],
        },
    },
} satisfies Meta<typeof IconComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

// Get all icon names
const iconNames = Object.keys(MuiIcons).filter(
    (key) =>
        key !== "default" &&
        key !== "createSvgIcon" &&
        typeof MuiIcons[key as keyof typeof MuiIcons] === "object"
) as Array<keyof typeof MuiIcons>;

export const Default: Story = {
    args: {
        icon: "Home",
    },
    render: (args) => (
        <Box
            sx={{
                width: "100dvw",
                height: "100dvh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
            }}
        >
            <IconComponent {...args} />
        </Box>
    ),
};

export const WithColor: Story = {
    args: {
        icon: "Favorite",
        color: "error",
    },
    render: (args) => (
        <Box
            sx={{
                width: "100dvw",
                height: "100dvh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
            }}
        >
            <IconComponent {...args} />
        </Box>
    ),
};

export const WithSize: Story = {
    args: {
        icon: "Star",
        fontSize: "large",
        color: "primary",
    },
    render: (args) => (
        <Box
            sx={{
                width: "100dvw",
                height: "100dvh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
            }}
        >
            <IconComponent {...args} />
        </Box>
    ),
};

export const CustomStyle: Story = {
    args: {
        icon: "Whatshot",
        sx: {
            color: "#ff6600",
            fontSize: "4rem",
        },
    },
    render: (args) => (
        <Box
            sx={{
                width: "100dvw",
                height: "100dvh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000000",
            }}
        >
            <IconComponent {...args} />
        </Box>
    ),
};

export const AllIcons: Story = {
    args: {
        icon: "Home",
    },
    render: () => (
        <Box
            sx={{
                width: "100dvw",
                minHeight: "100dvh",
                backgroundColor: "#000000",
                padding: 4,
                overflowY: "auto",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    color: "white",
                    marginBottom: 4,
                    textAlign: "center",
                    fontWeight: "bold",
                }}
            >
                All Available Icons ({iconNames.length})
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        sm: "repeat(3, 1fr)",
                        md: "repeat(4, 1fr)",
                        lg: "repeat(6, 1fr)",
                    },
                    gap: 2,
                }}
            >
                {iconNames.map((iconName) => (
                    <Box
                        key={iconName}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            padding: 2,
                            backgroundColor: "rgba(255, 255, 255, 0.05)",
                            borderRadius: 1,
                            border: "1px solid rgba(255, 102, 0, 0.3)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "rgba(255, 102, 0, 0.1)",
                                borderColor: "#ff6600",
                                transform: "translateY(-4px)",
                                boxShadow: "0 4px 20px rgba(255, 102, 0, 0.3)",
                            },
                        }}
                    >
                        <IconComponent
                            icon={iconName}
                            sx={{
                                color: "white",
                                fontSize: "2.5rem",
                                marginBottom: 1,
                            }}
                        />
                        <Typography
                            variant="caption"
                            sx={{
                                color: "white",
                                textAlign: "center",
                                fontSize: "0.7rem",
                                wordBreak: "break-word",
                            }}
                        >
                            {iconName}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    ),
};

export const PopularIcons: Story = {
    args: {
        icon: "Home",
    },
    render: () => {
        const popularIconNames: Array<keyof typeof MuiIcons> = [
            "Home",
            "Star",
            "Favorite",
            "Search",
            "Menu",
            "Close",
            "Settings",
            "AccountCircle",
            "Delete",
            "Add",
            "Remove",
            "Edit",
            "Check",
            "ArrowBack",
            "ArrowForward",
            "ExpandMore",
            "ChevronRight",
            "Info",
            "Warning",
            "Error",
            "CheckCircle",
            "Notifications",
            "Email",
            "Phone",
            "Share",
        ];

        return (
            <Box
                sx={{
                    width: "100dvw",
                    minHeight: "100dvh",
                    backgroundColor: "#000000",
                    padding: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        color: "white",
                        marginBottom: 4,
                        fontWeight: "bold",
                    }}
                >
                    Popular Icons
                </Typography>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "repeat(2, 1fr)",
                            sm: "repeat(3, 1fr)",
                            md: "repeat(4, 1fr)",
                        },
                        gap: 3,
                        maxWidth: "lg",
                    }}
                >
                    {popularIconNames.map((iconName) => (
                        <Box
                            key={iconName}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: 3,
                                backgroundColor: "rgba(77, 208, 225, 0.05)",
                                borderRadius: 2,
                                border: "2px solid rgba(255, 102, 0, 0.3)",
                                transition: "all 0.3s ease",
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 102, 0, 0.15)",
                                    borderColor: "#ff6600",
                                    transform: "scale(1.05)",
                                    boxShadow:
                                        "0 8px 30px rgba(255, 102, 0, 0.4)",
                                },
                            }}
                        >
                            <IconComponent
                                icon={iconName}
                                sx={{
                                    color: "#4dd0e1",
                                    fontSize: "3rem",
                                    marginBottom: 2,
                                }}
                            />
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "white",
                                    textAlign: "center",
                                    fontWeight: 500,
                                }}
                            >
                                {iconName}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    },
};
