// import AspectRatio from "@mui/joy/AspectRatio";
import { WebRoutes } from "@/utils/routes";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";

import { Episode } from "@repo/type-definitions";
import { FC } from "react";
import { Box } from "@mui/joy";
import Link from "next/link";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import { getScreenSize } from "@/utils/screenSize";

interface EpisodeCardProps {
    episode: Episode;
    userId: string;
}

const EpisodeCard: FC<EpisodeCardProps> = ({ episode, userId }) => {
    const { display_name, documentId } = episode;

    return (
        <Link
            href={`${WebRoutes.EPISODE}/${documentId}`}
            style={{
                textDecoration: "none",
                position: "relative",
                zIndex: 0,
            }}
        >
            <Card
                orientation="horizontal"
                variant="soft"
                sx={{
                    width: 350,
                    height: "100%",
                    backgroundColor: "#0B6BCB !important",
                    transition:
                        "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                        cursor: "pointer",
                        transform: "scale(1.04)",
                    },
                    [`@media (max-width: ${getScreenSize("xl")}px)`]: {
                        width: 260,
                    },
                }}
                // onClick={() => redirect(WebRoutes.EPISODE + documentId)}
            >
                {/* <CardOverflow>
                    <AspectRatio ratio="1" sx={{ width: 105 }}>
                        <img
                            src="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90"
                            srcSet="https://images.unsplash.com/photo-1507833423370-a126b89d394b?auto=format&fit=crop&w=90&dpr=2 2x"
                            loading="lazy"
                            alt=""
                        />
                    </AspectRatio>
                </CardOverflow> */}
                <CardContent
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    <Box
                        sx={{
                            color: "white",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <NotStartedIcon
                            sx={{
                                fontSize: 30,
                                color: "white",
                            }}
                        />
                    </Box>
                    <Box
                        sx={{
                            color: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Typography sx={{ color: "white" }}>
                            {display_name}
                        </Typography>
                        <Typography
                            // href={WebRoutes.EPISODE + "/" + episode.documentId}
                            sx={{
                                width: "100%",
                                display: "flex",
                                color: "#A8B2C3",
                                justifyContent: "space-between",
                                textDecoration: "underline",
                                // "&:hover": {
                                //     textDecoration: "underline",
                                //     textDecorationColor: "white",
                                // },
                            }}
                            level="body-sm"
                        >
                            Ver ahora
                        </Typography>
                    </Box>
                </CardContent>
                {episode.watched_by?.data.includes(userId) && (
                    <CardOverflow
                        sx={{
                            px: 0.2,
                            writingMode: "vertical-rl",
                            justifyContent: "center",
                            fontSize: "xs",
                            fontWeight: "xl",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            borderLeft: "1px solid",
                            borderColor: "divider",
                            backgroundColor: "#4caf50",
                            color: "white",
                        }}
                    >
                        VISTO
                    </CardOverflow>
                )}
            </Card>
        </Link>
    );
};

export default EpisodeCard;
