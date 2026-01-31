"use client";

import dynamic from "next/dynamic";
import { FC } from "react";

const ToggleSound = dynamic(() => import("@/components/ToggleSound"), {
    ssr: false,
});

const DynamicClientComponents: FC = () => {
    return <ToggleSound />;
};

export default DynamicClientComponents;
