import BottomNav from "@/components/BottomNavbar";
import MainCategories from "@/components/MainCategories";
import { CookiesList, getCookie, JwtCookie, MeResponse } from "@/utils/cookies";
import { Container } from "@mui/joy";
import PlatformService from "@repo/platform-service-sdk";
import { logData } from "@repo/shared-utils/log-data";
import { Directory, RoleTypes } from "@repo/type-definitions";

const Home = async () => {
    const jwt = (await getCookie(CookiesList.JWT)) as JwtCookie;
    const userCookie = (await getCookie(CookiesList.USER)) as MeResponse | null;
    const platformService = new PlatformService();
    platformService.setJWT(jwt.jwt);

    const response = await platformService.call("bDirectoryGetBDirectories", {
        query: {
            filters: {
                parent_directory: {
                    $null: true,
                },
            },
        },
    });

    logData({
        title: "Fetched Main Directories",
        data: response.data,
        addSeparatorAfter: true,
        addSpaceAfter: true,
        timeStamp: true,
        layer: "external_http_requests",
        type: "info",
    });

    const mainDirectories = response.data.data as Directory[];

    return (
        <>
            <Container
                sx={{
                    textAlign: "center",
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <MainCategories directories={mainDirectories} />
            </Container>
            <BottomNav
                mainDirectories={mainDirectories}
                allowAdultContent={
                    userCookie?.role.type === RoleTypes.ADULT_ANIME_WATCHER
                }
            />
        </>
    );
};

export default Home;
