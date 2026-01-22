import * as d3 from "d3";
import worldData from "../../lib/world.json";
import {
    width,
    height,
    BASE_SCALE,
    center,
    rotate,
    translate,
    strokeColor,
    thinnerStrokeWidth,
    backgrounds,
    strokeWidth,
    opacity,
    markedCountries,
} from "./constants";

interface GeoFeature extends GeoJSON.Feature {
    properties: { name: string };
}

export interface GlobeProjectionSetup {
    projection: d3.GeoProjection;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    circle: d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown>;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
}

export const setupGlobeProjection = (
    containerElement: HTMLElement
): GlobeProjectionSetup => {
    const projection = d3
        .geoOrthographic()
        .scale(BASE_SCALE)
        .center(center)
        .rotate(rotate)
        .translate(translate);
    const svg = d3
        .select(containerElement)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "visible")
        .style("display", "block")
        .style("position", "relative") as unknown as d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    >;
    const circle = svg
        .append("circle")
        .attr("fill", "#EEE")
        .attr("stroke", strokeColor)
        .attr("stroke-width", thinnerStrokeWidth)
        .attr("cx", translate[0])
        .attr("cy", translate[1])
        .attr("r", BASE_SCALE);
    const pathGenerator = d3.geoPath().projection(projection);

    svg.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(worldData.features as GeoFeature[])
        .enter()
        .append("path")
        .attr("d", (d: GeoFeature) => pathGenerator(d) as string)
        .attr("fill", (d: GeoFeature) =>
            markedCountries.includes(d.properties.name)
                ? backgrounds[0]
                : backgrounds[1]
        )
        .style("stroke", strokeColor)
        .style("stroke-width", strokeWidth)
        .style("opacity", opacity);

    return { projection, svg, circle, pathGenerator };
};
