import { FC } from "react";
import styles from "./Loader.module.css";

const Loader: FC = () => {
    const dots = Array.from({ length: 6 });
    const innerDots = Array.from({ length: 3 });

    return (
        <div className={styles.pl}>
            {dots.map((_, i) => (
                <div key={i} className={styles.dot}>
                    {innerDots.map((_, j) => (
                        <div key={j} className={styles.dotLayer} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Loader;
