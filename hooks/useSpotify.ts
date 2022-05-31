import { signIn, useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import spotifyApi from '../lib/spotify'

function useSpotify() {
    const { data: session, status } = useSession()

    useEffect(() => {
        if(session) {
            if(session.error === 'RefreshTokenError') {
                signIn()
            }
            //@ts-ignore
            spotifyApi.setAccessToken(session?.user?.accessToken)
        }
    }, [session])
    return spotifyApi
}

export default useSpotify