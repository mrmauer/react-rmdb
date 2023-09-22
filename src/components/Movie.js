import React from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import API from "../API";

import { IMAGE_BASE_URL, POSTER_SIZE } from "../config";
// components
import Grid from "./Grid";
import Spinner from "./Spinner";
import BreadCrumb from "./BreadCrumb";
import MovieInfo from "./MovieInfo";
import MovieInfoBar from "./MovieInfoBar";
import Actor from "./Actor";
// Image
import NoImage from "../images/no_image.jpg";

class Movie extends React.Component {
  state = {
    loading: true,
    error: false,
    movie: {},
  };

  render() {
    const { loading, error, movie } = this.state;

    if (loading) return <Spinner />;
    if (error) return <div>Something went wrong...</div>;

    return (
      <>
        <BreadCrumb movieTitle={movie.original_title} />
        <MovieInfo movie={movie} />
        <MovieInfoBar
          time={movie.runtime}
          budget={movie.budget}
          revenue={movie.revenue}
        />
        <Grid header="Actors">
          {movie.actors.map((actor) => (
            <Actor
              key={actor.credit_id}
              name={actor.name}
              character={actor.character}
              imageUrl={
                actor.profile_path
                  ? `${IMAGE_BASE_URL}${POSTER_SIZE}${actor.profile_path}`
                  : NoImage
              }
            />
          ))}
        </Grid>
      </>
    );
  }

  fetchMovie = async (movieId) => {
    try {
      this.setState({ loading: true, error: false });

      const movie = await API.fetchMovie(movieId);
      const credits = await API.fetchCredits(movieId);

      // get directors only
      const directors = credits.crew.filter(
        (member) => member.job === "Director"
      );

      this.setState({
        movie: {
          ...movie,
          actors: credits.cast,
          directors,
        },
        loading: false,
      });
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  };

  componentDidMount() {
    this.fetchMovie(this.props.params.movieId);
  }
}

const MovieWithParams = (props) => <Movie {...props} params={useParams()} />;

export default MovieWithParams;
