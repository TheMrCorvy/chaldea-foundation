import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { FC, FormEvent, useState } from "react";
import { themeConfig } from "@/lib/theme";
import {
    Box,
    FormControl,
    FormHelperText,
    FormLabel,
    Stack,
    Switch,
} from "@mui/joy";
import Pagination from "../Pagination";

export interface SearchParams {
    query: string;
    switchAdult: boolean;
    switchOnlyAdult: boolean;
    page: number;
}

export interface SearchBarProps {
    allowAdultContent?: boolean;
    handleSubmit: (searchParams: SearchParams) => Promise<void>;
    pagination: {
        page: number;
        pageCount: number;
        total: number;
    };
}

const SearchBar: FC<SearchBarProps> = ({
    allowAdultContent,
    handleSubmit,
    pagination,
}) => {
    const [query, setQuery] = useState("");
    const [switchAdult, setSwitchAdult] = useState(false);
    const [switchOnlyAdult, setSwitchOnlyAdult] = useState(false);

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newQuery = query.trim();

        if (newQuery === "") return;

        setQuery(newQuery);

        await handleSubmit({
            query: newQuery,
            switchAdult,
            switchOnlyAdult,
            page: pagination.page,
        });
        (document.activeElement as HTMLInputElement)?.blur();
    };

    return (
        <Stack component="form" onSubmit={onSubmit} gap={2}>
            <Input
                required
                color="primary"
                placeholder="Buscar..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                startDecorator={<SearchIcon />}
                endDecorator={
                    <IconButton
                        type="submit"
                        variant="plain"
                        color="primary"
                        size="sm"
                        sx={{ borderRadius: "50%" }}
                    >
                        <ArrowForwardIcon />
                    </IconButton>
                }
                variant="outlined"
                sx={{
                    // Geometry and Shape
                    "--Input-radius": "50px",
                    "--Input-gap": "8px",
                    marginBottom: allowAdultContent ? 2 : 0,
                    // Sizing
                    width: {
                        xs: "100%",
                        sm: "12rem",
                        md: "30rem",
                        lg: "35rem",
                        xl: "40rem",
                    },
                    maxWidth: "80vw",
                    color:
                        themeConfig.colorSchemes?.dark?.palette?.text
                            ?.secondary || "white",
                    "& input::placeholder": {
                        color:
                            themeConfig.colorSchemes?.dark?.palette
                                ?.neutral?.[300] || "white",
                        opacity: 0.5,
                    },

                    // Visuals
                    // boxShadow: "sm",
                    // borderColor: "neutral.outlinedBorder",
                    "&:hover": {
                        color:
                            themeConfig.colorSchemes?.dark?.palette?.text
                                ?.secondary || "white",
                    },
                    // "&::before": {
                    //     transition: "box-shadow .15s ease-in-out",
                    // },
                    // "&:focus-within": {
                    //     borderColor: "primary.500",
                    //     // boxShadow: "0 0 0 2px var(--joy-palette-primary-200)",
                    // },
                }}
            />
            {allowAdultContent && (
                <>
                    <FormControl orientation="horizontal">
                        <Box sx={{ flexGrow: 1 }}>
                            <FormLabel sx={{ typography: "title-sm" }}>
                                Permitir contenido sensible
                            </FormLabel>
                        </Box>
                        <Switch
                            checked={switchAdult}
                            onChange={() => {
                                setSwitchAdult(!switchAdult);
                                handleSubmit({
                                    query,
                                    switchAdult: !switchAdult,
                                    switchOnlyAdult,
                                    page: pagination.page,
                                });
                            }}
                        />
                    </FormControl>
                    <FormControl orientation="horizontal">
                        <Box sx={{ flexGrow: 1 }}>
                            <FormLabel sx={{ typography: "title-sm" }}>
                                Buscar solo contenido sensible
                            </FormLabel>
                        </Box>
                        <Switch
                            checked={switchOnlyAdult}
                            onChange={() => {
                                setSwitchOnlyAdult(!switchOnlyAdult);
                                handleSubmit({
                                    query,
                                    switchAdult: true,
                                    switchOnlyAdult: !switchOnlyAdult,
                                    page: pagination.page,
                                });
                            }}
                        />
                    </FormControl>
                    <FormHelperText>
                        El contenido sensible son series/películas con mucho fan
                        service o gore.
                    </FormHelperText>
                </>
            )}
            {pagination.total > 0 && (
                <Pagination
                    pagination={{
                        page: pagination.page,
                        pageCount: pagination.pageCount,
                        pageSize: 100,
                        total: 1,
                    }}
                    onChange={async (newPage) =>
                        await handleSubmit({
                            query,
                            switchAdult,
                            switchOnlyAdult,
                            page: newPage,
                        })
                    }
                />
            )}
        </Stack>
    );
};

export default SearchBar;
