import Box from "@mui/joy/Box";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import SearchBar from ".";
import type { SearchBarProps } from ".";

const createPagination = (
    overrides: Partial<SearchBarProps["pagination"]> = {}
): SearchBarProps["pagination"] => ({
    page: 2,
    pageCount: 5,
    total: 0,
    ...overrides,
});

const handleSubmit: SearchBarProps["handleSubmit"] = async () =>
    Promise.resolve();

const meta = {
    title: "Components/SearchBar",
    render: (args: SearchBarProps) => <SearchBar {...args} />,
    parameters: {
        layout: "fullscreen",
    },
    decorators: [
        (Story) => (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 4,
                    background:
                        "radial-gradient(circle at 20% 10%, #1f2a44 0%, #0b1020 42%, #05070f 100%)",
                }}
            >
                <Story />
            </Box>
        ),
    ],
    args: {
        allowAdultContent: false,
        handleSubmit,
        pagination: createPagination(),
    },
    argTypes: {
        handleSubmit: {
            control: false,
        },
    },
} satisfies Meta<SearchBarProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAdultFilters: Story = {
    args: {
        allowAdultContent: true,
        pagination: createPagination({
            page: 7,
        }),
    },
};

export const WithPagination: Story = {
    args: {
        pagination: createPagination({
            page: 1,
            total: 50,
        }),
    },
};

export const AdultFiltersAndPagination: Story = {
    args: {
        allowAdultContent: true,
        pagination: createPagination({
            page: 3,
            pageCount: 8,
            total: 120,
        }),
    },
};
