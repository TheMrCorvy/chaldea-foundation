type Cue = {
    start: number;
    end: number;
    text: string;
};

const parseVtt = (vtt: string): Cue[] => {
    const cues: Cue[] = [];
    const blocks = vtt.split(/\n\n+/);

    for (const block of blocks) {
        const lines = block
            .trim()
            .split("\n")
            .map((line) => line.trim());
        if (lines.length === 0) continue;
        if (lines[0].startsWith("WEBVTT") || lines[0].startsWith("NOTE"))
            continue;

        // Support optional cue identifier lines by finding the time-line inside the block
        const timeIndex = lines.findIndex((line) => line.includes("-->"));
        if (timeIndex === -1) continue;

        const timeLine = lines[timeIndex];
        const text = lines.slice(timeIndex + 1).join("\n");

        // Accept either "HH:MM:SS.mmm" or "MM:SS.mmm"
        const match = timeLine.match(
            /(\d{1,2}:\d{2}:\d{2}\.\d+|\d{1,2}:\d{2}\.\d+)\s*-->\s*(\d{1,2}:\d{2}:\d{2}\.\d+|\d{1,2}:\d{2}\.\d+)/
        );
        if (!match) continue;

        const toSeconds = (t: string) => {
            const parts = t.split(":").map(Number);
            if (parts.length === 3) {
                const [h, m, s] = parts;
                return h * 3600 + m * 60 + s;
            } else if (parts.length === 2) {
                const [m, s] = parts;
                return m * 60 + s;
            }
            return 0;
        };

        cues.push({
            start: toSeconds(match[1]),
            end: toSeconds(match[2]),
            text,
        });
    }

    return cues;
};

export default parseVtt;
