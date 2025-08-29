import { Page } from "@/types/nextjs";

import { redirect } from "next/navigation";
import { StrapiService } from "@/services/StrapiService";
import { CookiesList, getCookie, JwtCookie, UserCookie } from "@/utils/cookies";
import { WebRoutes } from "@/utils/routes";
import DirectoryListItem from "@/components/layout/DirectoryListItem";
import SearchInput from "@/components/SearchInput";
import { sortDirectories } from "@/utils/sort";
import { RoleTypes } from "@/types/StrapiSDK";

export default async function Search({ searchParams }: Page) {
    const jwt = (await getCookie(CookiesList.JWT)) as JwtCookie | null;
    const user = (await getCookie(CookiesList.USER)) as UserCookie | null;

    if (!jwt || !user) {
        return redirect(WebRoutes.login);
    }

    const service = StrapiService();
    const result = await service.getDirectories({
        jwt: jwt.jwt,
        queryParams: {
            filters: {
                display_name: {
                    $contains: searchParams.query as string,
                },
            },
        },
    });

    const filteredResult = result.data.filter((directory) => {
        if (directory.adult && user.role.type === RoleTypes.ANIME_WATCHER) {
            return false;
        }
        return true;
    });

    return (
        <section>
            <div className="mb-5 xs:block md:hidden">
                <SearchInput defaultValue={searchParams.query as string} />
            </div>
            {filteredResult.length === 0 && (
                <>
                    <h1 className="w-full text-lg sm:text-xl md:text-3xl text-center font-bold mt-1">
                        No se vos, pero yo no veo que esté...
                    </h1>
                    <h3 className="w-full text-md sm:text-lg md:text-2xl italic text-center mt-2">
                        {`"${searchParams.query}"`}
                    </h3>
                </>
            )}
            {sortDirectories(filteredResult).map((directory, i) => (
                <DirectoryListItem
                    key={`search-result-page-${directory.id}-${i}`}
                    displayName={directory.display_name}
                    directoryId={directory.documentId}
                    isAdult={directory.adult}
                />
            ))}
        </section>
    );
}
