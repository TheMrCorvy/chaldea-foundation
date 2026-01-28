import { FC } from "react";
import { useChaldeas } from "./useChaldeas";

export interface GlobeProps {
    countrySelected: string | null;
    handleClick: (country: string | null) => void;
}

const Globe: FC<GlobeProps> = ({ countrySelected, handleClick }) => {
    const { mapContainer } = useChaldeas();

    return <section ref={mapContainer}></section>;
};

export default Globe;
