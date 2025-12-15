interface MovieProps {
  title: string;
  director: string;
}

const Movie = (props: MovieProps) => {
  return (
    <div>
      <strong>{props.title}</strong> - Réalisateur : {props.director}
    </div>
  );
};

export default Movie;
