import { FC } from "react";
import { Grid } from "@mui/joy";
import { Directory } from "@repo/type-definitions";
import styles from "./subDirectoryCard.module.css";
import Link from "next/link";

export interface SubDirectoryCardProps {
    directory: Directory;
}

const SubDirectoryCard: FC<SubDirectoryCardProps> = ({ directory }) => {
    const tags =
        directory.tags && directory.tags?.length > 0
            ? directory.tags.map((tag) => tag.name).join(", ")
            : "No tags available";

    return (
        <Grid
            xs={12}
            md={6}
            lg={4}
            xl={3}
            sx={{
                mt: 2,
                mb: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Link
                href={`/directory/${directory.documentId}`}
                className={styles.link}
            >
                <label className={styles.folder}>
                    <input
                        type="checkbox"
                        className={styles.folder__toggle}
                        aria-label="Open folder"
                    />
                    <span className={styles.folder__shape}>
                        <span className={styles.folder__back}></span>
                        <span className={styles.folder__papers}>
                            <span
                                className={`${styles.paper} ${styles["paper--1"]}`}
                            ></span>
                            <span
                                className={`${styles.paper} ${styles["paper--2"]}`}
                            ></span>
                            <span
                                className={`${styles.paper} ${styles["paper--3"]}`}
                            ></span>
                        </span>
                        <span className={styles.folder__front}></span>
                    </span>
                    <span className={styles.folder__meta}>
                        <span className={styles.folder__title}>
                            {directory.display_name}
                        </span>
                        <span className={styles.folder__count}>{tags}</span>
                    </span>
                </label>
            </Link>
        </Grid>
    );
};

export default SubDirectoryCard;
