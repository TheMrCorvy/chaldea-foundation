"use client";

import { FC } from "react";
import { Box, Typography } from "@mui/material";
import {
    Adb,
    DiamondOutlined,
    InfoOutlined,
    PhotoCameraOutlined,
    StarBorderOutlined,
    GridOnOutlined,
} from "@mui/icons-material";
import useStyles from "./useStyles";
import useLight from "./useLight";

const icons = [
    InfoOutlined,
    PhotoCameraOutlined,
    StarBorderOutlined,
    DiamondOutlined,
    Adb,
    GridOnOutlined,
];

const SharedLightCards: FC = () => {
    const { containerRef, cardsRef, isHovering, setIsHovering } = useLight();
    const { root, card, cardContent, innerContent } = useStyles({ isHovering });

    return (
        <Box
            ref={containerRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            sx={root}
        >
            {icons.map((Icon, i) => (
                <Box
                    key={i}
                    component="div"
                    ref={(element: HTMLDivElement) => {
                        if (element) {
                            cardsRef.current[i] = element;
                        }
                    }}
                    sx={card}
                >
                    <Box className="card-content" sx={cardContent}>
                        <Box className="card-icon" sx={innerContent}>
                            <Icon />
                            <Typography variant="body2" color="primary">
                                Lorem ipsum dolor sit amet consectetur
                                adipisicing elit. Eligendi atque distinctio in
                                doloribus, qui fuga necessitatibus dolore vel
                                ducimus mollitia veniam consequatur obcaecati
                                reprehenderit nam officiis! Incidunt placeat
                                adipisci aliquam?
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default SharedLightCards;
