import React, { FC } from 'react'

export const Loader: FC<{
  header: React.ReactElement
}> = ({ header }) => {
  return (
    <>
      {header}
      <div className='my-center'>
        <div className='preloader-wrapper big active'>
          <div className='spinner-layer spinner-blue-only'>
            <div className='circle-clipper left'>
              <div className='circle'></div>
            </div>
            <div className='gap-patch'>
              <div className='circle'></div>
            </div>
            <div className='circle-clipper right'>
              <div className='circle'></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
