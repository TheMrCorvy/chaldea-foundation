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

    const [text, setText] = useState<string>(
        isMobile ? generateRandomString(2000, chars) : ""
    );
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
        (containerWidth: number) => {
            const FONT_SIZE = 14;
            const charsPerLine = Math.floor(containerWidth / FONT_SIZE);

            if (charsPerLine <= 0) return;

            const raw = generateRandomString(4000, chars);
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

        const observer = new ResizeObserver(([entry]) => {
            regenerateText(entry.contentRect.width * 1.7);
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [regenerateText]);

    const handleMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });

            if (containerRef.current) {
                regenerateText(containerRef.current.clientWidth * 1.7);
            }
        },
        [regenerateText]
    );

    const handleMouseEnter = useCallback(() => {
        setIsHovering(true);
        if (containerRef.current) {
            regenerateText(containerRef.current.clientWidth * 1.7);
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
                    fontSize: "14px",
                    lineHeight: 1.15,
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
                    borderRadius: "10px",
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
                    borderRadius: "16px",
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
