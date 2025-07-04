import Button from "@/components/ui/button/Button";
import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import { Payout } from "@/types/payout";
import React from "react";

interface ConfirmPayoutProps {
  isOpen: boolean;
  closeModal: () => void;
  payout: Payout;
  onConfirm: () => void;
  isloading: boolean;
}
const ConfirmPayoutModal = ({
  isOpen,
  closeModal,
  onConfirm,
  payout,
  isloading,
}: ConfirmPayoutProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[584px] p-5 lg:p-10"
    >
      <form className="">
        <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
          You are about to process a payout for the seller below. Please review
          and confirm.
        </h4>

        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
          <div className="col-span-1">
            <Label>Seller </Label>
            <Input type="email" defaultValue={payout.seller_email} disabled />
          </div>

          <div className="col-span-1">
            <Label>Ticket ID</Label>
            <Input
              type="text"
              defaultValue={payout.ticket.verification_code}
              disabled
            />
          </div>

          <div className="col-span-1">
            <Label>Amount</Label>
            <Input type="text" defaultValue={payout.amount} disabled />
          </div>

          <div className="col-span-1">
            <Label>Payout Status</Label>
            <Input type="text" defaultValue={payout.status} disabled />
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button
            size="sm"
            variant="outline"
            onClick={closeModal}
            disabled={isloading}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={onConfirm} disabled={isloading}>
            {isloading ? (
              <span className="flex items-center gap-4">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                  />
                </svg>
                <span>Processing...</span>
              </span>
            ) : (
              "Process Payout"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ConfirmPayoutModal;
