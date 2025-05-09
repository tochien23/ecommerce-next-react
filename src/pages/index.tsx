import Head from 'next/head'
import LayoutClient from 'src/views/layouts/LayoutClient'

export default function Home() {

  return (
    <>
      <Head>
        <title>LUXURY Store</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
    </>
  )
}

Home.getLayout = (page: React.ReactNode) => <LayoutClient>{page}</LayoutClient>
Home.guestGuard = false;
Home.authGuard = false;

