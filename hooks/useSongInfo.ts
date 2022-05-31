import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackState } from '../atoms/songAtom'
import useSpotify from './useSpotify'

function useSongInfo() {
    const spotifyApi = useSpotify()
    const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState)
    const [songInfo, setSongInfo] = React.useState<any>(null)

    useEffect(() => {
        const fetchSong = async () => {
            if(currentTrack) {
                const song = await fetch(`https://api.spotify.com/v1/tracks/${currentTrack}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                    }
                })
                const newInfo = await song.json()
                setSongInfo(newInfo)
            }
        }
        fetchSong()
    }, [currentTrack, spotifyApi])

  return songInfo
}

export default useSongInfo