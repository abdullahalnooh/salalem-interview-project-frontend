import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import './App.css';

// ----- Queries -----
const ARTISTS = gql`query { artists { id firstName lastName } }`;
const ALBUMS = gql`query { albums { id name releaseDate artist { id firstName } } }`;
const SONGS = gql`query { songs { id title album { id name } artist { id firstName } } }`;

// ----- Mutations -----
const CREATE_ARTIST = gql`mutation($firstName: String!, $lastName: String!) { createArtist(firstName: $firstName, lastName: $lastName) { artist { id firstName lastName } } }`;
const UPDATE_ARTIST = gql`mutation($id: ID!, $firstName: String, $lastName: String) { updateArtist(id: $id, firstName: $firstName, lastName: $lastName) { artist { id firstName lastName } } }`;
const DELETE_ARTIST = gql`mutation($id: ID!) { deleteArtist(id: $id) { ok } }`;

const CREATE_ALBUM = gql`mutation($artistId: ID!, $name: String!, $releaseDate: Date!) { createAlbum(artistId: $artistId, name: $name, releaseDate: $releaseDate) { album { id name } } }`;
const UPDATE_ALBUM = gql`mutation($id: ID!, $name: String, $releaseDate: Date) { updateAlbum(id: $id, name: $name, releaseDate: $releaseDate) { album { id name releaseDate } } }`;
const DELETE_ALBUM = gql`mutation($id: ID!) { deleteAlbum(id: $id) { ok } }`;

const CREATE_SONG = gql`mutation($artistId: ID!, $albumId: ID!, $title: String!) { createSong(artistId: $artistId, albumId: $albumId, title: $title) { song { id title } } }`;
const UPDATE_SONG = gql`mutation($id: ID!, $title: String) { updateSong(id: $id, title: $title) { song { id title } } }`;
const DELETE_SONG = gql`mutation($id: ID!) { deleteSong(id: $id) { ok } }`;

function App() {
  const { loading: aL, error: aE, data: aD, refetch: refA } = useQuery(ARTISTS);
  const { loading: alL, error: alE, data: alD, refetch: refAL } = useQuery(ALBUMS);
  const { loading: sL, error: sE, data: sD, refetch: refS } = useQuery(SONGS);

  const [createArtist] = useMutation(CREATE_ARTIST);
  const [updateArtist] = useMutation(UPDATE_ARTIST);
  const [deleteArtist] = useMutation(DELETE_ARTIST);

  const [createAlbum] = useMutation(CREATE_ALBUM);
  const [updateAlbum] = useMutation(UPDATE_ALBUM);
  const [deleteAlbum] = useMutation(DELETE_ALBUM);

  const [createSong] = useMutation(CREATE_SONG);
  const [updateSong] = useMutation(UPDATE_SONG);
  const [deleteSong] = useMutation(DELETE_SONG);

  const [newArtist, setNewArtist] = useState({ firstName: "", lastName: "" });
  const [newAlbum, setNewAlbum] = useState({ artistId: "", name: "", releaseDate: "" });
  const [newSong, setNewSong] = useState({ artistId: "", albumId: "", title: "" });

  const [editingArtist, setEditingArtist] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editingSong, setEditingSong] = useState(null);

  if (aL || alL || sL) return <p>Loading...</p>;
  if (aE || alE || sE) return <p>Error loading data</p>;

  // ----- Artist handlers -----
  const addArtist = async () => {
    if (!newArtist.firstName || !newArtist.lastName) return alert("Fill all fields!");
    await createArtist({ variables: newArtist });
    setNewArtist({ firstName: "", lastName: "" });
    refA();
  };
  const saveArtist = async (id) => {
    if (!editingArtist.firstName || !editingArtist.lastName) return alert("Fill all fields!");
    await updateArtist({ variables: { id, ...editingArtist } });
    setEditingArtist(null);
    refA();
  };
  const removeArtist = async (id) => { await deleteArtist({ variables: { id } }); refA(); };

  // ----- Album handlers -----
  const addAlbum = async () => {
    if (!newAlbum.artistId || !newAlbum.name || !newAlbum.releaseDate) return alert("Fill all fields!");
    await createAlbum({ variables: newAlbum });
    setNewAlbum({ artistId: "", name: "", releaseDate: "" });
    refAL();
  };
  const saveAlbum = async (id) => {
    if (!editingAlbum.name || !editingAlbum.releaseDate) return alert("Fill all fields!");
    await updateAlbum({ variables: { id, ...editingAlbum } });
    setEditingAlbum(null);
    refAL();
  };
  const removeAlbum = async (id) => { await deleteAlbum({ variables: { id } }); refAL(); };

  // ----- Song handlers -----
  const addSong = async () => {
    if (!newSong.artistId || !newSong.albumId || !newSong.title) return alert("Fill all fields!");
    await createSong({ variables: newSong });
    setNewSong({ artistId: "", albumId: "", title: "" });
    refS();
  };
  const saveSong = async (id) => {
    if (!editingSong.title) return alert("Fill all fields!");
    await updateSong({ variables: { id, ...editingSong } });
    setEditingSong(null);
    refS();
  };
  const removeSong = async (id) => { await deleteSong({ variables: { id } }); refS(); };

  // Filter albums by selected artist
  const filteredAlbums = newSong.artistId
    ? alD.albums.filter(a => a.artist.id === newSong.artistId)
    : alD.albums;

  return (
    <div className="container">
      <h1>Music Library</h1>

      <section>
        <h2>Artists</h2>
        <ul>
          {aD.artists.map(a => (
            <li key={a.id}>
              {editingArtist?.id === a.id ? (
                <>
                  <input value={editingArtist.firstName} onChange={e => setEditingArtist({...editingArtist, firstName: e.target.value})}/>
                  <input value={editingArtist.lastName} onChange={e => setEditingArtist({...editingArtist, lastName: e.target.value})}/>
                  <button onClick={() => saveArtist(a.id)}>Save</button>
                  <button onClick={() => setEditingArtist(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {a.firstName} {a.lastName}
                  <button onClick={() => setEditingArtist({id: a.id, firstName: a.firstName, lastName: a.lastName})}>Edit</button>
                  <button onClick={() => removeArtist(a.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
        <input placeholder="First Name" value={newArtist.firstName} onChange={e => setNewArtist({...newArtist, firstName: e.target.value})}/>
        <input placeholder="Last Name" value={newArtist.lastName} onChange={e => setNewArtist({...newArtist, lastName: e.target.value})}/>
        <button onClick={addArtist}>Add Artist</button>
      </section>

      <section>
        <h2>Albums</h2>
        <ul>
          {alD.albums.map(a => (
            <li key={a.id}>
              {editingAlbum?.id === a.id ? (
                <>
                  <input value={editingAlbum.name} onChange={e => setEditingAlbum({...editingAlbum, name: e.target.value})}/>
                  <input type="date" value={editingAlbum.releaseDate} onChange={e => setEditingAlbum({...editingAlbum, releaseDate: e.target.value})}/>
                  <button onClick={() => saveAlbum(a.id)}>Save</button>
                  <button onClick={() => setEditingAlbum(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {a.name} ({a.releaseDate}) by {a.artist.firstName}
                  <button onClick={() => setEditingAlbum({id: a.id, name: a.name, releaseDate: a.releaseDate})}>Edit</button>
                  <button onClick={() => removeAlbum(a.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
        <select value={newAlbum.artistId} onChange={e => setNewAlbum({...newAlbum, artistId: e.target.value})}>
          <option value="">Select Artist</option>
          {aD.artists.map(a => <option key={a.id} value={a.id}>{a.firstName}</option>)}
        </select>
        <input placeholder="Album Name" value={newAlbum.name} onChange={e => setNewAlbum({...newAlbum, name: e.target.value})}/>
        <input type="date" value={newAlbum.releaseDate} onChange={e => setNewAlbum({...newAlbum, releaseDate: e.target.value})}/>
        <button onClick={addAlbum}>Add Album</button>
      </section>

      <section>
        <h2>Songs</h2>
        <ul>
          {sD.songs.map(s => (
            <li key={s.id}>
              {editingSong?.id === s.id ? (
                <>
                  <input value={editingSong.title} onChange={e => setEditingSong({...editingSong, title: e.target.value})}/>
                  <button onClick={() => saveSong(s.id)}>Save</button>
                  <button onClick={() => setEditingSong(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {s.title} - {s.album.name} by {s.artist.firstName}
                  <button onClick={() => setEditingSong({id: s.id, title: s.title})}>Edit</button>
                  <button onClick={() => removeSong(s.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>

        <select value={newSong.artistId} onChange={e => setNewSong({...newSong, artistId: e.target.value, albumId: ""})}>
          <option value="">Select Artist</option>
          {aD.artists.map(a => <option key={a.id} value={a.id}>{a.firstName}</option>)}
        </select>

        <select value={newSong.albumId} onChange={e => setNewSong({...newSong, albumId: e.target.value})}>
          <option value="">Select Album</option>
          {filteredAlbums.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>

        <input placeholder="Song Title" value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})}/>
        <button onClick={addSong}>Add Song</button>
      </section>
    </div>
  );
}

export default App;
