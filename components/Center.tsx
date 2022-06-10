import { ChevronDownIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  playlistAtom,
  playlistIdState,
  playlistsAtom,
} from '../atoms/playlistAtom'
import spotifyApi from '../lib/spotify'
import Songs from './Songs'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

function Center() {
  const { data: session } = useSession()
  const [color, setColor] = React.useState(null)
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistAtom)
  const [playlists, setPlaylists] = useRecoilState(playlistsAtom)
  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])
  useEffect(() => {
    if (playlistId && playlistId != 'Home') {
      spotifyApi
        .getPlaylist(playlistId)
        //@ts-ignore
        .then((data) => {
          setPlaylist(data.body)
        })
        //@ts-ignore
        .catch((err) => {
          console.log(err)
        })
    }
  }, [spotifyApi, playlistId])
  return (
    <div className="h-screen flex-grow overflow-x-hidden overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
          onClick={() => signOut()}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user?.image || ''}
            alt=""
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} mb-2 to-black p-8 text-white`}
      >
        {playlistId != 'Home' && (
          <>
            <img
              // @ts-ignore
              src={playlist?.images?.[0]?.url}
              alt=""
              className="h-44 w-44 rounded-md shadow-xl"
            />
            <div>
              <p>PLAYLIST</p>
              <h2 className="text-2xl font-bold md:text-3xl xl:text-5xl">
                {/* @ts-ignore */}
                {playlist?.name}
              </h2>
            </div>
          </>
        )}
        {playlistId == 'Home' && (
          <>
          <h1 className='ml-8 absolute top-28 text-2xl'>
            Welcome, <span className='font-semibold'>{session?.user?.name}</span>
          </h1>
          <div className="absolute top-52 flex w-[60rem] overflow-x-scroll scrollbar-hide">
            {
              // @ts-ignore
              playlists.map((playlist) => (
                //@ts-ignore
                <div
                  onClick={() => setPlaylistId(playlist.id)}
                  key={playlist.id}
                  className="mr-8 w-32 flex-row justify-center rounded-md bg-gray-900 bg-opacity-70 p-5 shadow-lg"
                >
                  <img
                    src={playlist?.images?.[0]?.url}
                    className="h-20 w-20 rounded-md shadow-md"
                  />
                  <p className="w-24 cursor-pointer pt-2 line-clamp-2 hover:text-white">
                    {playlist.name}
                  </p>
                </div>
              ))
            }
          </div>
          </>
        )}
      </section>
      <div>{playlistId != 'Home' && <Songs />}</div>
    </div>
  )
}

export default Center
