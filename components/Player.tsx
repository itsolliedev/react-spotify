import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  FastForwardIcon,
  PauseIcon,
  PlayIcon,
  ReplyIcon,
  RewindIcon,
  VolumeUpIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/solid'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackState, isPlayingState } from '../atoms/songAtom'
import useSongInfo from '../hooks/useSongInfo'
import useSpotify from '../hooks/useSpotify'
import { debounce } from 'lodash'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)
  const songInfo = useSongInfo()

  const fetchSong = () => {
    if (!songInfo) {
      //@ts-ignore
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrack(data?.body?.item?.id)
      })

      //@ts-ignore
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setIsPlaying(data?.body?.is_playing)
      })
    }
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrack) {
      fetchSong()
      setVolume(50)
    }

    const interval = setInterval(() => {
      fetchSong()
    }, 10000)
  }, [currentTrack, spotifyApi, session])

  const handlePlayPause = () => {
    //@ts-ignore
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data?.body?.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        fetchSong()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  //@ts-ignore
  const debouncedAdjustVolume = useCallback(debounce((volume) => {
      //@ts-ignore
    spotifyApi.setVolume(volume).catch(err => {})
  }, 500), [])

  return (
    <div className="grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-14 w-14 rounded-sm md:inline"
          src={songInfo?.album.images[0].url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      <div className="flex items-center justify-evenly">
        <SwitchHorizontalIcon className="button" />
        <RewindIcon
          onClick={() => {
            spotifyApi.skipToPrevious()
            fetchSong()
          }} className="button"
        />
        {isPlaying ? (
          <PauseIcon
            onClick={() => handlePlayPause()}
            className="button h-10 w-10"
          />
        ) : (
          <PlayIcon
            onClick={() => handlePlayPause()}
            className="button h-10 w-10"
          />
        )}
        <FastForwardIcon
          onClick={() => {
            spotifyApi.skipToNext()
            fetchSong()
          }}
          className="button"
        />
        <ReplyIcon onClick={() => {
          //@ts-ignore
          spotifyApi.setRepeat("track")
        }} className="button" />
      </div>

      <div className="flex items-center justify-end space-x-3 md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-14 md:w-28"
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  )
}

export default Player
