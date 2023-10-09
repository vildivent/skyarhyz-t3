import type { DetailedHTMLProps, HTMLAttributes } from "react";

const EntitiContainer = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div
      className={`flex flex-col rounded-md border bg-darkgray/70 p-5 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </div>
  );
};

export default EntitiContainer;
