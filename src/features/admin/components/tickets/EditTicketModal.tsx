import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import { useUpdateTicketMutation } from "@/services/ticketsApi";
import { TicketWithGame } from "@/types/tickets";
import { ALL_STATUSES } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

interface EditTicketProps {
  isOpen: boolean;
  closeModal: () => void;
  ticket: TicketWithGame;
}
const ticketSchema = z.object({
  game: z
    .string()
    .min(1, { message: "Game must not be empty" })
    .max(300, { message: "Game must be less than 300 characters" }),
  price: z.number().optional(),
  seller: z
    .string()
    .min(1, { message: "Seller must not be empty" })
    .max(100, { message: "Seller must be less than 100 characters" }),
  seat_info: z
    .string()
    .min(1, { message: "Seat info must not be empty" })
    .max(200, { message: "Seat info must be less than 200 characters" }),
  status: z.enum(["pending", "approved", "rejected", "sold", "payout_issued"], {
    required_error: "status is required",
  }),
});

type FormData = z.infer<typeof ticketSchema>;

const EditTicketModal = ({ isOpen, closeModal, ticket }: EditTicketProps) => {
  const [updateTicket, { isLoading }] = useUpdateTicketMutation();

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      game: `${ticket.game.home_team.name} vs ${ticket.game.away_team.name}`,
      price: ticket.price || 0,
      seller: ticket.seller_email,
      seat_info: ticket.seat_info || "",
      status: ticket.status,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateTicket({
        id: ticket.id,
        changes: {
          price: Number(data.price),
          seat_info: data.seat_info,
          status: data.status,
        },
      }).unwrap();
      toast.success("Ticket updated successfully");
      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update ticket");
      console.error(error);
    }
  };
  return (
    //   <Modal
    //       isOpen={isOpen}
    //       onClose={closeModal}
    //       className="max-w-[700px] p-5 lg:p-10 m-4"
    //     >
    //       <div className="px-2">
    //         <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
    //           Edit Ticket
    //         </h4>
    //       </div>

    //       <form
    //         className="flex flex-col mt-8"
    //         onSubmit={handleSubmit(onSubmit)}
    //         id="ticket-form"
    //       >
    //         <div className="custom-scrollbar h-[350px] sm:h-[450px] overflow-y-auto px-2">
    //           <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
    //             <div className="sm:col-span-2">
    //               <Label>Game</Label>
    //               <SimpleCombobox
    //                 options={gameOptions}
    //                 value={selectedGameId}
    //                 onChange={(val) =>
    //                   setValue("game_id", val, { shouldValidate: true })
    //                 }
    //                 placeholder="Select a game..."
    //               />
    //               {errors.game_id && (
    //                 <p className="text-sm text-red-500 mt-1">
    //                   {errors.game_id.message}
    //                 </p>
    //               )}
    //             </div>
    //             <div className="sm:col-span-2">
    //               <Label>Seller</Label>
    //               <SimpleCombobox
    //                 options={sellerOptions}
    //                 value={selectedSellerId}
    //                 onChange={(val) =>
    //                   setValue("seller_id", val, { shouldValidate: true })
    //                 }
    //                 placeholder="Select a seller..."
    //               />
    //               {errors.seller_id && (
    //                 <p className="text-sm text-red-500 mt-1">
    //                   {errors.seller_id.message}
    //                 </p>
    //               )}
    //             </div>
    //             <div className="sm:col-span-2">
    //               <Label>Price</Label>
    //               <Input
    //                 type="number"
    //                 min={0}
    //                 {...register("price", { valueAsNumber: true })}
    //                 placeholder="Enter price"
    //               />
    //               {errors.price && (
    //                 <p className="text-sm text-red-500 mt-1">
    //                   {errors.price.message}
    //                 </p>
    //               )}{" "}
    //             </div>
    //             <div className="sm:col-span-2">
    //               <Label>Seat Info</Label>
    //               <Input
    //                 {...register("seat_info")}
    //                 placeholder="e.g. Section A, Row 5, Seat 12"
    //               />
    //               {errors.seat_info && (
    //                 <p className="text-sm text-red-500 mt-1">
    //                   {errors.seat_info.message}
    //                 </p>
    //               )}{" "}
    //             </div>
    //           </div>
    //         </div>
    //         <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-between">
    //           <div className="flex items-center w-full gap-3 sm:w-auto">
    //             <button
    //               onClick={closeModal}
    //               type="button"
    //               className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
    //             >
    //               Cancel
    //             </button>
    //             <button
    //               type="submit"
    //               form="ticket-form"
    //               disabled={isSubmitting}
    //               className="cursor-pointer flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
    //             >
    //               {isSubmitting || isLoading ? (
    //                 <span className="flex items-center gap-4">
    //                   <svg
    //                     className="animate-spin h-5 w-5 text-white"
    //                     viewBox="0 0 24 24"
    //                     fill="none"
    //                   >
    //                     <circle
    //                       className="opacity-25"
    //                       cx="12"
    //                       cy="12"
    //                       r="10"
    //                       stroke="currentColor"
    //                       strokeWidth="4"
    //                     />
    //                     <path
    //                       className="opacity-75"
    //                       fill="currentColor"
    //                       d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
    //                     />
    //                   </svg>
    //                   <span>Updating...</span>
    //                 </span>
    //               ) : (
    //                 "Update ticket"
    //               )}
    //             </button>
    //           </div>
    //         </div>
    //       </form>
    //     </Modal>
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Edit Ticket
        </h4>
      </div>

      <form
        className="flex flex-col mt-8"
        onSubmit={handleSubmit(onSubmit)}
        id="ticket-form"
      >
        <div className="custom-scrollbar h-[350px] sm:h-[450px] overflow-y-auto px-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {/* Read-only Game Display */}
            <div className="sm:col-span-2">
              <Label>Game</Label>
              <input
                type="text"
                readOnly
                value={`${ticket.game.home_team.name} vs ${ticket.game.away_team.name}`}
                className="h-11 w-full rounded-lg border bg-gray-100 appearance-none px-4 py-2 text-sm shadow-theme-xs dark:bg-gray-800 dark:text-white/80"
              />
            </div>

            {/* Read-only Seller Display */}
            <div className="sm:col-span-2">
              <Label>Seller</Label>
              <input
                type="text"
                readOnly
                value={ticket.seller_email}
                className="h-11 w-full rounded-lg border bg-gray-100 appearance-none px-4 py-2 text-sm shadow-theme-xs dark:bg-gray-800 dark:text-white/80"
              />
            </div>

            {/* Editable Fields */}
            <div className="sm:col-span-2">
              <Label>Price</Label>
              <Input
                type="number"
                min={0}
                {...register("price", { valueAsNumber: true })}
                defaultValue={ticket.price}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label>Seat Info</Label>
              <Input
                {...register("seat_info")}
                defaultValue={ticket.seat_info}
                placeholder="e.g. Section A, Row 5, Seat 12"
              />
              {errors.seat_info && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.seat_info.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label>Status</Label>
              <select
                {...register("status")}
                defaultValue={ticket.status}
                className="h-11 w-full rounded-lg border appearance-none px-4 py-2 text-sm shadow-theme-xs focus:outline-hidden dark:bg-gray-900 dark:text-white/90 capitalize"
              >
                <option value="">All Statuses</option>
                {ALL_STATUSES.map((s) => (
                  <option
                    key={s}
                    value={s}
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-40 capitalize"
                  >
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 px-2 mt-6 sm:flex-row sm:justify-between">
          <div className="flex items-center w-full gap-3 sm:w-auto">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="ticket-form"
              disabled={isSubmitting || isLoading}
              className="cursor-pointer flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {isSubmitting || isLoading ? (
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
                  <span>Updating...</span>
                </span>
              ) : (
                "Update ticket"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditTicketModal;
