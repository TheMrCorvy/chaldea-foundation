import * as d3 from "d3";
import worldData from "../../lib/world.json";
import {
    center,
    rotate,
    strokeColor,
    thinnerStrokeWidth,
    strokeWidth,
    opacity,
    markedCountries,
    oceanColor,
    selectedColor,
    countryColor,
} from "./constants";
import {
    Coordinates,
    D3Selection,
    GeoFeature,
    SetupGlobeProjection,
} from "./types";

export const setupGlobeProjection: SetupGlobeProjection = ({
    containerElement,
    onCountryClick,
    scale,
}) => {
    const translate: Coordinates = [scale / 2, scale / 2];

    const projection = d3
        .geoOrthographic()
        .scale(scale)
        .center(center)
        .rotate(rotate)
        .translate(translate);

    const svg = d3
        .select(containerElement)
        .append("svg")
        .attr("width", scale)
        .attr("height", scale)
        .attr("viewBox", `0 0 ${scale} ${scale}`)
        .style("overflow", "visible")
        .style("display", "block")
        .attr("data-sound", "modal")
        .style("position", "relative") as unknown as D3Selection;

    const circle = svg
        .append("circle")
        .attr("fill", oceanColor)
        .attr("stroke", strokeColor)
        .attr("stroke-width", thinnerStrokeWidth)
        .attr("cx", translate[0])
        .attr("cy", translate[1])
        .attr("data-sound", "modal")
        .attr("r", scale);
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
                ? selectedColor
                : countryColor
        )
        .attr("data-sound", "modal")
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
