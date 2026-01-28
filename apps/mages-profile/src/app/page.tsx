"use client";

import AsideHelper from "@/components/AsideHelper";
import { markedCountries } from "@/components/Globe/constants";
import GlobeWrapper from "@/components/Globe/GlobeWrapper";
import MagesData from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";
import { useState } from "react";

export default function HomePage() {
    const [countrySelected, setCountrySelected] = useState<string | null>(null);

    const handleClick = (country: string | null) => {
        setCountrySelected(country);
    };

    return (
        <StarryContainer>
            <>
                <GlobeWrapper
                    countrySelected={countrySelected}
                    handleClick={handleClick}
                />
                <MagesData />
                <AsideHelper
                    markedCountries={markedCountries}
                    handleClick={handleClick}
                />
            </>
        </StarryContainer>
    );
}
