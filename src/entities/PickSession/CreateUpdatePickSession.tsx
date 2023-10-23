import { useState, useEffect, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ModalContainer } from "~/components/Modal";
import { CancelBtn, MainBtn } from "~/shared/ui/buttons";
import {
  Checkbox,
  HoursInput,
  MinutesInput,
  SelectInput,
} from "~/shared/ui/inputs";
import { useGroupFieldsStore } from "./lib/store";
import {
  getDefaultData,
  groupDatesToFields,
  groupFieldsToDates,
} from "./lib/helpers";
import { api } from "~/shared/utils/api";
import type { PickSessionItem } from "./types";
import Loading from "~/shared/ui/Loading";

type CreateUpdatePickSessionProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  pickSession?: PickSessionItem | null;
};
const CreateUpdatePickSession = ({
  isOpen,
  setIsOpen,
  pickSession,
}: CreateUpdatePickSessionProps) => {
  return (
    <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form isOpen={isOpen} setIsOpen={setIsOpen} pickSession={pickSession} />
    </ModalContainer>
  );
};

export default CreateUpdatePickSession;

type FormProps = CreateUpdatePickSessionProps;
const Form = ({ isOpen, setIsOpen, pickSession }: FormProps) => {
  const defaultGroupsCount = 3;
  const maxGroups = 7;
  const { groups, setTime, setDefault } = useGroupFieldsStore();
  const [groupsCount, setGroupsCount] = useState(defaultGroupsCount);
  const ctx = api.useContext();
  const {
    mutate: create,
    isLoading: creating,
    isError: isErrorCreate,
  } = api.pickSession.create.useMutation({
    onSuccess: async () => {
      await ctx.pickSession.invalidate();
      setIsOpen(false);
    },
  });
  const {
    mutate: update,
    isLoading: updating,
    isError: isErrorUpdate,
  } = api.pickSession.update.useMutation({
    onSuccess: async () => {
      await ctx.pickSession.invalidate();
      setIsOpen(false);
    },
  });

  const currentData = useMemo(() => {
    if (!pickSession) return null;
    const pickSessionGroups = [...pickSession.pickSessionGroups]
      .splice(1)
      .map((group) => group.time);
    if (pickSession && pickSessionGroups)
      return groupDatesToFields(pickSessionGroups, pickSession?.createdAt);
  }, [pickSession]);

  const submitHandler = () => {
    const dates = [...groups].splice(0, groupsCount);
    if (!pickSession)
      create({
        groups: groupsCount,
        times: groupFieldsToDates(dates, new Date()),
      });
    else {
      update({
        id: pickSession.id,
        groups: groupsCount,
        times: groupFieldsToDates(dates, pickSession.createdAt),
      });
    }
  };

  useEffect(() => {
    if (!isOpen) setDefault(getDefaultData(maxGroups));
    if (isOpen && currentData) {
      setGroupsCount(currentData.length);

      currentData.forEach((currentGroup) => {
        setTime(groups, currentGroup.group, currentGroup);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, setDefault, setTime]);

  return (
    <form
      className="flex flex-col items-center gap-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className="text-center text-4xl">
        {(currentData === null ? "Создание " : "Изменение ") + "экскурсии"}
      </h2>
      <GroupsCountField
        groupsCount={groupsCount}
        setGroupsCount={setGroupsCount}
      />
      <div className="grid grid-cols-2 justify-items-center gap-y-2">
        <span>Время</span>
        <span>След. сутки</span>
        {[...groups].splice(0, groupsCount).map((el) => (
          <GroupFieldComponent key={el.group} group={el.group} />
        ))}
      </div>
      {currentData?.length && groupsCount < currentData?.length && (
        <span className="max-w-[22rem] text-center text-red-500">
          Внимание! Вы пытаетесь удалить группы. Все участники этих групп
          переместятся в нулевую группу.
        </span>
      )}
      {(isErrorCreate || isErrorUpdate) && (
        <span className="max-w-[22rem] text-center text-red-500">
          Произошла ошибка! Попробуйте повторить запрос.
        </span>
      )}

      <div className="grid grid-cols-2 gap-2">
        {updating || creating ? (
          <Loading />
        ) : (
          <MainBtn onClick={() => submitHandler()}>Подтвердить</MainBtn>
        )}

        <CancelBtn onClick={() => setIsOpen(false)}>Отмена</CancelBtn>
      </div>
    </form>
  );
};

type GroupFieldProps = {
  group: number;
};
export const GroupFieldComponent = ({ group }: GroupFieldProps) => {
  const { groups, setHour, setMinute, invertNextDay } = useGroupFieldsStore();

  return (
    <>
      <div className="flex items-center gap-2">
        <span>{`${group}:`}</span>
        <HoursInput
          value={groups[group - 1]?.hour || ""}
          onChange={(e) => setHour(groups, group, e.target.value)}
        />
        <span>:</span>
        <MinutesInput
          value={groups[group - 1]?.minute || ""}
          onChange={(e) => setMinute(groups, group, e.target.value)}
        />
      </div>
      <Checkbox
        checked={groups[group - 1]?.nextDay}
        onChange={() => invertNextDay(groups, group)}
      />
    </>
  );
};

type GroupsCountFieldProps = {
  groupsCount: number;
  setGroupsCount: Dispatch<SetStateAction<number>>;
  maxGroupsCount?: number;
};
const GroupsCountField = ({
  groupsCount,
  setGroupsCount,
  maxGroupsCount = 7,
}: GroupsCountFieldProps) => {
  const groupsArray: number[] = [];

  for (let i = 1; i <= maxGroupsCount; i++) {
    groupsArray.push(i);
  }

  return (
    <div className="flex items-center gap-2">
      <span>{`Колличество групп:`}</span>
      <SelectInput
        value={groupsCount}
        onChange={(e) => setGroupsCount(+e.target.value)}
      >
        {groupsArray.map((group) => (
          <option key={group} value={group}>
            {group}
          </option>
        ))}
      </SelectInput>
    </div>
  );
};
