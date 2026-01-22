"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import worldData from "../../lib/world.json";

interface GeoFeature extends GeoJSON.Feature {
    properties: {
        name: string;
    };
}

const visitedCountries = ["Argentina"];

const GlobeComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const timerRef = useRef<d3.Timer | null>(null);
    const dragStateRef = useRef({
        isDragging: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
    });

    useEffect(() => {
        if (!mapContainer.current) return;

        const containerElement = mapContainer.current;

        const width = containerElement?.clientWidth || 500;
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
            .select(containerElement)
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

        const handleMouseDown = (e: MouseEvent): void => {
            dragStateRef.current.isDragging = true;
            timerRef.current?.stop();
            dragStateRef.current.startX = e.clientX;
            dragStateRef.current.startY = e.clientY;
            containerElement.style.cursor = "grabbing";
        };

        const handleMouseMove = (e: MouseEvent): void => {
            if (!dragStateRef.current.isDragging) return;

            const dx = e.clientX - dragStateRef.current.startX;
            const dy = e.clientY - dragStateRef.current.startY;

            dragStateRef.current.startX = e.clientX;
            dragStateRef.current.startY = e.clientY;

            const k = sensitivity / projection.scale();
            const rotate = projection.rotate();
            projection.rotate([rotate[0] + dx * k, rotate[1] - dy * k]);

            svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                "d",
                (d: GeoFeature) => pathGenerator(d)
            );
        };

        const handleMouseLeave = (): void => {
            timerRef.current = d3.timer(() => {
                const rotate = projection.rotate();
                const k = sensitivity / projection.scale();
                projection.rotate([rotate[0] - 1 * k, rotate[1]]);
                svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                    "d",
                    (d: GeoFeature) => pathGenerator(d)
                );
            }, 200);
        };

        const handleMouseUp = (): void => {
            dragStateRef.current.isDragging = false;
            containerElement.style.cursor = "grab";

            handleMouseLeave();
        };

        containerElement.style.cursor = "grab";
        svg.on("mousedown", handleMouseDown);
        containerElement.addEventListener("mousemove", handleMouseMove);
        containerElement.addEventListener("mouseup", handleMouseUp);
        containerElement.addEventListener("mouseleave", handleMouseUp);

        timerRef.current = d3.timer(() => {
            const rotate = projection.rotate();
            const k = sensitivity / projection.scale();
            projection.rotate([rotate[0] - 1 * k, rotate[1]]);
            svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                "d",
                (d: GeoFeature) => pathGenerator(d)
            );
        }, 200);

        return () => {
            if (timerRef.current !== null) {
                timerRef.current.stop();
            }

            svg.on("mousedown", null);
            containerElement.removeEventListener("mousemove", handleMouseMove);
            containerElement.removeEventListener("mouseup", handleMouseUp);
            containerElement.removeEventListener("mouseleave", handleMouseUp);
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
            <div
                ref={mapContainer}
                style={{
                    width: 500,
                    maxWidth: "100%",
                    overflow: "hidden",
                }}
            ></div>
        </div>
    );
};

export default GlobeComponent;
