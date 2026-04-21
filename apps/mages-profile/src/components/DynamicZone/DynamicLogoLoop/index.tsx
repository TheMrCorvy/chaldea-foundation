import { Box } from "@mui/material";
import { LayoutLogoLoop } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import LogoLoop from "../../LogoLoop";
import SkillListItem from "../../SkillListItem";
import { IconName } from "../../IconComponent";
import DynamicTitle from "../DynamicTitle";

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
    text_align,
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
                <DynamicTitle
                    title={title}
                    color={title_color || "#eeeeee"}
                    size="h4"
                    isMobile={isMobile}
                    text_align={text_align || "center"}
                />
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
