import { Modal } from "@/components/ui/modal";
import React, { useEffect, useState } from "react";
import { Seat } from "./GameDetailPageView";
import Button from "@/components/ui/button/Button";
import toast from "react-hot-toast";
import { useBuyTicketMutation } from "@/services/ticketsApi";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useModal } from "@/hooks/useModal";
import PaymentCompletedModal from "./PaymentCompleted";

const paymentMethods = [
  { id: "card", title: "Credit/Debit Card" },
  { id: "paypal", title: "PayPal" },
];

interface ConfirmBuyModalProps {
  isOpen: boolean;
  closeModal: () => void;
  ticketInfo: Seat;
}

export default function ConfirmBuyModal({
  isOpen,
  closeModal,
  ticketInfo,
}: ConfirmBuyModalProps) {
  const supabase = createClient();
  const [currentUser, setCurrentUser] = useState<User | null>();

  useEffect(() => {
    supabase.auth.getUser().then((data) => {
      setCurrentUser(data.data.user);
    });
  });

  const [paymentType, setPaymentType] = useState("card");
  const [buyTicket, { isLoading }] = useBuyTicketMutation();

  const paymentCompletedModal = useModal();

  const [form, setForm] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiry: "",
    cvc: "",
  });

  const handleConfirm = async () => {
    // Basic mock validation
    if (!form.cardNumber || !form.nameOnCard || !form.expiry || !form.cvc) {
      toast.error("Please fill in all payment details.");
      return;
    }

    if (!currentUser || !ticketInfo.ticket_id) return;
    console.log(currentUser?.id);

    try {
      await buyTicket({
        ticketId: ticketInfo.ticket_id,
        buyerId: currentUser?.id,
      }).unwrap();

      toast.success("Ticket purchased successfully!");
      closeModal();
      paymentCompletedModal.openModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.error || "Purchase failed");
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="p-5 lg:p-10 m-4">
        <div className="px-2">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Confirm Purchase
          </h4>
          <p className="text-sm text-gray-700 mb-4">
            You&apos;re about to purchase{" "}
            <strong>{ticketInfo.seat_info}</strong> for{" "}
            <strong>${ticketInfo.price?.toFixed(2)}</strong>.
          </p>

          <div className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment</h2>

            {/* Payment type selection */}
            <fieldset>
              <legend className="sr-only">Payment type</legend>
              <div className="space-y-4 sm:flex sm:space-y-0 sm:space-x-6">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment-type"
                      value={method.id}
                      checked={paymentType === method.id}
                      onChange={(e) => setPaymentType(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      {method.title}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Mock payment form */}
            <div className="mt-6 grid grid-cols-4 gap-x-4 gap-y-6">
              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Card number
                </label>
                <input
                  type="text"
                  value={form.cardNumber}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cardNumber: e.target.value }))
                  }
                  autoComplete="cc-number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div className="col-span-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name on card
                </label>
                <input
                  type="text"
                  value={form.nameOnCard}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, nameOnCard: e.target.value }))
                  }
                  autoComplete="cc-name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Expiration date (MM/YY)
                </label>
                <input
                  type="text"
                  value={form.expiry}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, expiry: e.target.value }))
                  }
                  autoComplete="cc-exp"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  value={form.cvc}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, cvc: e.target.value }))
                  }
                  autoComplete="csc"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-8">
            {/* <Button variant="outline" onClick={closeModal} disabled={isLoading}>
              Cancel
            </Button> */}
            <Button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm & Pay"}
            </Button>
          </div>
        </div>
      </Modal>

      <PaymentCompletedModal
        isOpen={paymentCompletedModal.isOpen}
        closeModal={paymentCompletedModal.closeModal}
        ticketInfo={ticketInfo}
      />
    </>
  );
}
