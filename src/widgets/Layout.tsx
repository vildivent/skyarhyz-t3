import type { ReactNode } from "react";
import Image from "next/image";
import Navbar from "~/widgets/Navbar";
import Footer from "~/widgets/Footer";

type LayoutProps = {
  children: ReactNode;
};
const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <div className="fixed z-0 h-full w-full">
        <Image
          className="object-cover"
          src="/bg.jpg"
          alt="Фон"
          fill
          quality={100}
        />
      </div>

      <div className="relative z-10 flex min-h-[100lvh] flex-col justify-between bg-darkgray/70">
        <div>
          <Navbar />
          {children}
        </div>
        <Footer />
      </div>

      <div id="modal" />
    </>
  );
};

export default Layout;
