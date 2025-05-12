import React from "react";

const TabsHeader = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-6 font-semibold text-sm mb-4">
      {["For You", "Top Tracks"].map((tab) => (
        <span key={tab} onClick={() => setActiveTab(tab)} 
        className={`pb-1 text-[17px] cursor-pointer transition-colors duration-200
          ${activeTab === tab ? "text-white  " : "text-gray-400"}`}
        >
          {tab}
        </span>
      ))}
    </div>
  );
};
export default TabsHeader;
