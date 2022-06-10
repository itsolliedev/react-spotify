import type { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden scrollbar-hide">
      <Head>
        <title>Spotify 2.0</title>
      </Head>

      <main className='flex'>
        <Sidebar />
        <Center />
      </main>

      <div className="sticky bottom-0">
       <Player />
      </div>
    </div>
  )
}

//@ts-ignore
export async function getServerSideProps(context) {
  const session = await getSession(context)

  return { 
    props: {
      session,
    }
  }
}

export default Home
