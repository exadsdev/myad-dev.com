import React from 'react'
import Link from 'next/link'

export default function Nav() {
  return (
    <>

      <div className="d-flex justify-content-around">

        <Link className='btn btn-outline-primary mx-5' href="/admin" > Blog </Link>
        <Link className='btn btn-outline-danger mx-5' href="/admin/videos" > videos </Link>

        <Link className='btn btn-outline-success mx-5' href="/admin/reviews" > Reviews </Link>

      </div>

    </>
  )
}
