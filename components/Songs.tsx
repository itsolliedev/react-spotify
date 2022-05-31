import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistAtom } from '../atoms/playlistAtom'
import Song from './Song'

function Songs() {
    const playlist = useRecoilValue(playlistAtom)
  return (
      <div className='px-8 flex flex-col space-y-1 pb-28'>
          {/* @ts-ignore */}
          {playlist?.tracks?.items.map((item, i) => (
              <Song key={item.track.id} order={i} track={item} />
            ))}
      </div>
  )
}

export default Songs