import { LayoutDescriptionWithChipsList } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { Box } from "@mui/material";
import LogoLoop from "../LogoLoop";
import { IconName } from "../IconComponent";
import SkillListItem from "../SkillListItem";
import RichTextRenderer from "../RichTextRenderer";

export interface MySkillsProps extends LayoutDescriptionWithChipsList {
    isMobile?: boolean;
}

const MySkills: FC<MySkillsProps> = ({
    body,
    chips,
    component_id,
    isMobile = false,
}) => {
    return (
        <Box
            component="section"
            id={component_id}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "4px",
                px: "22px",
                maxHeight: isMobile ? "65dvh" : "54dvh",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": { width: "1%" },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(127, 214, 255, 0.45)",
                    borderRadius: "999px",
                },
                paddingBottom: "16px",
            }}
        >
            <RichTextRenderer
                content={body}
                color="grey.300"
                fontSize="0.85rem"
                lineHeight={1.5}
            />

            <LogoLoop
                items={
                    chips?.map((chip) => (
                        <SkillListItem
                            key={chip.component_id}
                            icon={(chip.icon?.name as IconName) || undefined}
                            title={chip.title || ""}
                            popover={chip.popover}
                            size={chip.icon?.size || "medium"}
                        />
                    )) || []
                }
                isVertical={false}
                isMobile={isMobile}
            />
        </Box>
    );
};

export default MySkills;
