import Link from "next/link";
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";
import { AiOutlineDown } from "react-icons/ai";

type MenuRowProps = {
  children: ReactNode;
  icon?: ReactNode;
  transparent?: boolean;
};

type MenuLinkProps = {
  href: string;
  padding?: boolean;
  selected?: boolean;
} & MenuRowProps;
export const MenuLink = ({
  children,
  href,
  icon,
  transparent,
  selected,
  padding,
}: MenuLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-5 px-5 py-2 hover:text-primary ${
        transparent ? "" : "bg-darkgray hover:bg-gray"
      } ${selected ? "text-primary" : "text-smoke"} ${
        padding ? "pr-[3.75rem]" : ""
      }`}
    >
      <div className="h-5 w-5">{icon}</div>
      <span>{children}</span>
    </Link>
  );
};

type MenuButtonProps = {
  padding?: boolean;
  selected?: boolean;
} & MenuRowProps &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export const MenuButton = ({
  children,
  icon,
  transparent,
  selected,
  padding,
  ...props
}: MenuButtonProps) => {
  return (
    <button
      className={`flex w-full items-center gap-5 px-5 py-2 hover:text-primary ${
        transparent ? "" : "bg-darkgray hover:bg-gray"
      } ${selected ? "text-primary" : "text-smoke"} ${
        padding ? "pr-[3.75rem]" : ""
      }`}
      {...props}
    >
      <div className="h-5 w-5">{icon}</div>
      <span>{children}</span>
    </button>
  );
};

type MenuButtonWithArrowProps = {
  reverseArrow?: boolean;
} & MenuRowProps &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
export const MenuButtonWithArrow = ({
  children,
  icon,
  transparent,
  reverseArrow,
  ...props
}: MenuButtonWithArrowProps) => {
  return (
    <button
      className={`flex w-full items-center justify-between gap-5 px-5 py-2 hover:text-primary ${
        transparent ? "" : "bg-darkgray hover:bg-gray"
      }`}
      {...props}
    >
      <div className="flex items-center gap-5">
        <div className="h-5 w-5">{icon}</div>
        <span>{children}</span>
      </div>

      <AiOutlineDown
        size={20}
        className={`transition-transform duration-300 ${
          reverseArrow ? "rotate-180" : ""
        }`}
      />
    </button>
  );
};
