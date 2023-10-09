import type { DetailedHTMLProps, HTMLAttributes } from "react";

const Line = ({
  className = "",
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <div className={`w-full py-2 ${className}`} {...props}>
      <hr />
    </div>
  );
};
export default Line;
