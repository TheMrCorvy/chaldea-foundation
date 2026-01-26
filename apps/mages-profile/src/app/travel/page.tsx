"use client";

import type { CSSProperties, JSX } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Chip,
    Stack,
} from "@mui/material";
import {
    GitHub as GitHubIcon,
    LinkedIn as LinkedInIcon,
    Email as EmailIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import SharedLightCards from "@/components/SharedLightCards";
import GlitchBackgroundCard from "@/components/GlitchBacgkroundCard";
import GlitchText from "@/components/GlitchText";

interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
}

interface Skill {
    id: number;
    category: string;
    items: string[];
}

const projects: Project[] = [
    {
        id: 1,
        title: "E-Commerce Platform",
        description:
            "Full-stack e-commerce solution with payment integration, inventory management, and user authentication.",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    },
    {
        id: 2,
        title: "Real-time Chat Application",
        description:
            "WebSocket-based chat application with message history, user presence, and emoji support.",
        technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
    },
    {
        id: 3,
        title: "Analytics Dashboard",
        description:
            "Interactive dashboard for real-time data visualization and business metrics tracking.",
        technologies: ["React", "D3.js", "Express", "MySQL"],
    },
];

const skills: Skill[] = [
    {
        id: 1,
        category: "Frontend",
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "MUI"],
    },
    {
        id: 2,
        category: "Backend",
        items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Docker"],
    },
    {
        id: 3,
        category: "Tools",
        items: ["Git", "AWS", "CI/CD", "REST APIs", "GraphQL"],
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: "easeOut" as const,
        },
    },
};

const MotionDiv = motion.div;

export default function Home(): JSX.Element {
    const buttonStyle: CSSProperties = {
        border: "none",
        cursor: "pointer",
    };

    return (
        <Box sx={{ overflow: "hidden" }}>
            {/* Skills Section */}
            <Box
                component="section"
                sx={{
                    py: 10,
                    background: "linear-gradient(to bottom, #f5f5f5, #fff)",
                }}
            >
                <Container maxWidth="lg">
                    <MotionDiv
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <GlitchText
                                text="Skills &amp; Expertise Example Text"
                                variant="h2"
                                useMinus={true}
                                sx={{
                                    mb: 8,
                                    textAlign: "center",
                                    fontWeight: 700,
                                }}
                                delay={0.2}
                            />
                        </motion.div>

                        <Grid container spacing={4}>
                            <Grid
                                size={{ xs: 12 }}
                                sx={{
                                    background: "#121212",
                                    padding: 2,
                                }}
                            >
                                <SharedLightCards />
                            </Grid>
                            <Grid
                                size={{ xs: 12 }}
                                sx={{
                                    background: "#121212",
                                    padding: 2,
                                }}
                            >
                                <GlitchBackgroundCard />
                            </Grid>
                            <Grid
                                size={{ xs: 12 }}
                                sx={{
                                    background: "#121212",
                                    padding: 2,
                                }}
                            ></Grid>
                            {skills.map((skillGroup, index) => (
                                <Grid
                                    size={{ xs: 12, md: 4 }}
                                    key={skillGroup.id}
                                >
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card
                                            sx={{
                                                height: "100%",
                                                boxShadow:
                                                    "0 10px 40px rgba(0,0,0,0.1)",
                                                borderRadius: "16px",
                                            }}
                                        >
                                            <CardContent sx={{ p: 4 }}>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{
                                                        delay:
                                                            0.3 + index * 0.1,
                                                    }}
                                                >
                                                    <Typography
                                                        variant="h3"
                                                        sx={{
                                                            mb: 3,
                                                            color: "#667eea",
                                                        }}
                                                    >
                                                        {skillGroup.category}
                                                    </Typography>
                                                </motion.div>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    flexWrap="wrap"
                                                    useFlexGap
                                                >
                                                    {skillGroup.items.map(
                                                        (item, i) => (
                                                            <motion.div
                                                                key={`${skillGroup.id}-${i}`}
                                                                initial={{
                                                                    opacity: 0,
                                                                    scale: 0.8,
                                                                }}
                                                                whileInView={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        0.3 +
                                                                        index *
                                                                            0.1 +
                                                                        i *
                                                                            0.05,
                                                                }}
                                                                viewport={{
                                                                    once: true,
                                                                }}
                                                            >
                                                                <Chip
                                                                    label={item}
                                                                    sx={{
                                                                        background:
                                                                            "#667eea",
                                                                        color: "white",
                                                                        fontWeight: 500,
                                                                    }}
                                                                />
                                                            </motion.div>
                                                        )
                                                    )}
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionDiv>
                </Container>
            </Box>
            {/* Projects Section */}
            <Box component="section" sx={{ py: 10 }}>
                <Container maxWidth="lg">
                    <MotionDiv
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h2"
                                sx={{
                                    mb: 8,
                                    textAlign: "center",
                                    fontWeight: 700,
                                }}
                            >
                                Featured Projects
                            </Typography>
                        </motion.div>

                        <Grid container spacing={4}>
                            {projects.map((project) => (
                                <Grid size={{ xs: 12, md: 4 }} key={project.id}>
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ y: -15 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card
                                            sx={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                boxShadow:
                                                    "0 10px 40px rgba(0,0,0,0.1)",
                                                borderRadius: "16px",
                                                background:
                                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                color: "white",
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    flexGrow: 1,
                                                    display: "flex",
                                                    flexDirection: "column",
                                                }}
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    whileInView={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <Typography
                                                        variant="h3"
                                                        sx={{
                                                            mb: 2,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {project.title}
                                                    </Typography>
                                                </motion.div>

                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        mb: 4,
                                                        flexGrow: 1,
                                                        color: "rgba(255, 255, 255, 0.9)",
                                                    }}
                                                >
                                                    {project.description}
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    flexWrap="wrap"
                                                    useFlexGap
                                                >
                                                    {project.technologies.map(
                                                        (tech, index) => (
                                                            <motion.div
                                                                key={`${project.id}-${index}`}
                                                                initial={{
                                                                    opacity: 0,
                                                                }}
                                                                whileInView={{
                                                                    opacity: 1,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        0.3 +
                                                                        index *
                                                                            0.05,
                                                                }}
                                                            >
                                                                <Chip
                                                                    label={tech}
                                                                    sx={{
                                                                        background:
                                                                            "rgba(255, 255, 255, 0.2)",
                                                                        color: "white",
                                                                        fontWeight: 500,
                                                                    }}
                                                                />
                                                            </motion.div>
                                                        )
                                                    )}
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </MotionDiv>
                </Container>
            </Box>
            {/* Contact Section */}
            <Box
                component="section"
                sx={{
                    py: 10,
                    background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    textAlign: "center",
                    color: "white",
                }}
            >
                <Container maxWidth="sm">
                    <MotionDiv
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="h2"
                                sx={{ mb: 3, fontWeight: 700 }}
                            >
                                Let&apos;s Work Together
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="body1"
                                sx={{
                                    mb: 6,
                                    fontSize: "1.1rem",
                                    color: "rgba(255, 255, 255, 0.9)",
                                }}
                            >
                                I&apos;m always interested in hearing about new
                                projects and opportunities.
                            </Typography>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                            <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={2}
                                justifyContent="center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={{ ...buttonStyle, width: "100%" }}
                                >
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{
                                            background: "white",
                                            color: "#667eea",
                                            "&:hover": {
                                                background:
                                                    "rgba(255, 255, 255, 0.9)",
                                            },
                                        }}
                                        startIcon={<EmailIcon />}
                                    >
                                        Email Me
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={{ ...buttonStyle, width: "100%" }}
                                >
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            borderColor: "white",
                                            color: "white",
                                            "&:hover": {
                                                background:
                                                    "rgba(255, 255, 255, 0.1)",
                                            },
                                        }}
                                        startIcon={<LinkedInIcon />}
                                    >
                                        LinkedIn
                                    </Button>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    style={{ ...buttonStyle, width: "100%" }}
                                >
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{
                                            borderColor: "white",
                                            color: "white",
                                            "&:hover": {
                                                background:
                                                    "rgba(255, 255, 255, 0.1)",
                                            },
                                        }}
                                        startIcon={<GitHubIcon />}
                                    >
                                        GitHub
                                    </Button>
                                </motion.div>
                            </Stack>
                        </motion.div>
                    </MotionDiv>
                </Container>
            </Box>
            {/* Footer */}
            <Box
                component="footer"
                sx={{
                    py: 4,
                    background: "#1a1a1a",
                    color: "white",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                    © 2026 Portfolio. All rights reserved.
                </Typography>
            </Box>
        </Box>
    );
}
