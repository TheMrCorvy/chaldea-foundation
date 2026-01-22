import * as d3 from "d3";
import { sensitivity } from "./constants";

interface GeoFeature extends GeoJSON.Feature {
    properties: {
        name: string;
    };
}

/**
 * Starts or resumes automatic rotation of the globe
 */
export const startAutoRotation = (
    projection: d3.GeoProjection,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>
): d3.Timer => {
    return d3.timer(() => {
        const dRotate = projection.rotate();
        const k = sensitivity / projection.scale();
        projection.rotate([dRotate[0] - 1 * k, dRotate[1]]);
        svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
            "d",
            (d: GeoFeature) => pathGenerator(d)
        );
    }, 200);
};

/**
 * Creates rotation control handlers
 */
export const createRotationControls = (
    timerRef: React.MutableRefObject<d3.Timer | null>,
    projection: d3.GeoProjection,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>
) => {
    const stopAutoRotation = () => {
        if (timerRef.current !== null) {
            timerRef.current.stop();
            timerRef.current = null;
        }
    };

    const resumeAutoRotation = () => {
        if (timerRef.current !== null) {
            return timerRef.current;
        }

        timerRef.current = startAutoRotation(projection, svg, pathGenerator);
        return timerRef.current;
    };

    return {
        stopAutoRotation,
        resumeAutoRotation,
    };
};
