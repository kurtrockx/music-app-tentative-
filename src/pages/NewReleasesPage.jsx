import { useEffect, useReducer, useRef } from "react";
import SectionContainer from "../components/layout/SectionContainer";
import SongList from "../components/layout/SongList";
import Loader from "../components/Loader";
import Song from "../components/Song";

const initialState = { newlyReleased: [], limit: 16 };
function reducer(state, action) {
  switch (action.type) {
    case "setNewReleases":
      return { ...state, newlyReleased: action.payload };
    case "addTenSongs":
      return { ...state, limit: state.limit + 10 };
    default:
      return state;
  }
}

export default function NewReleasesPage({ accessToken }) {
  const [{ newlyReleased, limit }, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const sampleRef = useRef(null);

  useEffect(() => {
    if (!accessToken) return;

    function fetchNewReleases() {
      fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: "setNewReleases", payload: data.albums.items });
        })
        .catch((error) => console.error("Error:", error));
    }

    fetchNewReleases();
  }, [accessToken, limit]);

  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          dispatch({ type: "addTenSongs" });
        }
      });
    };

    const observer = new IntersectionObserver(callback, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });

    if (sampleRef.current) {
      observer.observe(sampleRef.current);
    }

    return () => {
      if (sampleRef.current) {
        observer.unobserve(sampleRef.current);
      }
    };
  }, [newlyReleased]);

  return !newlyReleased.length ? (
    <Loader />
  ) : (
    <SectionContainer className={"mt-auto flex h-10/12 flex-col gap-2"}>
      <h1 className="font-bold text-white">New Releases</h1>
      <SongList>
        {newlyReleased.map((song) => (
          <Song song={song} key={song.id} newRelease={true} />
        ))}
        <div ref={sampleRef}></div>
      </SongList>
    </SectionContainer>
  );
}
