import type { DetailedHTMLProps, HTMLAttributes } from "react";

const PageContainer = ({
  children,
  className,
  ...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  return (
    <main
      className={`mx-auto flex w-full max-w-[900px] flex-col items-center p-2 lg:w-2/3 lg:p-5 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </main>
  );
};

export default PageContainer;
