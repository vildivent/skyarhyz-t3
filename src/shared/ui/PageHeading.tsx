import type { DetailedHTMLProps, HTMLAttributes } from "react";

const PageHeading = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<
  HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>) => {
  return (
    <h1
      className={`${className || ""} font-h mb-2 text-center text-5xl md:mb-5`}
      {...props}
    >
      {children}
    </h1>
  );
};

export default PageHeading;
