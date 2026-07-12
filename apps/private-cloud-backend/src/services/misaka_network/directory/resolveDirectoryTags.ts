import PlatformService from '@repo/platform-service-sdk';
import type { ResolvedTag } from './types';
import { logData } from '@salvatore.hakase/log-data';
import { BlogPostCategory, TagType } from '@repo/type-definitions/blog-post-categories';

const determineTagType = (directoryPath: string): TagType => {
    const lastSegment = directoryPath.split('/').filter(Boolean).pop() ?? '';

    if (lastSegment.startsWith('! ') || lastSegment.startsWith('* ')) {
        return 'explicit_content';
    }

    return 'media_content';
};

const getOrCreateTag = async (
    tagName: string,
    tagType: TagType,
    platformService: PlatformService
): Promise<ResolvedTag | null> => {
    const existing = await platformService.call('aPostCategoryGetAPostCategories', {
        query: {
            filters: {
                name: { $eq: tagName },
                type_of_category: { $eq: tagType },
            },
        },
    });

    const items = existing.data?.data as BlogPostCategory[] | undefined;

    if (items && items.length > 0) {
        logData({
            title: `Reusing tag: ${tagName}`,
            layer: 'queue_jobs',
            type: 'info',
            timeStamp: true,
            addSpaceAfter: true,
        });
        return { documentId: items[0].documentId };
    }

    const created = await platformService.call('aPostCategoryPostAPostCategories', {
        body: {
            data: {
                name: tagName,
                type_of_category: tagType,
            },
        },
    });

    const newItem = created.data?.data as BlogPostCategory | undefined;
    if (!newItem) return null;

    logData({
        title: `Created tag: ${tagName}`,
        layer: 'queue_jobs',
        type: 'info',
        timeStamp: true,
        addSpaceAfter: true,
    });
    return { documentId: newItem.documentId };
};

export const resolveDirectoryTags = async (
    tagNames: string[],
    directoryPath: string,
    platformService: PlatformService
): Promise<ResolvedTag[]> => {
    const tagType = determineTagType(directoryPath);
    const resolved: ResolvedTag[] = [];

    for (const tagName of tagNames) {
        const tag = await getOrCreateTag(tagName, tagType, platformService);

        if (!tag) throw new Error(`Failed to create or retrieve tag: ${tagName}`);

        resolved.push(tag);
    }

    return resolved;
};
