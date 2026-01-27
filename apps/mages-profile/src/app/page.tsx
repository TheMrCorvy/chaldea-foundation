import { GlobeWrapper } from "@/components/Globe/GlobeWrapper";
import MagesData from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";

export default function TravelPage() {
    return (
        <StarryContainer>
            <>
                <GlobeWrapper />
                <MagesData />
            </>
        </StarryContainer>
    );
}
