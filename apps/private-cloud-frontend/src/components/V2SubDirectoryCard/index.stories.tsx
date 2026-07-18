import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import V2SubDirectoryCard, { V2SubDirectoryCardProps } from ".";
import type {
    Directory,
    ImageComponent,
    BlogPostCategory,
} from "@repo/type-definitions";

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
    {
        id: 9,
        name: "suspenso",
        documentId: "t9",
        type_of_category: "media_content",
    },
    {
        id: 10,
        name: "terror",
        documentId: "t10",
        type_of_category: "media_content",
    },
    {
        id: 11,
        name: "ciencia ficción",
        documentId: "t11",
        type_of_category: "media_content",
    },
    {
        id: 12,
        name: "sobrenatural",
        documentId: "t12",
        type_of_category: "media_content",
    },
    {
        id: 13,
        name: "recuentos de la vida",
        documentId: "t13",
        type_of_category: "media_content",
    },
    {
        id: 14,
        name: "deportes",
        documentId: "t14",
        type_of_category: "media_content",
    },
];

const mockCover: ImageComponent = {
    documentId: "cover-1",
    id: 1,
    name: "cover_3fdc4b84b7.jpg",
    alternativeText: null,
    caption: null,
    width: 300,
    height: 450,
    formats: {} as ImageComponent["formats"],
    mime: "image/jpeg",
    url: "/uploads/cover_3fdc4b84b7.jpg",
    publishedAt: "2026-07-18T00:00:00.000Z",
    size: 45,
};

const baseDirectory: Directory = {
    id: 1,
    display_name: "Directorio de Anime",
    path: "/media/anime",
    createdAt: new Date("2026-07-18T00:00:00.000Z"),
    updatedAt: new Date("2026-07-18T00:00:00.000Z"),
    age_rating: "everyone",
    documentId: "dir-anime",
    publishedAt: "2026-07-18T00:00:00.000Z",
    tags: mockTags,
    cover: mockCover,
    description:
        "Esta es una descripción extremadamente larga para probar que el componente de subdirectorios corta el texto de manera adecuada y muestra los tres puntos suspensivos al final de la segunda línea, sin romper la estructura de la tarjeta.",
    is_processing: false,
};

const meta = {
    title: "Components/V2SubDirectoryCard",
    render: (args: V2SubDirectoryCardProps) => {
        const numbers = [1, 2, 3, 4, 5, 6];
        const directories: Directory[] = [];
        numbers.forEach((num) => {
            directories.push({
                ...args.directory,
                id: args.directory.id + num,
                documentId: `${args.directory.documentId}-${num}`,
                display_name: `${args.directory.display_name} ${num}`,
            });
        });

        return (
            <Box sx={{ width: "100%", p: 1, boxSizing: "border-box" }}>
                <Grid container spacing={3}>
                    {directories.map((dir) => (
                        <V2SubDirectoryCard
                            key={dir.documentId}
                            directory={dir}
                            imageBaseUrl={args.imageBaseUrl}
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
        imageBaseUrl: "https://admin.chaldea.foundation",
    },
} satisfies Meta<V2SubDirectoryCardProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoDescription: Story = {
    args: {
        directory: {
            ...baseDirectory,
            description: null,
        },
    },
};
