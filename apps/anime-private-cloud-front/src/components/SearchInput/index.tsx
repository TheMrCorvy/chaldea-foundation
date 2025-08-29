import React, { FC } from "react";
import { Button, Input } from "@nextui-org/react";
import { redirect } from "next/navigation";
import SearchTwoLines from "../icons/SearchTwoLines";
import { WebRoutes } from "@/utils/routes";

export interface Props {
    defaultValue?: string;
}

const SearchInput: FC<Props> = ({ defaultValue }) => {
    const search = async (formData: FormData) => {
        "use server";
        redirect(
            WebRoutes.search +
                `?query=${encodeURIComponent(formData.get("search") as string)}`
        );
    };

    return (
        <form action={search}>
            <Input
                data-testid="search-input"
                variant="bordered"
                color="primary"
                placeholder="Buscar anime"
                name="search"
                endContent={
                    <Button
                        data-testid="search-submit-btn"
                        color="primary"
                        variant="light"
                        isIconOnly
                        size="sm"
                    >
                        <SearchTwoLines size={16} color="currentColor" />
                    </Button>
                }
                type="text"
                className="max-w-xs"
                defaultValue={defaultValue || ""}
            />
        </form>
    );
};

export default SearchInput;
