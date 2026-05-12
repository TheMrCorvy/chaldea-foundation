"use client";

import {
    useState,
    useCallback,
    FC,
    ReactNode,
    useRef,
    useEffect,
    MouseEvent,
} from "react";
import { Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useRandomString from "@/hooks/useRandomString";

const generateRandomString = (length: number, chars: string): string => {
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const FONT_SIZE_PX = 14;
const LINE_HEIGHT = 1.15;

export interface GlitchBackgroundCardProps {
    children?: ReactNode;
    isMobile?: boolean;
    height?: string | number;
    width?: string | number;
}

const GlitchBackgroundCard: FC<GlitchBackgroundCardProps> = ({
    children,
    isMobile = false,
    height = "100%",
    width = "100%",
}) => {
    const chars = useRandomString({
        useMayus: true,
        useMinus: false,
        useNumbers: true,
        useSymbols: false,
    }).build();

    const [text, setText] = useState<string>("");
    const [isHovering, setIsHovering] = useState<boolean>(isMobile);
    const [mousePosition, setMousePosition] = useState<{
        x: number;
        y: number;
    }>({
        x: 0,
        y: 0,
    });

    const containerRef = useRef<HTMLDivElement>(null);

    const regenerateText = useCallback(
        (containerWidth: number, containerHeight: number) => {
            if (containerWidth <= 0 || containerHeight <= 0) return;

            const averageCharWidth =
                typeof document !== "undefined"
                    ? (() => {
                          const canvas = document.createElement("canvas");
                          const context = canvas.getContext("2d");
                          if (!context) return FONT_SIZE_PX * 0.55;

                          context.font = `${FONT_SIZE_PX}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
                          const metrics = context.measureText("W");
                          return metrics.width || FONT_SIZE_PX * 0.55;
                      })()
                    : FONT_SIZE_PX * 0.55;

            const charsPerLine = Math.max(
                1,
                Math.floor(containerWidth / averageCharWidth)
            );
            const lineHeightPx = FONT_SIZE_PX * LINE_HEIGHT;
            const requiredLines = Math.max(
                1,
                Math.ceil(containerHeight / lineHeightPx) + 2
            );
            const requiredChars = charsPerLine * requiredLines;

            const raw = generateRandomString(requiredChars, chars);
            const lines = raw.match(new RegExp(`.{1,${charsPerLine}}`, "g"));

            setText(lines?.join("\n") ?? "");
        },
        [chars]
    );

    /**
     * Observe size changes to keep alignment perfect
     */
    useEffect(() => {
        if (!containerRef.current) return;

        if (isMobile) {
            regenerateText(
                containerRef.current.clientWidth,
                containerRef.current.clientHeight
            );
        }

        const observer = new ResizeObserver(([entry]) => {
            regenerateText(entry.contentRect.width, entry.contentRect.height);
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [isMobile, regenerateText]);

    const handleMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });

            if (containerRef.current) {
                regenerateText(
                    containerRef.current.clientWidth,
                    containerRef.current.clientHeight
                );
            }
        },
        [regenerateText]
    );

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        if (containerRef.current) {
            regenerateText(
                containerRef.current.clientWidth,
                containerRef.current.clientHeight
            );
        }
    }, [regenerateText]);

    const handleMouseLeave = useCallback(() => {
        setIsHovering(false);
    }, []);

    const cornerIconSize = 24;

    return (
        <Box
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                position: "relative",
                width,
                height,
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                borderLeft: "1px solid rgba(25,118,210, 0.6)",
                borderRight: "1px solid rgba(25,118,210, 0.6)",
                overflow: "visible",
                "&::before, &::after": {
                    content: '""',
                    position: "absolute",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    zIndex: -1,
                },
                // Vertical line
                "&::before": {
                    width: "1px",
                    height: "100%",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                },
                // Horizontal line
                "&::after": {
                    height: "1px",
                    width: "100%",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                },
            }}
        >
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                }}
            />
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    top: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(90deg)",
                }}
            />
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    right: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(180deg)",
                }}
            />
            <AddIcon
                color="primary"
                sx={{
                    position: "absolute",
                    bottom: -cornerIconSize / 2,
                    left: -cornerIconSize / 2,
                    fontSize: cornerIconSize,
                    transform: "rotate(270deg)",
                }}
            />
            <Box
                ref={containerRef}
                sx={{
                    position: "absolute",
                    top: "2.5%",
                    left: "2.5%",
                    width: "95%",
                    height: "95%",
                    overflow: "hidden",
                    opacity: isHovering ? 1 : 0,
                    transition: "opacity 300ms ease-out",
                    fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                    fontSize: `${FONT_SIZE_PX}px`,
                    lineHeight: LINE_HEIGHT,
                    whiteSpace: "pre",
                    background: `radial-gradient(
                        circle at ${mousePosition.x}px ${mousePosition.y}px,
                        rgba(154, 98, 181, 0.5) 20%,
                        rgba(41, 121, 255, 0.5) 30%,
                        rgba(56, 182, 255, 0.5) 50%,
                        rgba(42, 252, 152, 0.5)
                    )`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    borderRadius: "18px",
                }}
            >
                {text}
            </Box>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "18px",
                    flex: 1,
                    minHeight: "100%",
                    zIndex: 1,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                        minHeight: "100%",
                        color: "white",
                        marginX: "11px",
                        wordBreak: "break-word",
                        flexDirection: "column",
                        padding: 0,
                        transition: "background-color 300ms ease",
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default GlitchBackgroundCard;
