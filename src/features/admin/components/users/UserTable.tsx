"use client";

import ExportButton from "@/components/admin/ExportButton";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import TableDropdown from "@/components/ui/common/TableDropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/useModal";
import { User } from "@/types/user";
import { formatDateWithoutTime } from "@/utils/helpers";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import { useEffect, useState } from "react";
import { useDeleteUserMutation, useGetUsersQuery } from "@/services/usersApi";
import toast from "react-hot-toast";
import WarningModal from "@/components/ui/modal/WarningModal";
import Loader from "@/components/ui/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { TABLE_PAGE_SIZE } from "@/utils/constants";

export default function UserTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialPage = Number(searchParams.get("page") || 1);
  const initialSearch = searchParams.get("search") || "";

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading: isLoadingUsers } = useGetUsersQuery({
    page,
    limit: TABLE_PAGE_SIZE,
    search: debouncedSearch,
  });

  const { isOpen, openModal, closeModal } = useModal();
  const editModalControl = useModal();
  const deleteModalControl = useModal();
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.data || [];
  const total = data?.count || 0;
  const totalPages = Math.ceil(total / TABLE_PAGE_SIZE);
  const isLoading = isDeleting || isLoadingUsers;

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", page.toString());
    router.replace(`?${params.toString()}`);
  }, [debouncedSearch, page, router]);

  const openEditModal = (user: User) => {
    setUserToEdit(user);
    editModalControl.openModal();
  };

  const handleDelete = async () => {
    try {
      if (!userToDelete) return;
      await deleteUser(userToDelete.id).unwrap();

      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
      console.log(err);
    } finally {
      deleteModalControl.closeModal();
      setUserToDelete(null);
    }
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 ">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <button className="absolute -translate-y-1/2 left-4 top-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04199 9.37381C3.04199 5.87712 5.87735 3.04218 9.37533 3.04218C12.8733 3.04218 15.7087 5.87712 15.7087 9.37381C15.7087 12.8705 12.8733 15.7055 9.37533 15.7055C5.87735 15.7055 3.04199 12.8705 3.04199 9.37381ZM9.37533 1.54218C5.04926 1.54218 1.54199 5.04835 1.54199 9.37381C1.54199 13.6993 5.04926 17.2055 9.37533 17.2055C11.2676 17.2055 13.0032 16.5346 14.3572 15.4178L17.1773 18.2381C17.4702 18.531 17.945 18.5311 18.2379 18.2382C18.5308 17.9453 18.5309 17.4704 18.238 17.1775L15.4182 14.3575C16.5367 13.0035 17.2087 11.2671 17.2087 9.37381C17.2087 5.04835 13.7014 1.54218 9.37533 1.54218Z"
                      fill=""
                    />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  className="dark:bg-dark-900 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="sm:px-6 lg:px-8 flex items-center justify-center mt-4 sm:mt-0 sm:justify-end gap-6">
            <button
              onClick={openModal}
              type="button"
              className="cursor-pointer block rounded bg-accent px-4 py-2 text-center  text-white shadow-xs hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray"
            >
              Add user
            </button>
            <ExportButton type={"users"} />
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="max-w-full px-5 overflow-x-auto sm:px-6">
            <Table className="min-h-[13rem]">
              <TableHeader className="border-gray-100 border-y dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Created
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    <div className="relative">
                      <span className="sr-only">Action</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-4  font-medium text-gray-700 text-theme-sm dark:text-gray-400">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 py-4 text-gray-700 whitespace-nowrap text-theme-sm dark:text-gray-400">
                        {formatDateWithoutTime(user.created_at)}
                      </TableCell>

                      <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        <Badge
                          size="sm"
                          color={
                            user.role === "admin"
                              ? "success"
                              : user.role === "seller"
                              ? "warning"
                              : user.role === "buyer"
                              ? "info"
                              : "dark"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-gray-700 text-theme-sm dark:text-gray-400">
                        <div className="relative inline-block">
                          <TableDropdown
                            dropdownButton={
                              <button className="text-gray-500 dark:text-gray-400 ">
                                <svg
                                  className="fill-current"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                                    fill=""
                                  />
                                </svg>
                              </button>
                            }
                            dropdownContent={
                              <>
                                <button
                                  onClick={() => openEditModal(user)}
                                  className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    deleteModalControl.openModal();
                                    setUserToDelete(user);
                                  }}
                                  className="text-xs flex w-full rounded-lg px-3 py-2 text-left font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                                >
                                  Delete
                                </button>
                              </>
                            }
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-lg text-gray-500  dark:text-gray-400 font-medium"
                    >
                      No data available
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            {/* Previous Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z"
                  fill=""
                />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </Button>
            {/* Page Info */}
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
              Page {page} of {totalPages}
            </span>
            {/* Page Numbers */}
            <ul className="hidden items-center gap-0.5 sm:flex">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => setPage(idx + 1)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium ${
                      page === idx + 1
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 hover:bg-brand-500/[0.08] dark:hover:bg-brand-500 dark:hover:text-white hover:text-brand-500 dark:text-gray-400 "
                    }`}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
            {/* Next Button */}
            <Button
              onClick={() => setPage(page + 1)}
              size="sm"
              variant="outline"
              disabled={page === totalPages}
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
                  fill=""
                />
              </svg>
            </Button>
          </div>
        </div>

        <CreateUserModal isOpen={isOpen} closeModal={closeModal} />
        {userToEdit && (
          <EditUserModal
            isOpen={editModalControl.isOpen}
            closeModal={() => {
              editModalControl.closeModal();
              setUserToEdit(null);
            }}
            user={userToEdit}
          />
        )}
        {userToDelete && (
          <WarningModal
            open={deleteModalControl.isOpen}
            message={`Are you sure you want to delete ${userToDelete.email}? This action is irreversible.`}
            onClose={deleteModalControl.closeModal}
            onConfirm={handleDelete}
            title="Delete User"
            isSubmitting={isLoading}
          />
        )}
      </div>
    </>
  );
}
