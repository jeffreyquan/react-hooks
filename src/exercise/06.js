// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   state = {error: null}

//   static getDerivedStateFromError(error) {
//     return {error}
//   }

//   render() {
//     const {error} = this.state
//     if (error) {
//       return <this.props.FallbackComponent error={error} />
//     }

//     return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) return
    setState({
      status: 'pending',
    })

    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({
          status: 'resolved',
          pokemon,
        })
      })
      .catch(error => {
        setState({
          status: 'rejected',
          error,
        })
      })
  }, [pokemonName])

  if (status === 'idle') {
    return <div>Submit a pokemon</div>
  } else if (status === 'rejected') {
    // handled by error boundary
    throw error
  } else if (status === 'pending' || !pokemon) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setPokemonName('')
          }}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

export default App
