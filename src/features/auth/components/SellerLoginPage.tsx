"use client";

import Logo from "@/components/layout/Logo";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React, { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { logginAsSeller } from "../actions";
import { loginFormSchema, LoginFormType } from "../authSchema";
import { useRouter, useSearchParams } from "next/navigation";

const SellerLoginPage = () => {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    // reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
  });

  const LoginFormHandler = async (data: LoginFormType) => {
    startTransition(async () => {
      try {
        await logginAsSeller(data);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e: unknown) {}
    });
  };

  useEffect(() => {
    const err = searchParams.get("error");
    if (!err) return;

    switch (err) {
      case "invalid-credentials":
        toast.error("Invalid email or password.");
        break;
      case "auth-failed":
        toast.error("Authentication failed—please try again.");
        break;
      case "not-authorized":
        toast.error("You don&rsquo;t have admin privileges.");
        break;
      default:
        toast.error("Unknown error. Please try again.");
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const newUrl = window.location.pathname + (params.size ? `?${params}` : "");
    router.replace(newUrl, { scroll: false });
  }, [searchParams, router]);

  const showSpinner = isSubmitting || isPending;

  return (
    <div className="">
      <div className="p-6 h-full w-full  ">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Seller Login</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your Seller account
          </h2>
          <p> Use your Club&apos;s login details to sign in as a seller</p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSubmit(LoginFormHandler)} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-400 sm:text-sm/6"
                />
              </div>
              <p
                id={`email-error`}
                className={`text-red-500 mt-1 text-xs block transition-all duration-300 ease-in-out shrink-0 min-h-4 ${
                  errors.email ? "opacity-100" : "invisible opacity-0"
                }`}
              >
                {errors.email?.message}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-400 sm:text-sm/6"
                />
              </div>
              <p
                id={`password-error`}
                className={`text-red-500 mt-1 text-xs block transition-all duration-300 ease-in-out shrink-0 min-h-4 ${
                  errors.password ? "opacity-100" : "invisible opacity-0"
                }`}
              >
                {errors.password?.message}
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={showSpinner}
                className="cursor-pointer flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
              >
                {showSpinner ? (
                  <>
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
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerLoginPage;
