"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";

import { WebRoutes } from "@/utils/routes";
import { Card, CardHeader } from "@nextui-org/react";
import Video from "@/components/icons/Video";

export interface Props {
    episodeId: string;
    displayName: string;
}

const AnimeEpisodeListItem: FC<Props> = ({ episodeId, displayName }) => {
    const router = useRouter();

    const handlePress = () => {
        router.push(WebRoutes.animeEpisode + episodeId);
    };

    return (
        <Card
            className="py-4 bg-cyan-800 hover:scale-105 w-full"
            isPressable
            onPress={handlePress}
            data-testid="test-anime-episode-list-item"
        >
            <CardHeader className="py-2 px-4 flex-row items-start">
                <h4 className="font-bold text-large capitalize">
                    {displayName}
                </h4>
                <Video size={24} color="currentColor" className="ml-7 mt-1" />
            </CardHeader>
        </Card>
    );
};

export default AnimeEpisodeListItem;
