import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { CloseBtn, MenuBtn } from "~/shared/ui/buttons";
import { ModalBlackscreen } from "~/components/Modal";
import { MenuButtonWithArrow, MenuLink } from "~/shared/ui/MenuRow";
import {
  AboutIcon,
  ActivitiesIcon,
  CamerasIcon,
  CollaborationIcon,
  ContactsIcon,
  ExcursionsIcon,
  MainIcon,
  MapIcon,
  NewsIcon,
  PhotogalleryIcon,
  ReviewsIcon,
  WeatherIcon,
} from "~/shared/ui/icons";

const Sidebar = () => {
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  return (
    <>
      <MenuBtn onClick={() => setSidebarIsOpen((prev) => !prev)} />

      <SidebarView isOpen={sidebarIsOpen} setIsOpen={setSidebarIsOpen}>
        <SidebarContent />
      </SidebarView>
    </>
  );
};

export default Sidebar;

const SidebarContent = () => {
  const [openedId, setOpenedId] = useState("");

  return (
    <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
      <div className="relative flex flex-col pb-5">
        <Row href="/" title="Главная" icon={<MainIcon />} />
        <Row href="/excursions" title="Экскурсии" icon={<ExcursionsIcon />} />
        <Row href="/pathway" title="Как добраться" icon={<MapIcon />} />
        <Row href="/news" title="Новости" icon={<NewsIcon />} />
        <Row
          href="/photogallery"
          title="Фотогалерея"
          icon={<PhotogalleryIcon />}
        />
        <Row href="/reviews" title="Отзывы" icon={<ReviewsIcon />} />
        <Row href="/webcams" title="Камеры САО РАН" icon={<CamerasIcon />} />
        <Row
          href="/weather"
          title="Погода в обсерватории"
          icon={<WeatherIcon />}
        />
        <Category
          id="activities"
          title="Активности"
          icon={<ActivitiesIcon />}
          openedId={openedId}
          setOpenedId={setOpenedId}
        >
          <Row
            href="/observatory-tours"
            title="Экскурсии в обсерваторию"
            padding={false}
          />
          <Row href="/planetarium" title="Планетарий" padding={false} />
        </Category>
        <Category
          id="collab"
          title="Сотрудничество"
          icon={<CollaborationIcon />}
          openedId={openedId}
          setOpenedId={setOpenedId}
        >
          <Row
            href="/collaboration"
            title="Сотрудничество со мной"
            padding={false}
          />
          <Row href="/transfer" title="Трансфер" padding={false} />
          <Row href="/lodging" title="Жилье" padding={false} />
        </Category>
        <Row href="/about" title="Обо мне" icon={<AboutIcon />} />
        <Row href="/contacts" title="Контакты" icon={<ContactsIcon />} />
      </div>
    </div>
  );
};

type SidebarViewProps = {
  children?: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
const SidebarView = ({ children, isOpen, setIsOpen }: SidebarViewProps) => {
  return (
    <ModalBlackscreen isOpen={isOpen} setIsOpen={setIsOpen}>
      <div
        className={`${
          isOpen ? "" : "translate-x-full"
        } absolute bottom-0 right-0 top-0 h-full max-w-[100vw] border bg-darkgray transition-all duration-500`}
      >
        <div className="flex items-center justify-end p-2">
          <CloseBtn onClick={() => setIsOpen(false)} />
        </div>
        {children}
      </div>
    </ModalBlackscreen>
  );
};

type RowProps = {
  href: string;
  title: string;
  icon?: ReactNode;
  padding?: boolean;
};
const Row = ({ href, title, icon, padding = true }: RowProps) => {
  const { pathname: currentPage } = useRouter();
  return (
    <MenuLink
      href={href}
      icon={icon}
      padding={padding}
      selected={currentPage === href}
    >
      {title}
    </MenuLink>
  );
};

type CategoryProps = {
  id: string;
  title: string;
  children: ReactNode;
  icon?: ReactNode;
  openedId: string;
  setOpenedId: Dispatch<SetStateAction<string>>;
};
const Category = ({
  id,
  title,
  children,
  icon,
  openedId,
  setOpenedId,
}: CategoryProps) => {
  return (
    <div className="flex flex-col">
      <MenuButtonWithArrow
        icon={icon}
        reverseArrow={openedId === id}
        onClick={() => setOpenedId((prev) => (prev === id ? "" : id))}
      >
        {title}
      </MenuButtonWithArrow>

      <motion.div
        className={`overflow-hidden ${
          openedId === id ? "" : "pointer-events-none"
        }`}
        animate={{
          height: openedId === id ? "auto" : 0,
          transition: {
            duration: 0.3,
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
