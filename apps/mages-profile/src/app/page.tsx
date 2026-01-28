import GlobeWrapper from "@/components/Globe/GlobeWrapper";
import MagesData from "@/components/MagesData";
import StarryContainer from "@/components/StarryContainer";

export default function HomePage() {
    return (
        <StarryContainer>
            <>
                <GlobeWrapper />
                <MagesData />
            </>
        </StarryContainer>
    );
}
