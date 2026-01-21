import { useEffect, useRef } from "react";
import * as d3 from "d3";
import worldData from "../../lib/world.json";

interface GeoFeature extends GeoJSON.Feature {
    properties: {
        name: string;
    };
}

const visitedCountries = [
    "France",
    "China",
    "Italy",
    "Sri Lanka",
    "Turkey",
    "Greece",
    "Malta",
    "Hungary",
    "Portugal",
    "Marocco",
    "Argentina",
];

const GlobeComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const width = mapContainer.current?.clientWidth || 500;
        const height = 500;
        const sensitivity = 75;

        const projection = d3
            .geoOrthographic()
            .scale(250)
            .center([0, 0])
            .rotate([0, -30])
            .translate([width / 2, height / 2]);

        const initialScale = projection.scale();
        const pathGenerator = d3.geoPath().projection(projection);

        const svg = d3
            .select(mapContainer.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("circle")
            .attr("fill", "#EEE")
            .attr("stroke", "#000")
            .attr("stroke-width", "0.2")
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .attr("r", initialScale);

        const map = svg.append("g");

        map.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(worldData.features as GeoFeature[])
            .enter()
            .append("path")
            .attr("d", (d: GeoFeature) => pathGenerator(d))
            .attr("fill", (d: GeoFeature) =>
                visitedCountries.includes(d.properties.name)
                    ? "#E63946"
                    : "white"
            )
            .style("stroke", "black")
            .style("stroke-width", 0.3)
            .style("opacity", 0.8);

        d3.timer(() => {
            const rotate = projection.rotate();
            const k = sensitivity / projection.scale();
            projection.rotate([rotate[0] - 1 * k, rotate[1]]);
            svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                "d",
                (d: GeoFeature) => pathGenerator(d)
            );
        }, 200);

        return () => {
            d3.selectAll("svg").remove();
        };
    }, [mapContainer]);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "red",
            }}
        >
            <div ref={mapContainer}></div>
        </div>
    );
};

export default GlobeComponent;
