"use client";

import { FC, Fragment } from "react";

import { Divider, Accordion, AccordionItem } from "@nextui-org/react";
import MaxCharLink from "@/components/MaxCharLink";
import organizedDirectories from "@/utils/filterDirectoriesWithParents";
import { WebRoutes } from "@/utils/routes";

interface DirectoryLink {
    label: string;
    url: string;
}

export interface Props {
    directories: DirectoryLink[];
}

const DirectoriesSidebar: FC<Props> = ({ directories }) => {
    const groupedDirectories = Object.entries(
        organizedDirectories(directories)
    );

    const mappedItems = groupedDirectories.map(([key, value]) => ({
        key,
        value,
    }));

    return (
        <aside
            className="w-[15rem] relative scrollbar-thin"
            data-testid="directories-sidebar"
        >
            <div className="pt-1 pb-2 px-3 bg-blue-500 rounded-md shadow-lg z-10">
                <h3 className="text-xl mt-2 text-white">Animes Disponibles</h3>
            </div>
            <Divider className="my-3" />
            <div className="scrollbar-none rounded-md h-auto bg-blue-500 p-4 max-h-[75vh] overflow-y-scroll relative">
                <Accordion
                    showDivider={false}
                    variant="light"
                    className="px-0"
                    itemClasses={{
                        base: "mb-4",
                        title: "text-white font-semibold text-base",
                        trigger:
                            "bg-slate-700 hover:bg-slate-800 rounded-md px-3 py-2",
                        content: "px-0 pb-2",
                    }}
                >
                    {groupedDirectories.map(([letter, dirs]) => (
                        <AccordionItem
                            key={`accordion-${letter}`}
                            title={letter}
                            aria-label={`Directories starting with ${letter}`}
                        >
                            <ul className="space-y-1">
                                {dirs.map((dir, i) => (
                                    <li
                                        className="pl-3"
                                        key={`sidebar-${dir.url}-${i}`}
                                    >
                                        <MaxCharLink
                                            url={dir.url}
                                            label={dir.label}
                                            popoverPlacement="right"
                                            maxLength={22}
                                            className="text-white text-sm capitalize"
                                        />
                                        {i !== dirs.length - 1 && (
                                            <Divider className="my-1" />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </aside>
    );
};

export default DirectoriesSidebar;
