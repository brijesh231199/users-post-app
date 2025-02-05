"use client";
import React, { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useLoading } from "../../context/loadingContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
  company: string;
}
interface UserData {
  originalData: User[];
  filteredData: User[];
}

interface SortedColumnProps {
  columnName: string;
  sorted: string;
  priority: number;
}

export default function Users() {
  const [users, setUsers] = useState<UserData>({
    originalData: [],
    filteredData: [],
  });
  const [columnSorting, setColumnSorting] = useState<SortedColumnProps[]>([]);
  const { showLoader, hideLoader } = useLoading();

  // Function to apply sorting to an array of users based on the selected column and sort order.
  const applySorting = (arr: User[], column: string, sortOrder: string) => {
    if (sortOrder === "desc") {
      return arr?.toSorted((a: any, b: any) =>
        b[column].localeCompare(a[column])
      );
    } else if (sortOrder === "asc") {
      return arr?.toSorted((a: any, b: any) =>
        a[column].localeCompare(b[column])
      );
    }
    return arr;
  };

  // Function to check and apply column sorting based on the priority and sort order of columns.
  const checkColumnSorting = (
    sortColumns: SortedColumnProps[],
    rowData: User[]
  ) => {
    // Sort columns based on priority.
    let columnPriority = sortColumns
      ?.sort((a, b) => b.priority - a.priority)
      .map((info) => ({
        columnName: info.columnName,
        sorted: info.sorted,
      }));
    let data = [...rowData];

    // Apply sorting for each column in priority order.
    columnPriority?.forEach((column) => {
      data = applySorting(data, column.columnName, column.sorted);
    });
    return data;
  };

  // Debounced search function to filter user data based on search query.
  const onSearch = useCallback(
    debounce((searchQuery) => {
      let filteredUser = [...users.originalData];
      if (searchQuery.target.value) {
        filteredUser = users?.originalData?.filter(
          (user) =>
            user.name
              .toLowerCase()
              .includes(searchQuery.target.value.toLowerCase()) // Filter by name
        );
      }

      // Apply column sorting if any sorting is set.
      if (columnSorting.length > 0) {
        filteredUser = checkColumnSorting(columnSorting, filteredUser);
      }
      setUsers({ ...users, filteredData: filteredUser });
    }, 500), // Delay of 500ms to avoid excessive filtering on each keystroke
    [users.originalData, columnSorting]
  );

  // Function to handle column sorting when a user clicks on a column header.
  const onColumnSorting = (columnName: string) => {
    // Check if the column is already being sorted.
    const sortingType = columnSorting?.find(
      (column) => column.columnName === columnName
    );
    let columnSort: SortedColumnProps[];
    if (sortingType) {
      // If sorting exists, toggle between ascending and descending order.
      columnSort = columnSorting?.map((column) =>
        column.columnName === columnName
          ? {
              ...column,
              sorted: sortingType?.sorted === "asc" ? "desc" : "asc",
            }
          : column
      );
    } else {
      // If no sorting exists, add a new sorting rule with ascending order.
      columnSort = [
        ...columnSorting,
        {
          columnName: columnName,
          sorted: "asc",
          priority: columnSorting?.length + 1,
        },
      ];
    }
    // Apply sorting based on updated column sort.
    const userData = checkColumnSorting(columnSort, users.filteredData);
    setUsers({ ...users, filteredData: userData });
    setColumnSorting(columnSort);
  };

  // Fetch users' data from an API on component mount.
  useEffect(() => {
    const fetchData = async () => {
      try {
        showLoader(); // Show loading indicator
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        const data = await response.json();
        if (data.length === 0) {
          return;
        }
        // Transform the data into the desired format (simplified).
        const transformedData = data?.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          address: {
            street: user.address.street,
            suite: user.address.suite,
            city: user.address.city,
            zipcode: user.address.zipcode,
          },
          phone: user.phone,
          company: user.company.name,
        }));

        setUsers({
          originalData: transformedData,
          filteredData: transformedData,
        });
      } catch (error) {
        console.error(error); // Handle any errors
      } finally {
        hideLoader(); // Hide loading indicator after fetch completes
      }
    };
    fetchData(); // Call the fetch function on component mount
  }, []);

  return (
    <>
      <div className="p-4 w-full max-w-sm min-w-[200px]">
        <div className="relative flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
              clipRule="evenodd"
            />
          </svg>

          <input
            className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            placeholder="Search user name"
            onChange={onSearch}
          />
        </div>
      </div>
      <div className="mx-auto p-4">
        <div className="relative overflow-x-auto shadow-md rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-4 py-3"
                  onClick={() => onColumnSorting("name")}
                >
                  <div className="flex items-center">
                    Full Name
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Address
                </th>
                <th
                  scope="col"
                  className="px-4 py-3"
                  onClick={() => onColumnSorting("company")}
                >
                  <div className="flex items-center">
                    Company
                    <a href="#">
                      <svg
                        className="w-3 h-3 ms-1.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                      </svg>
                    </a>
                  </div>
                </th>
                <th scope="col" className="px-4 py-3">
                  Review
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.filteredData?.map((data: User) => (
                <tr
                  key={data.id}
                  className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <td className="px-4 py-3">{data.id}</td>
                  <td className="px-4 py-3">{data.name}</td>
                  <td className="px-4 py-3">{data.email}</td>
                  <td className="px-4 py-3">
                    {`${data.address.suite}, ${data.address.street}, ${data.address.city}, ${data.address.zipcode}`}
                  </td>
                  <td className="px-4 py-3">{data.company}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`/users/${data.id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Review
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
