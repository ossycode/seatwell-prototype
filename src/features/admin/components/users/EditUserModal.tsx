import Input from "@/components/ui/form/input/InputField";
import Label from "@/components/ui/form/Label";
import { Modal } from "@/components/ui/modal";
import WarningModal from "@/components/ui/modal/WarningModal";
import { useModal } from "@/hooks/useModal";
import { useUpdateUserMutation } from "@/services/usersApi";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";

interface EditUserProps {
  isOpen: boolean;
  closeModal: () => void;
  user: User;
}

const userSchema = z.object({
  role: z.enum(["buyer", "seller", "admin"]),
});

type FormData = z.infer<typeof userSchema>;

const EditUserModal = ({ isOpen, closeModal, user }: EditUserProps) => {
  const [updateUser] = useUpdateUserMutation();
  const [pendingData, setPendingData] = useState<FormData | null>(null);
  const warningModal = useModal();

  const {
    handleSubmit,
    register,
    formState: { isDirty, isSubmitting },
    // control,
  } = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: user.role,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (data.role === "admin" && user.role !== "admin") {
      setPendingData(data);
      warningModal.openModal();
      return;
    }
    await submitUpdate(data);
  };

  const submitUpdate = async (data: FormData) => {
    try {
      await updateUser({ id: user.id, role: data.role }).unwrap();
      toast.success("User updated successfully");
      closeModal();
    } catch (error) {
      toast.error("Failed to update user");
      console.error(error);
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
          Edit User
        </h4>
      </div>

      <form
        className="flex flex-col mt-6 sm:mt-10"
        onSubmit={handleSubmit(onSubmit)}
        id="user-edit-form"
      >
        <div className="custom-scrollbar h-[350px] sm:h-[450px] overflow-y-auto px-2">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Email Address</Label>
              <Input type="email" defaultValue={user.email} disabled />
            </div>

            <div>
              <Label>Role</Label>
              <div className="relative z-20 bg-transparent dark:bg-form-input ">
                <select
                  {...register("role")}
                  defaultValue={user.role}
                  className="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                >
                  <option
                    value="buyer"
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    Buyer
                  </option>
                  <option
                    value="seller"
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    Seller
                  </option>
                  <option
                    value="admin"
                    className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
                  >
                    Admin
                  </option>
                </select>
                <span className="absolute z-30 text-gray-500 -translate-y-1/2 right-4 top-1/2 dark:text-gray-400">
                  <svg
                    className="stroke-current"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.8335 5.9165L8.00016 10.0832L12.1668 5.9165"
                      stroke=""
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>
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
              form="user-edit-form"
              disabled={!isDirty || isSubmitting}
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
                  <span>Updating...</span>
                </span>
              ) : (
                "Update User"
              )}
            </button>
          </div>
        </div>
      </form>

      <WarningModal
        open={warningModal.isOpen}
        onClose={warningModal.closeModal}
        onConfirm={async () => {
          if (pendingData) {
            await submitUpdate(pendingData);
            warningModal.closeModal();
            setPendingData(null);
          }
        }}
        title="Confirm admin promotion"
        message="You're about to promote this user to an admin. Are you sure?"
      />
    </Modal>
  );
};

export default EditUserModal;
