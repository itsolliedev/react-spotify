import React from 'react'
import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  HeartIcon,
  RssIcon,
} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { playlistIdState, playlistsAtom } from '../atoms/playlistAtom'
import { useRecoilState } from 'recoil'

function Sidebar() {
  const { data: session, status } = useSession()
  
  const spotifyApi = useSpotify()
  const [playlists, setPlaylists] = useRecoilState(playlistsAtom)
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

  React.useEffect(() => {
    if(spotifyApi.getAccessToken()) {
      //@ts-ignore
      spotifyApi.getUserPlaylists().then(data => {
        setPlaylists(data.body.items)
      })
    }
  }, [session, spotifyApi])

  return (
    <div className="border-r border-gray-900 p-5 text-xs lg:text-sm text-gray-500 overflow-y-scroll scrollbar-hide h-screen sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
      <div className="space-y-4">
        <button onClick={() => setPlaylistId('Home')} className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists */}
        {/* @ts-ignore */}
        {playlists.map(playlist => (
          //@ts-ignore
          <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className="cursor-pointer hover:text-white">{playlist.name}</p>
        ))}
        
      </div>
    </div>
  )
}

export default Sidebar
