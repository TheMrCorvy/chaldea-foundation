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
    properties: {
        name: string;
    };
}

export interface GlobeProjectionSetup {
    projection: d3.GeoProjection;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    circle: d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown>;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
}

/**
 * Creates and initializes the D3 projection for the globe
 */
export const createProjection = (): d3.GeoProjection => {
    return d3
        .geoOrthographic()
        .scale(BASE_SCALE)
        .center(center)
        .rotate(rotate)
        .translate(translate);
};

/**
 * Creates the SVG element for the globe
 */
export const createSVGElement = (
    containerElement: HTMLElement
): d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown> => {
    return d3
        .select(containerElement)
        .append("svg")
        .attr("width", width)
        .attr("height", height) as unknown as d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    >;
};

/**
 * Creates the background circle for the globe
 */
export const createCircle = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    initialScale: number
): d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown> => {
    return svg
        .append("circle")
        .attr("fill", "#EEE")
        .attr("stroke", strokeColor)
        .attr("stroke-width", thinnerStrokeWidth)
        .attr("cx", translate[0])
        .attr("cy", translate[1])
        .attr("r", initialScale);
};

/**
 * Renders the countries on the globe
 */
export const renderCountries = (
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>,
    projection: d3.GeoProjection
): void => {
    const pathGenerator = d3.geoPath().projection(projection);

    const map = svg.append("g");

    map.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(worldData.features as GeoFeature[])
        .enter()
        .append("path")
        .attr("d", (d: GeoFeature) => pathGenerator(d))
        .attr("fill", (d: GeoFeature) =>
            markedCountries.includes(d.properties.name)
                ? backgrounds[0]
                : backgrounds[1]
        )
        .style("stroke", strokeColor)
        .style("stroke-width", strokeWidth)
        .style("opacity", opacity);
};

/**
 * Creates a path generator for the given projection
 */
export const createPathGenerator = (
    projection: d3.GeoProjection
): d3.GeoPath<unknown, GeoJSON.Feature> => {
    return d3.geoPath().projection(projection);
};

/**
 * Sets up the complete globe projection with all elements
 */
export const setupGlobeProjection = (
    containerElement: HTMLElement
): GlobeProjectionSetup => {
    const projection = createProjection();
    const svg = createSVGElement(containerElement);
    const initialScale = projection.scale();
    const circle = createCircle(svg, initialScale);
    const pathGenerator = createPathGenerator(projection);

    renderCountries(svg, projection);

    return {
        projection,
        svg,
        circle,
        pathGenerator,
    };
};
