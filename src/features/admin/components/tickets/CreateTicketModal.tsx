"use client";

import Label from "@/components/ui/form/Label";
import Loader from "@/components/ui/Loader";
import { Modal } from "@/components/ui/modal";
import { useGetGamesQuery } from "@/services/gamesApi";
import { useListTicketMutation } from "@/services/ticketsApi";
import { useGetUsersQuery } from "@/services/usersApi";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { SimpleCombobox } from "@/components/SimpleCombobox";
import Input from "@/components/ui/form/input/InputField";

interface CreateTicketModalProps {
  closeModal: () => void;
  isOpen: boolean;
}

const ticketSchema = z.object({
  game_id: z.string().min(1, "Game is required"),
  seller_id: z.string().min(1, "Seller is required"),
  price: z
    .number({ invalid_type_error: "Price is required" })
    .min(1, "Price must be greater than 0"),
  seat_info: z.string().min(1, "Seat info is required"),
});
type FormData = z.infer<typeof ticketSchema>;

const CreateTicketModal = ({ closeModal, isOpen }: CreateTicketModalProps) => {
  const [listTicket] = useListTicketMutation();
  const { data: gamesApiData, isLoading: isLoadingGames } = useGetGamesQuery({
    futureOnly: true,
  });
  const { data: userApiData, isLoading: isLoadingUsers } = useGetUsersQuery({
    role: "seller",
  });
  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    // setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(ticketSchema),
  });

  const sellers = userApiData?.data || [];
  const games = gamesApiData?.data || [];

  const gameOptions = games.map((game) => ({
    id: game.id,
    label: `${game?.home_team?.name} vs ${game?.away_team?.name}`,
  }));

  const sellerOptions = sellers.map((user) => ({
    id: user.id,
    label: user.email,
  }));

  const selectedSellerId = useWatch({ control, name: "seller_id" });
  const selectedGameId = useWatch({ control, name: "game_id" });

  const onSubmit = async (data: FormData) => {
    try {
      await listTicket(data).unwrap();
      toast.success("Ticket created");
      closeModal();
      reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to create ticket");
      console.error(err);
    }
  };

  if (isLoadingGames || isLoadingUsers || isSubmitting) return <Loader />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Create Ticket
        </h4>
      </div>

      <form
        className="flex flex-col mt-8"
        onSubmit={handleSubmit(onSubmit)}
        id="ticket-form"
      >
        <div className="custom-scrollbar h-[350px] sm:h-[450px] overflow-y-auto px-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Game</Label>
              <SimpleCombobox
                options={gameOptions}
                value={selectedGameId}
                onChange={(val) =>
                  setValue("game_id", val, { shouldValidate: true })
                }
                placeholder="Select a game..."
              />
              {errors.game_id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.game_id.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label>Seller</Label>
              <SimpleCombobox
                options={sellerOptions}
                value={selectedSellerId}
                onChange={(val) =>
                  setValue("seller_id", val, { shouldValidate: true })
                }
                placeholder="Select a seller..."
              />
              {errors.seller_id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.seller_id.message}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label>Price</Label>
              <Input
                type="number"
                min={0}
                {...register("price", { valueAsNumber: true })}
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}{" "}
            </div>
            <div className="sm:col-span-2">
              <Label>Seat Info</Label>
              <Input
                {...register("seat_info")}
                placeholder="e.g. Section A, Row 5, Seat 12"
              />
              {errors.seat_info && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.seat_info.message}
                </p>
              )}{" "}
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
              disabled={isSubmitting}
              className="cursor-pointer flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {isSubmitting ? (
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
                  <span>Creating...</span>
                </span>
              ) : (
                "Create ticket"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTicketModal;
