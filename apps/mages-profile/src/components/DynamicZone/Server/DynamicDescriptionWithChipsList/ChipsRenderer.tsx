"use server";

import { Box, Chip } from "@mui/material";
import { LayoutToolChip } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import IconComponent from "../../../IconComponent";
import DynamicLogoLoop from "../DynamicLogoLoop";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export interface ChipsRendererProps {
    chips?: Array<LayoutToolChip>;
    logo_loop?: boolean | null;
    vertical_logo_loop?: boolean | null;
    component_id: string;
    id: number;
}

const ChipsRenderer: FC<ChipsRendererProps> = ({
    chips,
    logo_loop,
    vertical_logo_loop,
    component_id,
    id,
}) => {
    if (!chips || !chips.length) {
        return null;
    }

    if (!logo_loop) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mt: 1,
                    justifyContent:
                        chips.length === 1 ? "flex-start" : "center",
                }}
            >
                {chips.map((chip, index) => (
                    <Box key={chip.component_id || `chip-${index}`}>
                        <Chip
                            label={chip.title}
                            icon={
                                chip.icon ? (
                                    <IconComponent
                                        name={chip.icon.name}
                                        size={chip.icon.size}
                                        color={chip.icon.color}
                                    />
                                ) : undefined
                            }
                            sx={{
                                color: "#eeeeee",
                                backgroundColor: "rgba(12, 36, 72, 0.4)",
                                border: "1px solid rgba(56, 182, 255, 0.3)",
                                backdropFilter: "blur(4px)",
                                boxShadow: "0 0 10px rgba(56, 182, 255, 0.05)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.5)",
                                    borderColor: "rgba(86, 202, 255, 0.8)",
                                    boxShadow:
                                        "0 0 16px rgba(56, 182, 255, 0.4), inset 0 0 8px rgba(56, 182, 255, 0.2)",
                                    transform: "translateY(-2px)",
                                },
                                "& .MuiChip-label": {
                                    px: 2,
                                    py: 0.5,
                                    fontWeight: 600,
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    fontSize: "0.75rem",
                                    textShadow:
                                        "0 0 8px rgba(178, 221, 255, 0.4)",
                                },
                                "& .MuiChip-icon": {
                                    color:
                                        chip.icon?.color &&
                                        chip.icon.color !== "inherit"
                                            ? undefined
                                            : "rgba(178, 221, 255, 0.8)",
                                    marginLeft: 1,
                                },
                            }}
                        />
                    </Box>
                ))}
            </Box>
        );
    }

    if (logo_loop) {
        const isMobile = useMediaQuery().max.width("sm");
        return (
            <DynamicLogoLoop
                id={id}
                chips={chips}
                isMobile={isMobile}
                vertical={vertical_logo_loop || false}
                title={""}
                title_color={""}
                direction="normal"
                __component="layout.logo-loop"
                component_id={component_id}
            />
        );
    }
};

export default ChipsRenderer;
