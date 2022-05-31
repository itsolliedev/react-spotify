import { ChevronDownIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistAtom, playlistIdState } from '../atoms/playlistAtom'
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
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistAtom)
  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])
  useEffect(() => {
    if (playlistId) {
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
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8" >
        <div className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80" onClick={() => signOut()}>
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
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white mb-2`}
      >
        {playlistId != 'Home' && (
          <img
            // @ts-ignore
            src={playlist?.images?.[0]?.url}
            alt=""
            className="h-44 w-44 rounded-md shadow-xl"
          />
        )}
        {playlistId != 'Home' && (
          <div>
            <p>PLAYLIST</p>
            <h2 className="text-2xl font-bold md:text-3xl xl:text-5xl">
              {/* @ts-ignore */}
              {playlist?.name}
            </h2>
          </div>
        )}
        {playlistId == 'Home' && (
          <div>
            <h1>This is your homepage</h1>
          </div>
        )}
      </section>
      <div>{playlistId != 'Home' && <Songs />}</div>
    </div>
  )
}

export default Center
