import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import Nevbar from './component/Nevbar'
import Information from './component/Information'
import News from './component/News'

function index() {
  return (
    <div>
      <Head>
        <title>Lost Saga Thailand</title>
      </Head>
      <Nevbar />
      <Information />
    </div>

  )
}

export default index