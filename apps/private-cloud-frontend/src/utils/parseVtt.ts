type Cue = {
    start: number;
    end: number;
    text: string;
};

const parseVtt = (vtt: string): Cue[] => {
    const cues: Cue[] = [];
    const blocks = vtt.split(/\n\n+/);

    for (const block of blocks) {
        const lines = block.trim().split("\n");
        if (lines.length < 2) continue;
        if (lines[0].startsWith("WEBVTT")) continue;

        const timeLine = lines[0];
        const text = lines.slice(1).join("\n");

        const match = timeLine.match(
            /(\d\d:\d\d:\d\d\.\d+)\s-->\s(\d\d:\d\d:\d\d\.\d+)/
        );
        if (!match) continue;

        const toSeconds = (t: string) => {
            const [h, m, s] = t.split(":");
            return Number(h) * 3600 + Number(m) * 60 + Number(s);
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
