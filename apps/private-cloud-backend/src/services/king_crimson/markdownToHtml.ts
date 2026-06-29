/**
 * Simple helper to convert basic markdown to HTML.
 */
export const markdownToHtml = (md: string | undefined | null): string => {
    if (!md) return '';

    const html = md
        // Escape HTML tags to prevent XSS/rendering issues
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Replace bold **text** or __text__ with <strong>text</strong>
        .replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
        // Replace italic *text* or _text_ with <em>text</em>
        .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
        // Replace links [text](url) with <a href="url">text</a>
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
        // Convert headers: # Header -> <h1>Header</h1>
        .replace(/^#\s+(.*)$/gm, '<h1>$1</h1>')
        .replace(/^##\s+(.*)$/gm, '<h2>$1</h2>')
        .replace(/^###\s+(.*)$/gm, '<h3>$1</h3>')
        // Normalize line breaks
        .replace(/\r\n/g, '\n');

    // Process lists: lines starting with `- ` or `* `
    const lines = html.split('\n');
    let inList = false;
    const processedLines: string[] = [];

    for (const line of lines) {
        const listMatch = line.match(/^\s*[-*+]\s+(.*)$/);
        if (listMatch) {
            if (!inList) {
                processedLines.push('<ul>');
                inList = true;
            }
            processedLines.push(`<li>${listMatch[1]}</li>`);
        } else {
            if (inList) {
                processedLines.push('</ul>');
                inList = false;
            }
            // If empty line, close paragraph or add space. If not list, make it paragraph or keep line.
            if (line.trim() !== '') {
                processedLines.push(`<p>${line}</p>`);
            }
        }
    }

    if (inList) {
        processedLines.push('</ul>');
    }

    return processedLines.join('\n');
};

export default markdownToHtml;
