import Box from "@mui/joy/Box";
import type { PaginationObject } from "@repo/type-definitions";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

import Pagination, { PaginationProps } from ".";

const createPagination = (
    overrides: Partial<PaginationObject> = {}
): PaginationObject => ({
    page: 1,
    pageSize: 10,
    pageCount: 1,
    total: 10,
    ...overrides,
});

const meta = {
    title: "Components/Pagination",
    render: (args: PaginationProps) => <Pagination {...args} />,
    parameters: {
        layout: "centered",
    },
    decorators: [
        (Story) => (
            <Box
                sx={{
                    width: "100%",
                    minHeight: "180px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 3,
                    background:
                        "radial-gradient(circle at 15% 15%, #f7fafc 0%, #eef3f8 42%, #e4ecf4 100%)",
                }}
            >
                <Story />
            </Box>
        ),
    ],
    args: {
        pagination: createPagination({
            page: 3,
            pageCount: 6,
            total: 60,
        }),
        onChange: fn(),
    },
} satisfies Meta<PaginationProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FewPages: Story = {
    args: {
        pagination: createPagination({
            page: 3,
            pageCount: 5,
            total: 50,
        }),
    },
};

export const NearStartWithEndEllipsis: Story = {
    args: {
        pagination: createPagination({
            page: 2,
            pageCount: 10,
            total: 100,
        }),
    },
};

export const MiddleWithTwoEllipses: Story = {
    args: {
        pagination: createPagination({
            page: 5,
            pageCount: 10,
            total: 100,
        }),
    },
};

export const NearEndWithStartEllipsis: Story = {
    args: {
        pagination: createPagination({
            page: 9,
            pageCount: 10,
            total: 100,
        }),
    },
};

export const SinglePageHidden: Story = {
    args: {
        pagination: createPagination({
            page: 1,
            pageCount: 1,
            total: 10,
        }),
    },
};
