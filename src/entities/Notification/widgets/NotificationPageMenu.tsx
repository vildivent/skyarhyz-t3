import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { motion } from "framer-motion";
import { MenuDotsBtn } from "~/shared/ui/buttons";
import { api } from "~/shared/utils/api";
import { MenuButton } from "~/shared/ui/MenuRow";
import { AiOutlineClose, AiOutlineEye } from "react-icons/ai";
import { BsListCheck } from "react-icons/bs";

const NotificationPageMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="flex w-full items-center justify-end"
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="relative">
        <MenuDotsBtn
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsOpen(true)}
          className="-mx-2"
        />
        <ContextMenu isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
};

export default NotificationPageMenu;

type ContextMenuProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
const ContextMenu = ({ isOpen, setIsOpen }: ContextMenuProps) => {
  const ctx = api.useContext();
  const { mutate: checkAll } = api.notification.checkAll.useMutation({
    onSuccess: () => {
      return ctx.notification.invalidate();
    },
  });
  const { mutate: hideChecked } = api.notification.hideChecked.useMutation({
    onSuccess: () => {
      return ctx.notification.get.invalidate();
    },
  });
  const { mutate: showChecked } = api.notification.showChecked.useMutation({
    onSuccess: () => {
      return ctx.notification.get.invalidate();
    },
  });
  return (
    <View isOpen={isOpen} setIsOpen={setIsOpen}>
      <Content
        hideChecked={hideChecked}
        checkAll={checkAll}
        showChecked={showChecked}
      />
    </View>
  );
};

type ViewProps = {
  children: ReactNode;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};
const View = ({ children, isOpen, setIsOpen }: ViewProps) => {
  return (
    <motion.div
      className={`absolute right-0 z-10 flex flex-col whitespace-nowrap border ${
        isOpen ? "" : "pointer-events-none opacity-0"
      }`}
      onClick={() => setIsOpen(false)}
      animate={{
        y: isOpen ? -1 : 20,
        opacity: isOpen ? 100 : 0,

        transition: {
          duration: 0.15,
        },
      }}
    >
      {children}
    </motion.div>
  );
};

type ContentProps = {
  hideChecked: () => void;
  checkAll: () => void;
  showChecked: () => void;
};
const Content = ({ hideChecked, checkAll, showChecked }: ContentProps) => {
  const size = 20;

  return (
    <>
      <RowButton
        title="Отметить всё как прочитанное"
        onClick={() => checkAll()}
        icon={<BsListCheck size={size} />}
      />
      <RowButton
        title="Скрыть прочитанные"
        onClick={() => hideChecked()}
        icon={<AiOutlineClose size={size} />}
      />
      <RowButton
        title="Показать прочитанные"
        onClick={() => showChecked()}
        icon={<AiOutlineEye size={size} />}
      />
    </>
  );
};

type RowButtonProps = {
  title: string;
  onClick: () => void;
  icon?: ReactNode;
};
const RowButton = ({ title, onClick, icon }: RowButtonProps) => {
  return (
    <MenuButton icon={icon} onClick={onClick}>
      {title}
    </MenuButton>
  );
};
