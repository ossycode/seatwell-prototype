import { Button } from "@/components/catalyst/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/components/catalyst/dialog";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogBody>{message}</DialogBody>
      <DialogActions>
        <Button plain onClick={onClose} className="cursor-pointer">
          Cancel
        </Button>
        <Button color="red" onClick={onConfirm} className="cursor-pointer">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
