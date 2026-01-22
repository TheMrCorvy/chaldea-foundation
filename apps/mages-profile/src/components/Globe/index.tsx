"use client";

import { useChaldeas } from "./useChaldeas";

const GlobeComponent = () => {
    const chaldeas = useChaldeas();

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
            }}
        >
            <div
                ref={chaldeas}
                style={{
                    width: 500,
                    maxWidth: "100%",
                    overflow: "hidden",
                }}
            ></div>
        </div>
    );
};

export default GlobeComponent;
