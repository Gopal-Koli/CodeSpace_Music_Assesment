import React from "react";
import SearchBox from "./SearchBox";
import { useState, useEffect } from "react";
import TabsHeader from "./Tabs";
const SmallVisible = ({ songs, onSongSelect, visible, formatTime }) => {
  if (!visible) return null;
  const [showSongList, setShowSongList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [activeTab, setActiveTab] = useState("For You");
  const [currentIndex, setCurrentIndex] = useState(null);
  return (
    <div className="lg:hidden fixed top-14 left-0 right-0 bottom-0 z-50 bg-black overflow-y-auto pl-2 pr-2">
      <div className="sticky top-0 z-10  bg-[#000]">
        {/*  For You and Top Tracks */}
        <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Search Box with filter song which users searches */}
        <SearchBox
          onSearch={(query) => {
            const lowerQuery = query.toLowerCase();
            setSearchQuery(lowerQuery);
            const filtered = songs.filter(
              (song) =>
                song.name.toLowerCase().includes(lowerQuery) ||
                song.artist.toLowerCase().includes(lowerQuery)
            );
            setFilteredSongs(filtered);
          }}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2 no-scrollbar">
        {(searchQuery
          ? filteredSongs
          : songs.filter((song) => {
              if (activeTab === "Top Tracks") return song.top_track; //showing only toptrack songs

              return true; //showing all song
            })
        ).map((song, index) => (
          <div
            key={song.id}
            onClick={() => onSongSelect(song, index)}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
               currentIndex === index ? "bg-[#3d3d3d]" : "hover:bg-[#2a2a2a]" //Current song playing
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={`https://cms.samespace.com/assets/${song.cover}`}
                alt={song.name}
                width={100}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm">{song.name || "Unknown Title"}</p>
                <p className="text-xs text-gray-400">
                  {song.artist || "Unknown Artist"}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-400 ml-auto">
              {song.duration ? formatTime(song.duration) : "0:00"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SmallVisible;
