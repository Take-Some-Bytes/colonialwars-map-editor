/* eslint-env react */
/**
 * @fileoverview Main application component.
 */

import React from 'react'

import Layout from './layout/layout.jsx'
import Header from './layout/header.jsx'
import Footer from './layout/footer.jsx'
import Content from './layout/content.jsx'
import CustomModal from './components/custom-modal.jsx'

/**
 * Main component.
 * @returns {JSX.Element}
 */
export default function App () {
  // const [page, setPage] = React.useState(0)
  const [newMapModalOpened, setNewMapModalOpened] = React.useState(false)
  const viewportDimensions = {
    width: (() => {
      if (window.innerWidth !== undefined) {
        const vw = window.innerWidth
        return vw
      }
      const vw = document.documentElement.clientWidth
      return vw
    })(),
    height: (() => {
      if (window.innerHeight !== undefined) {
        const vw = window.innerHeight
        return vw
      }
      const vw = document.documentElement.clientHeight
      return vw
    })()
  }
  console.log(viewportDimensions)
  console.log(Math.round(viewportDimensions.width / 2))
  console.log(Math.round(viewportDimensions.height / 2))

  return (
    <Layout id='app-layout' className='space-between'>
      <Header />
      <Content
        buttonHandlers={{
          handleNewMap: e => {
            e.preventDefault()
            e.stopPropagation()
            setNewMapModalOpened(true)
          },
          handleLoadMap: e => {}
        }}
      />
      <Footer version={import.meta.env.SNOWPACK_PUBLIC_VERSION} />
      <CustomModal
        id='new-map-modal'
        isOpen={newMapModalOpened}
        headerContent='New Map'
        dimensions={{
          width: 400,
          height: 400
        }}
        position={{
          x: Math.round(viewportDimensions.width / 2) - 400 / 2,
          y: Math.round(viewportDimensions.height / 2) - 400 / 2
        }}
        onCloseRequest={e => {
          e.stopPropagation()
          e.preventDefault()
          setNewMapModalOpened(false)
        }}
        footerContent={
          <div className='float-right'>
            <button
              className='ui-button ui-size-small'
              style={{
                margin: '12px'
              }}
            >
              OK
            </button>
          </div>
        }
      >
        Size
      </CustomModal>
    </Layout>
  )
}
