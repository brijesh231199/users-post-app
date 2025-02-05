"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLoading } from "../../../context/loadingContext";

// Define the Post type for TypeScript
type Post = {
  id: string;
  title: string;
  body: string;
};

export default function Posts() {
  const params = useParams(); // Get the dynamic route parameter (user ID)
  const [posts, setPosts] = useState<Post[]>([]); // State to store fetched posts
  const { showLoader, hideLoader } = useLoading(); // Access loader functions from context
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader(); // Show loading indicator before fetching data

        // Fetch posts based on user ID from URL parameters
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?userId=${params.id}`
        );
        const data = await response.json();

        // If no posts found, redirect to the not found
        if (data.length === 0) {
          router.push(`/not-found`);
        }
        setPosts(data); // Update state with fetched posts
      } catch (error) {
        console.error(error);
      } finally {
        hideLoader(); // Hide loading indicator after fetching data
      }
    };

    fetchData(); // Call the function to fetch posts when component mounts
  }, []);

  return (
    <div className="flex flex-wrap gap-4 p-4">
      {/* Render posts */}
      {posts?.map((item: Post) => (
        <div
          key={item.id}
          className="w-full sm:w-[48%] md:w-[30%] lg:w-[23%] xl:w-[20%] p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100
      dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {item.title} {/* Display post title */}
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {item.body} {/* Display post content */}
          </p>
        </div>
      ))}
    </div>
  );
}
