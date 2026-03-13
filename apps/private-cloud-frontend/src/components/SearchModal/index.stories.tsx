import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ComponentProps, useState } from "react";

import SearchModal from ".";

type SearchModalStoryProps = ComponentProps<typeof SearchModal>;

const modalContent = (
    <Box sx={{ minWidth: { xs: "85vw", sm: 420 }, py: 1 }}>
        <Typography level="title-lg" sx={{ mb: 1 }}>
            Busqueda avanzada
        </Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
            Este contenido se renderiza dentro del modal cuando open es true.
        </Typography>
    </Box>
);

const meta = {
    title: "Components/SearchModal",
    component: SearchModal,
    parameters: {
        layout: "centered",
    },
    args: {
        open: true,
        onClose: () => undefined,
        children: modalContent,
    },
    argTypes: {
        onClose: {
            control: false,
        },
        children: {
            control: false,
        },
    },
} satisfies Meta<typeof SearchModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {};

export const Closed: Story = {
    args: {
        open: false,
        children: (
            <Box>
                <Typography>
                    Este contenido no debe verse cuando open es false.
                </Typography>
            </Box>
        ),
    },
};

function InteractiveRender(args: SearchModalStoryProps) {
    const [open, setOpen] = useState(args.open);

    return (
        <Box>
            <Button onClick={() => setOpen(true)} sx={{ mb: 2 }}>
                Abrir modal
            </Button>
            <SearchModal
                {...args}
                open={open}
                onClose={() => {
                    setOpen(false);
                }}
            >
                <Box sx={{ minWidth: { xs: "85vw", sm: 420 }, py: 1 }}>
                    <Typography level="title-lg" sx={{ mb: 1 }}>
                        Modal interactivo
                    </Typography>
                    <Typography level="body-sm" sx={{ mb: 2 }}>
                        Puedes cerrar el modal con el boton de abajo o haciendo
                        click fuera del dialogo.
                    </Typography>
                    <Button onClick={() => setOpen(false)} variant="soft">
                        Cerrar modal
                    </Button>
                </Box>
            </SearchModal>
        </Box>
    );
}

export const Interactive: Story = {
    args: {
        open: false,
    },
    render: (args) => <InteractiveRender {...args} />,
};
