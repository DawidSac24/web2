interface FooterProps {
  imageUrl?: string;
  children?: React.ReactNode;
}

const Footer = (props: FooterProps) => {
  return (
    <div>
      <img src={props.imageUrl} alt="" />
      <div>{props.children}</div>
    </div>
  );
};

export default Footer;
