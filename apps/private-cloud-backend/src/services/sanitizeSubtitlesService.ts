const ensureUtf8Bom = (content: string): string => {
    if (!content.startsWith('\uFEFF')) {
        return '\uFEFF' + content;
    }
    return content;
};

const normalizeHeader = (vtt: string): string => {
    vtt = vtt.replace(/\r\n/g, '\n');

    vtt = vtt.replace(/^[\s\S]*?(WEBVTT)/i, 'WEBVTT');

    if (!vtt.startsWith('WEBVTT\n')) {
        vtt = vtt.replace(/^WEBVTT/i, 'WEBVTT\n');
    }

    return vtt.replace(/^WEBVTT\s*/i, 'WEBVTT\n\n');
};

const normalizeCues = (vtt: string): string => {
    const lines = vtt.split('\n');
    const out: string[] = [];

    let buffer: string[] = [];

    for (const line of lines) {
        if (line.includes('-->')) {
            if (buffer.length) {
                out.push(...buffer, '');
                buffer = [];
            }
            out.push(line.trim());
        } else if (line.trim() === '') {
            if (buffer.length) {
                out.push(...buffer, '');
                buffer = [];
            }
        } else {
            buffer.push(line.trim());
        }
    }

    if (buffer.length) {
        out.push(...buffer);
    }

    return out.join('\n').replace(/\n{3,}/g, '\n\n');
};

export const sanitizeWebVtt = (raw: string): string => {
    let vtt = raw;

    vtt = normalizeHeader(vtt);
    vtt = normalizeCues(vtt);
    vtt = ensureUtf8Bom(vtt);

    return vtt.trim() + '\n';
};

export const validateVtt = (vtt: string): void => {
    if (!vtt.startsWith('\uFEFFWEBVTT')) {
        throw new Error('Invalid WebVTT header');
    }

    if (!vtt.includes('-->')) {
        throw new Error('No cues detected');
    }
};
