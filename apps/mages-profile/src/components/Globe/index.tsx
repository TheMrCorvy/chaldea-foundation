"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import worldData from "../../lib/world.json";
import {
    initialRotationState,
    width,
    sensitivity,
    height,
    backgrounds,
    strokeColor,
    strokeWidth,
    opacity,
    thinnerStrokeWidth,
    scale,
    center,
    rotate,
    translate,
} from "./constants";

interface GeoFeature extends GeoJSON.Feature {
    properties: {
        name: string;
    };
}

const visitedCountries = ["Argentina"];

const GlobeComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const timerRef = useRef<d3.Timer | null>(null);
    const dragStateRef = useRef(initialRotationState);

    useEffect(() => {
        if (!mapContainer.current) return;

        const containerElement = mapContainer.current;

        const projection = d3
            .geoOrthographic()
            .scale(scale)
            .center(center)
            .rotate(rotate)
            .translate(translate);

        const initialScale = projection.scale();
        const pathGenerator = d3.geoPath().projection(projection);

        const svg = d3
            .select(containerElement)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("circle")
            .attr("fill", "#EEE")
            .attr("stroke", strokeColor)
            .attr("stroke-width", thinnerStrokeWidth)
            .attr("cx", translate[0])
            .attr("cy", translate[1])
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
                    ? backgrounds[0]
                    : backgrounds[1]
            )
            .style("stroke", strokeColor)
            .style("stroke-width", strokeWidth)
            .style("opacity", opacity);

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
            const bRotate = projection.rotate();
            projection.rotate([bRotate[0] + dx * k, bRotate[1] - dy * k]);

            svg.selectAll<SVGPathElement, GeoFeature>("path").attr(
                "d",
                (d: GeoFeature) => pathGenerator(d)
            );
        };

        const handleMouseLeave = (): void => {
            timerRef.current = d3.timer(() => {
                const cRotate = projection.rotate();
                const k = sensitivity / projection.scale();
                projection.rotate([cRotate[0] - 1 * k, cRotate[1]]);
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
            const dRotate = projection.rotate();
            const k = sensitivity / projection.scale();
            projection.rotate([dRotate[0] - 1 * k, dRotate[1]]);
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
