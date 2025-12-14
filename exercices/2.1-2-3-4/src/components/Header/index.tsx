interface HeaderProps {
  imageUrl?: string;
  children?: React.ReactNode;
}

const Header = (props: HeaderProps) => {
  return (
    <div>
      <img src={props.imageUrl} alt="" />
      <div>{props.children}</div>
    </div>
  );
};

export default Header;
