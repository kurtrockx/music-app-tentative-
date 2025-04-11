import SectionContainer from "../components/layout/SectionContainer";
import SongList from "../components/layout/SongList";
import Loader from "../components/Loader.jsx";
import Song from "../components/Song";

export default function FavoritePage({ onAddFav, favorites }) {
  return !favorites.length ? (
    <Loader />
  ) : (
    <SectionContainer className={"mt-auto flex h-10/12 flex-col gap-2"}>
      <SongList>
        {favorites.map((fav) => (
          <Song
            song={fav}
            key={fav.id}
            newRelease={fav.newRelease}
            onAddFav={onAddFav}
            favorites={favorites}
          />
        ))}
      </SongList>
    </SectionContainer>
  );
}
