import React from 'react';

// API
import API from '../API';

// Config
import { POSTER_SIZE, BACKDROP_SIZE, IMAGE_BASE_URL } from '../config';

// Componenets
import HeroImage from './HeroImage';
import Grid from './Grid';
import Thumb from './Thumb';
import Spinner from './Spinner';
import SearchBar from './SearchBar';
import Button from './Button';

// Hook
import { useHomeFetch } from '../hooks/useHomeFetch';

// Image
import NoImage from '../images/no_image.jpg';

const Home = () => {

  const { state, loading, error, searchTerm, setSearchTerm, setIsLoadingMore } = useHomeFetch();
  // console.log(state);

  if (error) return <div>Something went wrong...</div>

  return (
    <>
      {!searchTerm && state.results[0] ?
        <HeroImage
          image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${state.results[0].backdrop_path}`}
          title={state.results[0].original_title}
          text={state.results[0].overview}
        />
        : null
      }
      <SearchBar setSearchTerm={setSearchTerm} />
      <Grid header={searchTerm ? 'Search Result' : 'Popular Movies'}>
        {state.results.map(movie => (
          <Thumb
            image={
              movie.poster_path
                ? IMAGE_BASE_URL + BACKDROP_SIZE + movie.poster_path
                : NoImage
            }
            key={movie.id}
            clickable={true}
            movieId={movie.id}
          />
        ))}
      </Grid>
      {loading ?
        <Spinner />
        : null
      }
      {state.page < state.total_pages && !loading ?
        <Button text='Load More' callback={() => setIsLoadingMore(true)} />
        : null
      }
    </>
  )
}

export default Home;
