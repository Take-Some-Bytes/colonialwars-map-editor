/* eslint-env react */
/**
 * @fileoverview Main application component.
 */

import React, { Suspense } from 'react'
import debugFactory from 'debug'

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Navigate
} from 'react-router-dom'

import { MutableMapConfig } from 'colonialwars-lib/mapconfig'

import Loading from './components/loading.jsx'

import ErrorModal from './layout/modals/error-modal.jsx'
import NewMapModal from './layout/modals/new-map-modal.jsx'

import { ViewportDimensions } from './helpers/display-utils.js'
import { loadKeybindings, loadMap } from './helpers/loaders.js'

const LandingPage = React.lazy(() => import('./layout/pages/landing.jsx'))
const EditorPage = React.lazy(() => import('./layout/pages/editor.jsx'))

const debug = debugFactory('cw:editor:main')

const vwDimensions = new ViewportDimensions()

/**
 * Main component.
 * @returns {JSX.Element}
 */
export default function App () {
  const [error, setError] = React.useState(null)
  const [mapConfig, setMapConfig] = React.useState(null)
  const [newMapModalOpened, setNewMapModalOpened] = React.useState(false)

  const newMapResolveRef = React.useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  const landingElem = (
    <Suspense fallback={<Loading />}>
      <LandingPage
        setError={setError}
        setMapConfig={setMapConfig}
        setNewMapModalOpened={setNewMapModalOpened}
      />
    </Suspense>
  )
  const editorElem = (
    <Suspense fallback={<Loading />}>
      <EditorPage
        closeEditor={() => {
          setError(null)
          setMapConfig(null)
          setNewMapModalOpened(false)

          navigate('/')
        }}
        setError={setError}
        mapConfig={mapConfig}
        vwDimensions={vwDimensions}
        keyBindings={loadKeybindings()}
        openNewMapModal={() => {
          setNewMapModalOpened(true)

          return new Promise(resolve => {
            newMapResolveRef.current = resolve
          })
        }}
        loadMap={async () => {
          let config

          try {
            config = await loadMap()
          } catch (ex) {
            setError(ex)
          }

          if (config === null) {
            // No file is selected.
            return false
          }

          setMapConfig(config)
          return true
        }}
      />
    </Suspense>
  )

  const rootClassNames = []
  if (location.pathname === '/') {
    rootClassNames.push('space-between')
    rootClassNames.push('root--home')
  } else {
    rootClassNames.push('root--editor')
  }

  return (
    <div className={rootClassNames.join(' ')}>
      {/* Generic modals */}
      <ErrorModal
        isOpen={error instanceof Error}
        closeModal={() => setError(null)}
        vwDimensions={vwDimensions}
        error={error || {}}
      />
      <NewMapModal
        isOpen={newMapModalOpened}
        vwDimensions={vwDimensions}
        closeModal={() => {
          if (typeof newMapResolveRef.current === 'function') {
            // The editor is waiting on us.
            // Tell it to continue.
            newMapResolveRef.current(false)
            newMapResolveRef.current = null
          }

          setNewMapModalOpened(false)
        }}
        onNewMap={newConf => {
          const config = MutableMapConfig.createNew({
            ...newConf,
            worldLimits: {
              x: newConf.size.x * 100,
              y: newConf.size.y * 100
            }
          })

          if (typeof newMapResolveRef.current === 'function') {
            // The editor is waiting on us.
            // Tell it to stop.
            newMapResolveRef.current(true)
            newMapResolveRef.current = null
          }

          debug('New map config: %O', config)

          setMapConfig(config)
          setNewMapModalOpened(false)
          navigate('/editor')
        }}
      />

      {/* Actual page */}
      <Routes>
        <Route path='/' element={landingElem} />
        {/* Don't you dare try to go to the editor without loading a map. */}
        <Route path='/editor' element={mapConfig ? editorElem : <Navigate to='/' replace />} />
      </Routes>
    </div>
  )
}
