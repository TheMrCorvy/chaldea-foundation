import { Box, Typography } from "@mui/material";
import { LayoutLogoLoop } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import LogoLoop from "../../LogoLoop";
import SkillListItem from "../../SkillListItem";
import { IconName } from "../../IconComponent";

export interface DynamicLogoLoopProps extends LayoutLogoLoop {
    isMobile?: boolean;
}

const DynamicLogoLoop: FC<DynamicLogoLoopProps> = ({
    chips,
    title,
    component_id,
    isMobile,
    vertical,
    duration,
    direction,
    gap,
    title_color,
}) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 1,
                justifyContent: "center",
                width: "100%",
            }}
            component="section"
            id={component_id}
            aria-label={title || "Logo Loop Section"}
        >
            {title && (
                <Typography
                    variant="h4"
                    sx={{
                        color: title_color,
                        fontWeight: "bold",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        textShadow: "0 0 10px rgba(56, 182, 255, 0.4)",
                    }}
                >
                    {title}
                </Typography>
            )}
            <LogoLoop
                items={
                    chips?.map((chip) => (
                        <SkillListItem
                            key={chip.component_id}
                            icon={(chip.icon?.name as IconName) || undefined}
                            title={chip.title || ""}
                            popover={chip.popover}
                            size={chip.icon?.size || "medium"}
                            color={chip.icon?.color || "inherit"}
                        />
                    )) || []
                }
                isVertical={vertical || false}
                isMobile={isMobile}
                gap={gap || undefined}
                duration={duration || undefined}
                direction={direction}
            />
        </Box>
    );
};

export default DynamicLogoLoop;
