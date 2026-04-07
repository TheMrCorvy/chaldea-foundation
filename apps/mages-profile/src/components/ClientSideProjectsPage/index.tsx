import { SectionsProjectsSection } from "@repo/type-definitions/dynamic-page";
import MagicBento from "../MagicBento";
import StarryContainer from "../StarryContainer";
import { FC } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ClientSideUiEffects from "../DynamicZone/ClientSideUI/ClientSideUiEffects";

export interface ClientSideProjectsPageProps {
    projectsSection: SectionsProjectsSection;
    appSection?: string;
}

const ClientSideProjectsPage: FC<ClientSideProjectsPageProps> = ({
    projectsSection,
    appSection,
}) => {
    const isMobile = useMediaQuery().max.width("sm");

    return (
        <StarryContainer>
            <ClientSideUiEffects
                routerPush={appSection ? "/" + appSection : "/"}
            />
            <section
                style={{
                    marginTop: isMobile ? "4rem" : 0,
                    marginBottom: isMobile ? "4rem" : 0,
                    padding: isMobile ? "0 1rem" : 0,
                    width: "100%",
                    maxWidth: "1200px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <MagicBento
                    layout="vertical"
                    projects={projectsSection.projects || []}
                />
            </section>
        </StarryContainer>
    );
};

export default ClientSideProjectsPage;
