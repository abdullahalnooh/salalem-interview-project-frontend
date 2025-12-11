import logo from './logo.svg';
import './App.css';
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

const ARTISTS = gql`
query {
  Artists {
    id
    firstName
    lastName
  }
}
`;
const ALBUMS  = gql`
query {
  Albums {
    id
    name
    releaseDate
    artist {
      id
      firstName
    }
  }
}
`;

const SONGS =gql`
query {
  Songs {
    id
    title
    album {
      name
    }
    artist {
      firstName
    }
  }
}

`

function App() {

  const { loading: artistsLoading, error: artistsError, data: artistsData } = useQuery(ARTISTS);
  const { loading: albumsLoading, error: albumsError, data: albumsData } = useQuery(ALBUMS);
  const { loading: songsLoading, error: songsError, data: songsData } = useQuery(SONGS);

  if (artistsLoading || albumsLoading || songsLoading) return <p>Loading...</p>;

  if (artistsError) return <p>Error loading artists: {artistsError.message}</p>;
  if (albumsError) return <p>Error loading albums: {albumsError.message}</p>;
  if (songsError) return <p>Error loading songs: {songsError.message}</p>;

  console.log("Artists error:", artistsError);
console.log("Albums error:", albumsError);
console.log("Songs error:", songsError);
console.log("Artists data:", artistsData);


return (
    <div className="App">

      <div className='artist'> 
        <h2>Artists</h2>
        {artistsData.Artists.map(artist => (
          <div key={artist.id}>
            <h3>{artist.firstName} {artist.lastName}</h3>
          </div>
        ))}
      </div>

      <div className='album'>
        <h2>Albums</h2>
        {albumsData.Albums.map(album => (
          <div key={album.id}>
            <h3>{album.name} - {album.releaseDate}</h3>
            <p>
              by {album.artist.firstName} (ID: {album.artist.id})
            </p>
          </div>
        ))}
      </div>

      <div className='song'>
        <h2>Songs</h2>
        {songsData.Songs.map(song => (
          <div key={song.id}>
            <h3>{song.title}</h3>
            <p>Album: {song.album.name}</p>
            <p>Artist: {song.artist.firstName}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
