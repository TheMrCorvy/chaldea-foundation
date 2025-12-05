"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import type { EmotionCache } from "@emotion/cache";
import createCache from "@emotion/cache";

export default function EmotionRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    const [cache] = React.useState<EmotionCache>(() => {
        const cache = createCache({ key: "css", prepend: true });
        cache.compat = true;
        return cache;
    });

    useServerInsertedHTML(() => {
        const inserted = cache.inserted;
        if (!inserted) return null;

        const entries = Object.entries(inserted);
        if (entries.length === 0) return null;

        let styles = "";
        let dataEmotionAttribute = cache.key;

        for (const [name, value] of entries) {
            if (typeof value !== "string") continue;
            dataEmotionAttribute += ` ${cache.key}-${name}`;
            styles += value;
        }

        if (!styles) return null;

        return (
            <style
                data-emotion={dataEmotionAttribute}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        );
    });

    return <CacheProvider value={cache}>{children}</CacheProvider>;
}
