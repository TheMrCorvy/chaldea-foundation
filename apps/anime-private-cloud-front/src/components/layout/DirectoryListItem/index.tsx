import { FC } from "react";

import { WebRoutes } from "@/utils/routes";

import { Divider, Tooltip, Link } from "@nextui-org/react";
import WarningLine from "@/components/icons/WarningLine";
import Folder from "@/components/icons/Folder";

export interface Props {
    displayName: string;
    directoryId: string;
    isAdult?: boolean;
}

const DirectoryListItem: FC<Props> = ({
    displayName,
    directoryId,
    isAdult,
}) => (
    <div className="w-full" data-testid="test-directory-list-item">
        <div className="space-y-1 relative">
            <div className="flex items-center relative">
                <Folder
                    size={24}
                    color="currentColor"
                    className="w-6 h-6 mr-2 text-red-500"
                />
                <h4 className="text-medium font-medium capitalize">
                    {displayName}
                </h4>
            </div>
            <Link
                size="sm"
                href={WebRoutes.directory + directoryId}
                color="foreground"
                className="text-gray-300 text-xs"
                underline="always"
                showAnchorIcon
            >
                Ver contenido de la carpeta
            </Link>
            {isAdult && (
                <div
                    className="absolute top-0 right-0"
                    data-testid="test-directory-list-item-warning"
                >
                    <Tooltip
                        placement="left-start"
                        content="Este anime tiene contenido sensible"
                    >
                        <WarningLine size={24} color="currentColor" />
                    </Tooltip>
                </div>
            )}
        </div>
        <Divider className="my-4" />
    </div>
);

export default DirectoryListItem;
