import * as d3 from "d3";
import worldData from "../../lib/world.json";
import {
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
import {
    D3Selection,
    GeoFeature,
    GlobeProjectionSetup,
    SetupGlobeProjectionParams,
} from "./types";

export const setupGlobeProjection = ({
    containerElement,
    onCountryClick,
}: SetupGlobeProjectionParams): GlobeProjectionSetup => {
    const projection = d3
        .geoOrthographic()
        .scale(BASE_SCALE)
        .center(center)
        .rotate(rotate)
        .translate(translate);

    const svg = d3
        .select(containerElement)
        .append("svg")
        .attr("width", BASE_SCALE)
        .attr("height", BASE_SCALE)
        .attr("viewBox", `0 0 ${BASE_SCALE} ${BASE_SCALE}`)
        .style("overflow", "visible")
        .style("display", "block")
        .style("position", "relative") as unknown as D3Selection;

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
        .style("opacity", opacity)
        .on("click", (event: MouseEvent, d: GeoFeature) => {
            if (markedCountries.includes(d.properties.name) && onCountryClick) {
                event.stopPropagation();
                onCountryClick(d.properties.name);
            }
        });

    return { projection, svg, circle, pathGenerator };
};
