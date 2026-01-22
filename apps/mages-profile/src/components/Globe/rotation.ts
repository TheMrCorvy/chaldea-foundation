import * as d3 from "d3";
import { sensitivity } from "./constants";

interface GeoFeature extends GeoJSON.Feature {
    properties: { name: string };
}

const updateGlobe = (
    projection: d3.GeoProjection,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>
): void => {
    svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
        "d",
        (d: GeoFeature) => pathGenerator(d) as string
    );
};

export const createRotationControls = (
    timerRef: React.MutableRefObject<d3.Timer | null>,
    projection: d3.GeoProjection,
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>
) => {
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
            updateGlobe(projection, svg, pathGenerator);
        }, 200);
        return timerRef.current;
    };

    return { stopAutoRotation, resumeAutoRotation };
};
