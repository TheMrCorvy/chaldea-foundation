import { FC, ChangeEvent } from "react";
import { Pagination as MUIPagination } from "@mui/material";

export interface PaginationProps {
    totalPages: number;
    pageNumber: number;
    handlePageChange: (
        _event: ChangeEvent<unknown>,
        value: number
    ) => Promise<void>;
}

const Pagination: FC<PaginationProps> = ({
    totalPages,
    pageNumber,
    handlePageChange,
}) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <span
            style={{
                flexGrow: 1,
                justifyContent: "flex-end",
                display: "flex",
                marginTop: "2rem",
            }}
        >
            <MUIPagination
                page={pageNumber}
                count={totalPages}
                onChange={handlePageChange}
                color="primary"
                variant="outlined"
                shape="rounded"
                sx={{
                    "& .MuiPaginationItem-root": {
                        color: "#eeeeee",
                    },
                    "& .MuiPaginationItem-root:not(.Mui-selected)": {
                        border: "none",
                    },
                    "& .Mui-selected": {
                        color: "#fff",
                    },
                }}
            />
        </span>
    );
};

export default Pagination;
