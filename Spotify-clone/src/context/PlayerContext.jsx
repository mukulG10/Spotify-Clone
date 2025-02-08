import { createContext, useRef, useState, useEffect } from "react";
import axios from "axios";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();

  const seekBar = useRef();

  // yeh wala kam ab isliye krre hai jise backend ka data clone pe visible ho

  const url = "http://localhost:4000";

  //now created two state variables to store the data coming from the api or backened

  const [songsData, setSongsData] = useState([]);
  const [albumsData, setAlbumsData] = useState([]);

  //created the state variables toh manage the project state

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);

  //another state variable using that you will get the total duration and current time
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  //function thorugh which can play and stop the song
  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    // await setTrack(songsData[id]);
    // await audioRef.current.play();
    // setPlayStatus(true);

    await songsData.map((item) => {
      if (id === item._id) {
        setTrack(item);
      }
    });

    await audioRef.current.play();
    setPlayStatus(true);
  };
  const previous = async () => {
    // if (track.id > 0) {
    //   await setTrack(songsData[track.id - 1]);
    //   await audioRef.current.play();
    //   setPlayStatus(true);
    // }

    songsData.map(async (item, index) => {
      if (track._id === item._id && index > 0) {
        await setTrack(songsData[index - 1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
    });
  };

  const next = async () => {
    // if (track.id < songsData.length - 1) {
    //   await setTrack(songsData[track.id + 1]);
    //   await audioRef.current.play();
    //   setPlayStatus(true);
    // }
    songsData.map(async (item, index) => {
      if (track._id === item._id && index < songsData.length) {
        await setTrack(songsData[index + 1]);
        await audioRef.current.play();
        setPlayStatus(true);
      }
    });
  };

  const seekSong = async (e) => {
    // console.log(e);
    audioRef.current.currentTime =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
  };

  const getSongsData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongsData(response.data.songs);
      setTrack(response.data.songs[0]);
    } catch (error) {}
  };

  const getAlbumsData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumsData(response.data.albums);
    } catch (error) {}
  };

  //ab ye niche wala isliye hai ki bhai current time and total duration visible ho jaye screen pr

  useEffect(() => {
    setTimeout(() => {
      audioRef.current.ontimeupdate = () => {
        seekBar.current.style.width =
          Math.floor(
            (audioRef.current.currentTime / audioRef.current.duration) * 100
          ) + "%";
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      };
    }, 1000);
  }, [audioRef]);

  // yeh wala useeffect bad me add hua for the backened

  useEffect(() => {
    getSongsData();
    getAlbumsData();
  }, []);

  //here we have paseed all the states and setter functions
  const contextvalue = {
    audioRef,
    seekBg,
    seekBar,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    //passed the above created function through context value
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    // at last passed
    songsData,
    albumsData,
  };

  return (
    <PlayerContext.Provider value={contextvalue}>
      {props.children}
    </PlayerContext.Provider>
  );
};
export default PlayerContextProvider;
