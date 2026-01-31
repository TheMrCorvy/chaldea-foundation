// Animation
export interface AnimateFrameParams {
    projection: d3.GeoProjection;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
    circle: d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown>;
    initialRotate: [number, number];
    targetRotate: [number, number];
    initialScale: number;
    targetScale: number;
    startTime: number;
    onComplete: () => void;
    timestamp: number;
}

export type Coordinates = [number, number];

export interface FindCountryCenterParams {
    features: GeoJSON.Feature[];
    countryName: string;
}

export type FindCountryResult = Coordinates | null;

export type FindCountryCenter = (
    params: FindCountryCenterParams
) => FindCountryResult;

export interface GlobeAnimationState {
    isZoomedIn: boolean;
    selectedCountry: string | null;
    targetScale: number;
    currentScale: number;
    isAnimating: boolean;
}

export interface AnimateToCountryParams {
    countryName: string | null;
    targetZoomedState: boolean;
    projectionRef: React.MutableRefObject<d3.GeoProjection | null>;
    svgRef: React.MutableRefObject<d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    circleRef: React.MutableRefObject<d3.Selection<
        SVGCircleElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    pathGeneratorRef: React.MutableRefObject<d3.GeoPath<
        unknown,
        GeoJSON.Feature
    > | null>;
    animationStateRef: React.MutableRefObject<GlobeAnimationState>;
    animationTimerRef: React.MutableRefObject<number | null>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    worldData: GeoJSON.FeatureCollection;
    scale: number;
}

export interface ZoomOutParams {
    projectionRef: React.MutableRefObject<d3.GeoProjection | null>;
    svgRef: React.MutableRefObject<d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    circleRef: React.MutableRefObject<d3.Selection<
        SVGCircleElement,
        unknown,
        HTMLElement,
        unknown
    > | null>;
    pathGeneratorRef: React.MutableRefObject<d3.GeoPath<
        unknown,
        GeoJSON.Feature
    > | null>;
    animationStateRef: React.MutableRefObject<GlobeAnimationState>;
    animationTimerRef: React.MutableRefObject<number | null>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    scale: number;
}

// Drag and Drop
export interface GeoFeature extends GeoJSON.Feature {
    properties: { name: string };
}

export interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    offsetX: number;
    offsetY: number;
}

export interface SetupDragListenersParams {
    containerElement: HTMLElement;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    dragStateRef: React.MutableRefObject<DragState>;
    projection: d3.GeoProjection;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
    rotationControlsRef: React.MutableRefObject<{
        stopAutoRotation: () => void;
        resumeAutoRotation: () => d3.Timer;
    } | null>;
    isCountrySelectedRef: React.MutableRefObject<boolean>;
}

// Hook
export interface UseChaldeasProps {
    isMobile: boolean;
}

export interface UseChaldeasResult {
    mapContainer: React.RefObject<HTMLDivElement | null>;
    onCountryClick: (countryName: string | null) => void;
    countrySelected: string | null;
    open: boolean;
}

export type UseChaldeas = (props: UseChaldeasProps) => UseChaldeasResult;

export type SvgRef = d3.Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    unknown
> | null;

export type CircleRef = d3.Selection<
    SVGCircleElement,
    unknown,
    HTMLElement,
    unknown
> | null;

export type PathGeneratorRef = d3.GeoPath<unknown, GeoJSON.Feature> | null;

export type RotationControlsRef = {
    stopAutoRotation: () => void;
    resumeAutoRotation: () => d3.Timer;
} | null;

export type TimeRef = d3.Timer | null;

export type ProjectionRef = d3.GeoProjection | null;

// Projection
export interface SetupGlobeProjectionParams {
    containerElement: HTMLElement;
    onCountryClick?: (countryName: string) => void;
    scale: number;
}

export interface GlobeProjectionSetupResult {
    projection: d3.GeoProjection;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    circle: d3.Selection<SVGCircleElement, unknown, HTMLElement, unknown>;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
}

export type SetupGlobeProjection = (
    params: SetupGlobeProjectionParams
) => GlobeProjectionSetupResult;

export type D3Selection = d3.Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    unknown
>;

// Rotation
export interface UpdateGlobeParams {
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
}

export interface CreateRotationControlsParams {
    timerRef: React.MutableRefObject<d3.Timer | null>;
    projection: d3.GeoProjection;
    svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
    pathGenerator: d3.GeoPath<unknown, GeoJSON.Feature>;
    isMobile?: boolean;
}
