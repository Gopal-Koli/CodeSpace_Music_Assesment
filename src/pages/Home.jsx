//React Icons
import { FaSpotify } from "react-icons/fa";
import { FaBackward } from "react-icons/fa";
import { FaForward } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { TbPlayerPauseFilled } from "react-icons/tb";
import { IoIosMore } from "react-icons/io";

//Material-UI Icons
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
//for Fetching API
import axios from "axios";
//Components pages  and Other Imports
import SmallVisible from "../components/SmallVisible";
import SearchBox from "../components/SearchBox";
import TabsHeader from "../components/Tabs";
import MuteButton from "../components/MuteButton";
const Home = () => {
  const [songs, setSongs] = useState([]); // All fetched songs
  const [loading, setLoading] = useState(true); // Loading status
  const [currentSong, setCurrentSong] = useState(null); // Currently playing song
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // for Seeker current time
  const [duration, setDuration] = useState(0); // Song duration
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [currentIndex, setCurrentIndex] = useState(null);
  const [showSongList, setShowSongList] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]); // Songs after search
  const [activeTab, setActiveTab] = useState("For You");
  const [isMuted, setIsMuted] = useState(false); // Mute toggle

  //playback handling chake the songurl valid or not
  const handlePlaySong = (song, index) => {
    if (!song.url) {
      console.error("Url is Not found ", song.name);
      return;
    }
    //Pause and cleanup previous audio
    if (audio) {
      audio.pause();
      audio.removeEventListener("ended", handleNext);
    }

    const newAudio = new Audio(song.url);
    //Duration setup (Music Times )
    newAudio.addEventListener("loadedmetadata", () => {
      setDuration(newAudio.duration);
    });
    //For seeker updation
    newAudio.addEventListener("timeupdate", () => {
      setCurrentTime(newAudio.currentTime);
    });
    //Autoplay next song
    newAudio.addEventListener("ended", handleNext);
    newAudio.play().catch((err) => console.error("Audio play error:", err));
    setAudio(newAudio); //update audio refrence
    setCurrentSong(song); //Set Cureent song
    setCurrentIndex(index);
    setIsPlaying(true);
    setBackgroundColor(song.accent || "#ffffff"); //Update background color
  };

  //play the next song in list
  const handleNext = () => {
    if (currentIndex === null || currentIndex >= songs.length - 1) return;
    const nextIndex = currentIndex + 1;
    handlePlaySong(songs[nextIndex], nextIndex);
  };
  //play the previsous song in list
  const handlePrevious = () => {
    if (currentIndex === null || currentIndex <= 0) return;
    const prevIndex = currentIndex - 1;
    handlePlaySong(songs[prevIndex], prevIndex);
  };

  // Time for seeker
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Toggle button for play and puse the song
  const togglePlayback = () => {
    if (!currentSong || currentIndex === null) return;
    if (!audio) {
      handlePlaySong(currentSong, currentIndex);
      return;
    }
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // for Mute and unmute the song
  useEffect(() => {
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted, audio]);
  // play /puse next and previous song using keyboard kyes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayback();
      }
      if (e.code === "ArrowRight") handleNext();
      if (e.code === "ArrowLeft") handlePrevious();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [audio, isPlaying]);

  //Fteching songs from API
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get(
          "https://cms.samespace.com/items/songs"
        );
        const allSongs = response.data.data;
        const publishedSongs = allSongs.filter(
          (song) => song.status === "published"
        );

        const updatedSongs = await Promise.all(
          publishedSongs.map((song) => {
            return new Promise((resolve) => {
              const audio = new Audio(song.url);
              audio.addEventListener("loadedmetadata", () => {
                resolve({ ...song, duration: audio.duration });
              });
              audio.addEventListener("error", () => {
                resolve({ ...song, duration: 0 });
              });
            });
          })
        );
        setSongs(updatedSongs);
        setCurrentSong(updatedSongs[0]);
        setCurrentIndex(0);
        setLoading(false);
        setBackgroundColor(updatedSongs[0].accent || "#ffffff");
        setLoading(false);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };
    fetchSongs();
  }, []);
  // Disply loading when load the song
  if (loading) return <div>Please Waite..! </div>;
  return (
    <div
      className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-gradient-to-br from-[#1e130c] to-[#1a1010] text-white"
      style={{
        background: `linear-gradient(135deg, ${backgroundColor}, #000000)`,
        transition: "background 0.5s ease",
      }}
    >
      {/* On large Screen this Part will Widden and small screen this part will show */}
      <div className="lg:hidden sticky top-0 z-10 flex  h-full justify-between items-center p-4 bg-black ">
        <button
          onClick={() => setShowSongList(!showSongList)}
          className="text-white text-sm bg-gray-800 p-1 rounded"
        >
          {showSongList ? "Close Songs" : "Show Songs"}{" "}
          {/* List of the song with close and shwo toggle*/}
        </button>
        {/*Logo   */}
        <p className="text-white font-bold flex items-center gap-1">
          <FaSpotify className="" />
          Spotify
        </p>
      </div>
      {/*   render small screen  song list component */}
      <SmallVisible
        songs={songs}
        visible={showSongList}
        setVisible={setShowSongList}
        onSongSelect={handlePlaySong}
        formatTime={formatTime}
      />

      {/* Visible on Large Sscreen  */}
      <div className=" flex  lg:w-[320px]  px-4 py-4 ">
        <FaSpotify className="text-3xl hidden lg:block" />{" "}
        <p className="text-white font-bold pl-2 hidden lg:block  text-lg">
          Spotify
        </p>
      </div>
      {/*  */}
      <div className="hidden lg:flex lg:w-[600px]  flex-col px-4 py-6 lg:pr-16 overflow-hidden">
        {/*  For You and Top Tracks */}
        <TabsHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Search Box with filter song which users searches */}
        <div className="relative mb-4">
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
          )
            // fetch song and play the song when click
            .map((song, index) => (
              <div
                key={song.id}
                onClick={() => handlePlaySong(song, index)}
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
      {/* Song Player Big with cover   */}
      <div className="w-full items-center sm:max-w-lg   md:w-[300px] lg:w-[500px] sm:mt-12 d:mt-14 lg:mt-16  mx-auto  mt-16 px-4 pt-6 pb-10">
        <div className=" mb-4">
          <h1 className="text-2xl font-bold text-white">
            {currentSong ? currentSong.name : "Select a Song"}
          </h1>
          {/*displays song title and artist name */}
          <p className="text-sm text-gray-400">
            {currentSong ? currentSong.artist : "Artist"}
          </p>
        </div>
        <div className="mr-10 justify-center md:w-[330px] ">
          {/* Display the album cover img which is current play */}
          <img
            src={
              currentSong
                ? `https://cms.samespace.com/assets/${currentSong.cover}`
                : "https://i.scdn.co/image/ab67706f00000002dcb7b32f8bf2e6a7851245e3"
            }
            alt="Album Art" //some network load or issue display the image when not show Album Art
            className="w-[280px] h-[230px] sm:h-[250px] sm:w-[280px]  md:w-[290px] md:h-[280px] lg:w-[340px] lg:h-[300px] rounded-lg object-cover shadow-lg transition-transform duration-300 "
          />
          <Box className="w-[280px] h-[30px] sm:w-[27px]  sm:h-[30px]  ">
            {/* Seeker ( Music slider) styled using Material UI Slider*/}
            <Slider
              size="small"
              value={currentTime}
              max={duration}
              color="white"
              className=""
              sx={{
                width: { xs: 280, sm: 290, md: 330, lg: 335 }, // Seeker Size base on screen
                "& .MuiSlider-thumb": {
                  display: "none", // for hidding white round
                },
              }}
              onChange={(e, newValue) => {
                if (audio) {
                  audio.currentTime = newValue;
                  setCurrentTime(newValue);
                }
              }}
            />
          </Box>
        </div>

        {/*Container for playback controls....  more, play,pause forward,backward,mute*/}
        <div className="flex items-center justify-between w-[240px] xs-w[230px] sm:w-[280px] md:w-[310px] lg:w-[345px] ">
          <span className="">
            <IoIosMore className="  text-white bg-[#3d3d3d] rounded-full p-1 text-2xl" />
          </span>
          <div className="flex items-center justify-center ml-auto ">
            <Button
              className="!text-white !ml-4 transition-transform duration-200 !p-2  !rounded-full"
              onClick={handlePrevious}
            >
              <FaBackward />
            </Button>

            <Button
              className=" transition-transform duration-200 !p-1 !rounded-full"
              onClick={() => togglePlayback()}
            >
              {isPlaying ? (
                <TbPlayerPauseFilled className="text-white text-3xl" />
              ) : (
                <FaCirclePlay className="text-white text-3xl" />
              )}
            </Button>

            <Button
              className="!text-white transition-transform duration-200  !rounded-full"
              onClick={handleNext}
            >
              <FaForward />
            </Button>
          </div>

          <p className="text-white ml-6  ">
            <MuteButton
              isMuted={isMuted}
              onToggleMute={() => setIsMuted(!isMuted)}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
