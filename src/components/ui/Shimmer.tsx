import React from "react";

export const Shimmer = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${className}`}
      style={{
        animation: "shimmer 2s infinite linear",
      }}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="space-y-4 bg-white shadow-md p-6 rounded-lg">
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-full h-48 animate-shimmer" />
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 h-6 animate-shimmer" />
      <div className="space-y-2">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded h-4 animate-shimmer" />
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6 h-4 animate-shimmer" />
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/6 h-4 animate-shimmer" />
      </div>
      <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-32 h-10 animate-shimmer" />
    </div>
  );
};

export const ListItemSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg">
      <div className="flex-shrink-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-12 h-12 animate-shimmer" />

      <div className="flex-1 space-y-2">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/3 h-4 animate-shimmer" />
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 h-3 animate-shimmer" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <tr className="border-b">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded h-4 animate-shimmer" />
        </td>
      ))}
    </tr>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full w-20 h-20 animate-shimmer" />

        <div className="flex-1 space-y-2">
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/3 h-6 animate-shimmer" />
          <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/2 h-4 animate-shimmer" />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded h-4 animate-shimmer" />
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-5/6 h-4 animate-shimmer" />
        <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-4/6 h-4 animate-shimmer" />
      </div>

      <div className="gap-4 grid grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2 text-center">
            <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded h-8 animate-shimmer" />
            <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 mx-auto rounded w-3/4 h-3 animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};
