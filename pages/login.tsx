import React from 'react'
import { getProviders, signIn } from 'next-auth/react'
//@ts-ignore
function Login({ providers }) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black">
      {Object.values(providers).map((provider) => (
        <div key={
          //@ts-ignore
          provider.id
        }>
          <button className='bg-[#18D860] text-white p-5 rounded-full' onClick={
            //@ts-ignore
            () => signIn(provider.id, { callbackUrl: '/'})
          }>
            Login with{' '}
            {
              //@ts-ignore
              provider.name
            }
          </button>
        </div>
      ))}
    </div>
  )
}

export default Login

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}
