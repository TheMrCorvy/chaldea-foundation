import { Skeleton, Grid } from "@mui/joy";
import { FC } from "react";

const SubDirectoriesLoading: FC = () => {
    return (
        <Grid
            container
            spacing={2}
            component="section"
            sx={{ marginBottom: 3 }}
        >
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Grid key={`skeleton-${i}`} xs="auto">
                    <Skeleton
                        variant="rectangular"
                        width={300}
                        height={60}
                        sx={{
                            borderRadius: "8px",
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default SubDirectoriesLoading;
