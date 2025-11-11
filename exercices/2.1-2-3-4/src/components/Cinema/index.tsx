import type { Movie as MovieType } from "../../utils/types";
import Movie from "./Movie";

interface CinemaProps {
  name: string;
  movies: MovieType[];
}

const Cinema = (props: CinemaProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <h2>{props.name}</h2>
          </th>
        </tr>
      </thead>
      <tbody>
        <ul>
          {props.movies.map((movie) => (
            <tr>
              <td>
                <Movie title={movie.title} director={movie.director}></Movie>
              </td>
            </tr>
          ))}
        </ul>
      </tbody>
    </table>
  );
};

export default Cinema;
