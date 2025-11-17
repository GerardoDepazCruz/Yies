import React from "react";
import { Link } from "react-router-dom";

export const MovieCard = ({ id, title, year, poster }) => {
  const placeholderImage =
    "https://via.placeholder.com/300x445.png?text=No+Poster";
  const imageUrl = poster === "N/A" ? placeholderImage : poster;

  return (
    <Link
      to={`/movie/${id}`}
      className="group block bg-gray-700 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Poster de ${title}`}
          className="w-full h-auto object-cover"
          style={{ height: "445px" }}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/50x75.png?text=No+Poster";
          }}
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-white truncate" title={title}>
          {title}
        </h3>
        <p className="text-gray-400">{year}</p>
      </div>
    </Link>
  );
};
