const cleanMarkdown = (md: string | undefined | null): string => {
    if (!md) return '';
    return (
        md
            // Replace bold **text** or __text__ with text
            .replace(/(\*\*|__)(.*?)\1/g, '$2')
            // Replace italic *text* or _text_ with text
            .replace(/(\*|_)(.*?)\1/g, '$2')
            // Replace links [text](url) with "text (url)"
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)')
            // Replace headers # text with text
            .replace(/^#+\s+(.*)$/gm, '$1')
            // Replace bullet points starting with - or * or + with a unicode bullet point
            .replace(/^\s*[-*+]\s+/gm, '• ')
            // Normalize newlines
            .replace(/\r\n/g, '\n')
    );
};
export default cleanMarkdown;
