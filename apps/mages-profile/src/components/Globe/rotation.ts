import * as d3 from "d3";
import { sensitivity } from "./constants";
import {
    CreateRotationControlsParams,
    GeoFeature,
    UpdateGlobeParams,
} from "./types";

export const updateGlobe = (params: UpdateGlobeParams): void => {
    const { svg, pathGenerator } = params;
    svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
        "d",
        (d: GeoFeature) => pathGenerator(d) as string
    );
};

export const createRotationControls = (
    params: CreateRotationControlsParams
) => {
    const { timerRef, projection, svg, pathGenerator } = params;

    const stopAutoRotation = (): void => {
        if (timerRef.current) {
            timerRef.current.stop();
            timerRef.current = null;
        }
    };

    const resumeAutoRotation = (): d3.Timer => {
        stopAutoRotation();
        timerRef.current = d3.timer(() => {
            const [rx] = projection.rotate();
            const k = sensitivity / projection.scale();
            projection.rotate([rx - k, projection.rotate()[1]]);

            updateGlobe({ svg, pathGenerator });
        }, 200);
        return timerRef.current;
    };

    return { stopAutoRotation, resumeAutoRotation };
};
