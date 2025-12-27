import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import { FC, ReactNode } from "react";

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}
const SearchModal: FC<SearchModalProps> = ({ open, onClose, children }) => {
    return (
        <Modal keepMounted={false} open={open} onClose={onClose}>
            <ModalDialog variant="plain">
                <DialogContent
                    sx={{
                        paddingX: 2,
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                            backgroundColor: "#0A1220",
                            borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#4A607E",
                            borderRadius: "4px",
                            "&:hover": {
                                backgroundColor: "#5A7394",
                            },
                        },
                    }}
                >
                    {children}
                </DialogContent>
            </ModalDialog>
        </Modal>
    );
};

export default SearchModal;
