import { SimpleCombobox } from "@/components/SimpleCombobox";
import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import { useAddGameMutation } from "@/services/gamesApi";
import { Team } from "@/types/team";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

const gameSchema = z.object({
  home_team_id: z.string().min(1, "Home team is required"),
  away_team_id: z.string().min(1, "Away team is required"),
  venue: z.string().min(1, "Venue is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine(
      (val) => {
        const selected = new Date(val);
        const now = new Date();
        return selected.getTime() > now.getTime();
      },
      { message: "Date must be in the future" }
    ),
});
type FormData = z.infer<typeof gameSchema>;

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  teams: Team[];
}

const CreateGameModal = ({ isOpen, closeModal, teams }: Props) => {
  const [addGame, { isLoading: isAdding }] = useAddGameMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<FormData>({
    resolver: zodResolver(gameSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addGame(data).unwrap();
      toast.success("Game created");
      closeModal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to create game");
      console.error(err);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[700px] p-5 lg:p-10 m-4"
    >
      <div className="px-2">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
          Create Game
        </h4>
      </div>

      <form
        className="flex flex-col mt-8"
        onSubmit={handleSubmit(onSubmit)}
        id="create-game-form"
      >
        <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Home Team</Label>
              <SimpleCombobox
                options={teams.map((t) => ({ id: t.id, label: t.name }))}
                value=""
                onChange={(val) =>
                  setValue("home_team_id", val, { shouldValidate: true })
                }
                placeholder="Select home team"
              />
              {errors.home_team_id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.home_team_id.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label>Away Team</Label>
              <SimpleCombobox
                options={teams.map((t) => ({ id: t.id, label: t.name }))}
                value=""
                onChange={(val) =>
                  setValue("away_team_id", val, { shouldValidate: true })
                }
                placeholder="Select away team"
              />
              {errors.away_team_id && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.away_team_id.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label>Date & Time</Label>
              <Input
                type="datetime-local"
                {...register("date")}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.date && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <Label>Venue</Label>
              <Input
                type="text"
                {...register("venue")}
                placeholder="Stadium or Arena"
              />
              {errors.venue && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.venue.message}
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
              form="create-game-form"
              disabled={isSubmitting || isAdding}
              className="cursor-pointer flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {isSubmitting || isAdding ? (
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
                "Create Game"
              )}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateGameModal;
