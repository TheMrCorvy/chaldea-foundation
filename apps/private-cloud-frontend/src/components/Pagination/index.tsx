import { PaginationObject } from "@repo/type-definitions";
import { FC } from "react";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export interface PaginationProps {
    pagination: PaginationObject;
    onChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ pagination, onChange }) => {
    const { page, pageCount } = pagination;
    const generatePageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];

        if (pageCount <= 7) {
            for (let i = 1; i <= pageCount; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (page <= 3) {
                pages.push(2, 3, 4);
                pages.push("ellipsis-end");
                pages.push(pageCount);
            } else if (page >= pageCount - 2) {
                pages.push("ellipsis-start");
                pages.push(
                    pageCount - 3,
                    pageCount - 2,
                    pageCount - 1,
                    pageCount
                );
            } else {
                pages.push("ellipsis-start");
                pages.push(page - 1, page, page + 1);
                pages.push("ellipsis-end");
                pages.push(pageCount);
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    const handlePrevious = () => {
        if (page > 1) {
            onChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < pageCount) {
            onChange(page + 1);
        }
    };

    const handlePageClick = (pageNumber: number) => {
        onChange(pageNumber);
    };

    if (pagination.pageCount === 1) {
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                flexWrap: "wrap",
                padding: 0.5,
            }}
        >
            <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                onClick={handlePrevious}
                disabled={page === 1}
                aria-label="Previous page"
                sx={{
                    borderRadius: "50%",
                }}
            >
                <ChevronLeftIcon />
            </IconButton>
            {pageNumbers.map((item, index) => {
                if (typeof item === "string") {
                    return (
                        <Box
                            key={`${item}-${index}`}
                            sx={{
                                px: 1,
                                color: "text.secondary",
                                userSelect: "none",
                            }}
                        >
                            ···
                        </Box>
                    );
                }

                return (
                    <IconButton
                        key={item}
                        variant={page === item ? "solid" : "plain"}
                        color={page === item ? "primary" : "neutral"}
                        size="sm"
                        onClick={() => handlePageClick(item)}
                        sx={{
                            minWidth: "30px",
                            minHeight: "30px",
                            borderRadius: "50%",
                        }}
                    >
                        {item}
                    </IconButton>
                );
            })}
            <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                onClick={handleNext}
                disabled={page === pageCount}
                aria-label="Next page"
                sx={{
                    borderRadius: "50%",
                }}
            >
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
};

export default Pagination;
