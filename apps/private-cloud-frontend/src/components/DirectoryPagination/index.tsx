"use client";

import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/joy";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export interface DirectoryPaginationProps {
    page: number;
    pageCount: number;
}

const DirectoryPagination: FC<DirectoryPaginationProps> = ({
    page,
    pageCount,
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (pageCount <= 1) return null;

    const navigateTo = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        router.push(`${pathname}?${params.toString()}`);
    };

    const pages = buildPageRange(page, pageCount);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                my: 3,
            }}
        >
            <IconButton
                size="sm"
                variant="outlined"
                disabled={page <= 1}
                onClick={() => navigateTo(page - 1)}
                sx={navBtnSx}
                aria-label="Página anterior"
            >
                <KeyboardArrowLeftIcon />
            </IconButton>

            {pages.map((p, i) =>
                p === "ellipsis" ? (
                    <Typography
                        key={`ellipsis-${i}`}
                        level="body-sm"
                        sx={{ px: 0.5, color: "#7EB3E8" }}
                    >
                        …
                    </Typography>
                ) : (
                    <IconButton
                        key={p}
                        size="sm"
                        variant={p === page ? "solid" : "outlined"}
                        onClick={() => navigateTo(p as number)}
                        sx={
                            p === page
                                ? { ...pageBtnSx, ...activeBtnSx }
                                : pageBtnSx
                        }
                        aria-label={`Página ${p}`}
                        aria-current={p === page ? "page" : undefined}
                    >
                        {p}
                    </IconButton>
                )
            )}

            <IconButton
                size="sm"
                variant="outlined"
                disabled={page >= pageCount}
                onClick={() => navigateTo(page + 1)}
                sx={navBtnSx}
                aria-label="Página siguiente"
            >
                <KeyboardArrowRightIcon />
            </IconButton>
        </Box>
    );
};

/** Builds a compact page number list with at most one ellipsis on each side */
function buildPageRange(
    current: number,
    total: number
): (number | "ellipsis")[] {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | "ellipsis")[] = [1];

    if (current > 3) pages.push("ellipsis");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (current < total - 2) pages.push("ellipsis");

    pages.push(total);
    return pages;
}

const sharedBtnSx = {
    minWidth: 32,
    minHeight: 32,
    borderColor: "#0B6BCB40",
    transition: "all 0.18s ease",
};

const pageBtnSx = {
    ...sharedBtnSx,
    color: "#D2DBE8",
    backgroundColor: "#0B3A6E",
    "&:hover": {
        backgroundColor: "#0B4F96",
        borderColor: "#0B6BCB",
        color: "#fff",
    },
};

const activeBtnSx = {
    backgroundColor: "#0B6BCB",
    color: "#fff",
    borderColor: "#0B6BCB",
    boxShadow: "0 0 0 2px #0B6BCB55",
    "&:hover": {
        backgroundColor: "#0B6BCB",
    },
};

const navBtnSx = {
    ...sharedBtnSx,
    color: "#7EB3E8",
    "&:hover:not(:disabled)": {
        backgroundColor: "#0B3A6E",
        borderColor: "#0B6BCB",
        color: "#fff",
    },
    "&:disabled": {
        opacity: 0.3,
        borderColor: "#0B6BCB20",
    },
};

export default DirectoryPagination;
