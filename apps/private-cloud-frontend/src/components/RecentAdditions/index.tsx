"use client";

import { Directory, Episode } from "@repo/type-definitions";
import { FC, useState } from "react";
import {
    Box,
    Container,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    Typography,
    Card,
    CardContent,
} from "@mui/joy";
import { useRouter } from "next/navigation";
import { WebRoutes } from "@/utils/routes";
import NotStartedIcon from "@mui/icons-material/NotStarted";
import FolderIcon from "@mui/icons-material/Folder";

export interface RecentAdditionsProps {
    recentDirectories: Directory[];
    recentEpisodes: Episode[];
}

const RecentAdditions: FC<RecentAdditionsProps> = ({
    recentDirectories,
    recentEpisodes,
}) => {
    const router = useRouter();
    const [tabValue, setTabValue] = useState<number | string>(0);

    return (
        <Box
            sx={{
                width: "100%",
                pt: 4,
                pb: 14,
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                zIndex: 0,
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    px: { xs: 2, md: 3 },
                }}
            >
                <Typography
                    level="h2"
                    sx={{
                        mb: 3,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                >
                    Adiciones Recientes
                </Typography>

                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => {
                        if (newValue !== null) {
                            setTabValue(newValue);
                        }
                    }}
                    sx={{
                        width: "100%",
                        backgroundColor: "transparent",
                        borderRadius: 2,
                        py: 3,
                    }}
                >
                    <TabList
                        sx={{
                            backgroundColor: "transparent",
                            borderBottomColor: "rgba(255, 255, 255, 0.1)",
                            mb: 3,
                        }}
                    >
                        <Tab
                            sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                "&[aria-selected='true']": {
                                    color: "white",
                                    borderBottomColor: "#0B6BCB",
                                },
                            }}
                            variant="plain"
                            color="success"
                        >
                            Directorios
                        </Tab>
                        <Tab
                            sx={{
                                color: "rgba(255, 255, 255, 0.7)",
                                "&[aria-selected='true']": {
                                    color: "white",
                                    borderBottomColor: "#0B6BCB",
                                },
                            }}
                            variant="plain"
                            color="success"
                        >
                            Episodios
                        </Tab>
                    </TabList>

                    <TabPanel value={0} sx={{ p: 0 }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(5, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {recentDirectories.map((directory) => (
                                <Card
                                    key={directory.id}
                                    onClick={() =>
                                        router.push(
                                            `${WebRoutes.DIRECTORY}/${directory.documentId}`
                                        )
                                    }
                                    sx={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        transition: "all 0.3s ease-in-out",
                                        height: "100%",
                                        minHeight: 120,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(11, 107, 203, 0.15)",
                                            borderColor:
                                                "rgba(11, 107, 203, 0.5)",
                                            transform: "translateY(-4px)",
                                            boxShadow:
                                                "0 8px 24px rgba(11, 107, 203, 0.2)",
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            textAlign: "center",
                                            p: 2,
                                        }}
                                    >
                                        <FolderIcon
                                            sx={{
                                                fontSize: 32,
                                                color: "#0B6BCB",
                                                mb: 1,
                                            }}
                                        />
                                        <Typography
                                            level="body-sm"
                                            sx={{
                                                color: "white",
                                                fontWeight: "500",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {directory.display_name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </TabPanel>

                    <TabPanel value={1} sx={{ p: 0 }}>
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    md: "repeat(5, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            {recentEpisodes.map((episode) => (
                                <Card
                                    key={episode.id}
                                    onClick={() =>
                                        router.push(
                                            `${WebRoutes.EPISODE}/${episode.documentId}`
                                        )
                                    }
                                    sx={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.05)",
                                        border: "1px solid rgba(255, 255, 255, 0.1)",
                                        transition: "all 0.3s ease-in-out",
                                        height: "100%",
                                        minHeight: 120,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        "&:hover": {
                                            backgroundColor:
                                                "rgba(11, 107, 203, 0.15)",
                                            borderColor:
                                                "rgba(11, 107, 203, 0.5)",
                                            transform: "translateY(-4px)",
                                            boxShadow:
                                                "0 8px 24px rgba(11, 107, 203, 0.2)",
                                        },
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "100%",
                                            textAlign: "center",
                                            p: 2,
                                        }}
                                    >
                                        <NotStartedIcon
                                            sx={{
                                                fontSize: 32,
                                                color: "#0B6BCB",
                                                mb: 1,
                                            }}
                                        />
                                        <Typography
                                            level="body-sm"
                                            sx={{
                                                color: "white",
                                                fontWeight: "500",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {episode.display_name}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </TabPanel>
                </Tabs>
            </Container>
        </Box>
    );
};

export default RecentAdditions;
