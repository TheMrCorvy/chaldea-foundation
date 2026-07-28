import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import SubDirectoryCard, { SubDirectoryCardProps } from ".";
import type { Directory, BlogPostCategory } from "@repo/type-definitions";

const mockTags: BlogPostCategory[] = [
    {
        id: 1,
        name: "anime",
        documentId: "t1",
        type_of_category: "media_content",
    },
    {
        id: 2,
        name: "acción",
        documentId: "t2",
        type_of_category: "media_content",
    },
    {
        id: 3,
        name: "comedia",
        documentId: "t3",
        type_of_category: "media_content",
    },
    {
        id: 4,
        name: "fantasía",
        documentId: "t4",
        type_of_category: "media_content",
    },
    {
        id: 5,
        name: "drama",
        documentId: "t5",
        type_of_category: "media_content",
    },
    {
        id: 6,
        name: "romance",
        documentId: "t6",
        type_of_category: "media_content",
    },
    {
        id: 7,
        name: "aventura",
        documentId: "t7",
        type_of_category: "media_content",
    },
    {
        id: 8,
        name: "misterio",
        documentId: "t8",
        type_of_category: "media_content",
    },
];

const baseDirectory: Directory = {
    id: 1,
    display_name:
        "Directorio de Anime con un nombre super mega archy recontra largo para probar el truncado de texto en la tarjeta",
    path: "/media/anime",
    createdAt: new Date("2026-07-18T00:00:00.000Z"),
    updatedAt: new Date("2026-07-18T00:00:00.000Z"),
    age_rating: "everyone",
    documentId: "dir-anime",
    publishedAt: "2026-07-18T00:00:00.000Z",
    tags: mockTags,
    cover: null,
    description: null,
    is_processing: false,
};

const meta = {
    title: "Components/SubDirectoryCard",
    render: (args: SubDirectoryCardProps) => {
        const numbers = [1, 2, 3, 4, 5, 6];
        const directories: Directory[] = numbers.map((num) => ({
            ...args.directory,
            id: args.directory.id + num,
            documentId: `${args.directory.documentId}-${num}`,
            display_name: `${args.directory.display_name} ${num}`,
        }));

        return (
            <Box sx={{ width: "100%", p: 1, boxSizing: "border-box" }}>
                <Grid container spacing={3}>
                    {directories.map((dir) => (
                        <SubDirectoryCard
                            key={dir.documentId}
                            directory={dir}
                        />
                    ))}
                </Grid>
            </Box>
        );
    },
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story: React.ComponentType<object>) => (
            <Box
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    overflow: "hidden",
                    background:
                        "radial-gradient(circle at 20% 10%, #1f2a44 0%, #0b1020 42%, #05070f 100%)",
                }}
            >
                <Story />
            </Box>
        ),
    ],
    args: {
        directory: baseDirectory,
    },
} satisfies Meta<SubDirectoryCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoTags: Story = {
    args: {
        directory: {
            ...baseDirectory,
            tags: null,
        },
    },
};

export const LongTitle: Story = {
    args: {
        directory: {
            ...baseDirectory,
            display_name:
                "Este es un directorio con un nombre extremadamente largo para probar el truncado",
        },
    },
};
