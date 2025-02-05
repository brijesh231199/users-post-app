"use client";
import { LoadingProvider } from "../context/loadingContext";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  const onButtonClick = () => {
    router.push(`/users`);
  };
  return (
    <LoadingProvider>
      <div className="flex items-center justify-center h-screen">
        <button
          type="button"
          className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={onButtonClick}
        >
          Fetch user data
        </button>
      </div>
    </LoadingProvider>
  );
}
