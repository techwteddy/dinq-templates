import Image from "next/image";

const Logo = ({ className = "", ...props }) => (
  <Image
    src={`/FGR_logo_purple-dark.png`}
    width={33}
    height={33}
    alt="6"
    key={"contactImage"}
    className={className}
    {...props}
  />
);

export default Logo;
