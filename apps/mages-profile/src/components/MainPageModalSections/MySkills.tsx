import { LayoutDescriptionWithChipsList } from "@repo/type-definitions/dynamic-page";
import { FC } from "react";
import { Box } from "@mui/material";
import LogoLoop from "../LogoLoop";
import { IconName } from "../IconComponent";
import SkillListItem from "../SkillListItem";
import RichTextRenderer from "../RichTextRenderer";

const MySkills: FC<LayoutDescriptionWithChipsList> = ({
    body,
    chips,
    component_id,
}) => {
    return (
        <Box
            component="section"
            id={component_id}
            sx={{
                height: "100%",
                width: "100%",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingBottom: 5,
                paddingX: "22px",
            }}
        >
            <RichTextRenderer content={body} />

            <LogoLoop
                items={
                    chips?.map((chip) => (
                        <SkillListItem
                            key={chip.component_id}
                            icon={chip.icon.name as IconName}
                            title={chip.title || ""}
                            popover={chip.popover}
                            size={chip.icon.size || "medium"}
                        />
                    )) || []
                }
                isVertical={false}
            />
        </Box>
    );
};

export default MySkills;
