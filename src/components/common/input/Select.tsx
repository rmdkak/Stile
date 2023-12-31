import { useState } from "react";
import type { MouseEvent, ChangeEvent, Dispatch } from "react";

import { ArrowButton } from "components/common";

interface Props {
  option: string[];
  selectedValue: string | undefined;
  setSelectedValue: Dispatch<React.SetStateAction<string | undefined>>;
  placeholder?: string;
  defaultValue?: string;
  selfEnterOption: boolean;
  checkedDuplicate?: {
    email: boolean;
    name: boolean;
  };
  setCheckedDuplicate?: React.Dispatch<{ email: boolean; name: boolean }>;
}

export const Select = ({
  option,
  selectedValue,
  setSelectedValue,
  placeholder = "선택해주세요.",
  defaultValue,
  selfEnterOption,
  checkedDuplicate,
  setCheckedDuplicate,
}: Props) => {
  const [toggleIsOpen, setToggleIsOpen] = useState(false);
  const [selfEnterIsOpen, setSelfEnterIsOpen] = useState(false);

  const onChangeHandler = (event: MouseEvent<HTMLDivElement> | ChangeEvent<HTMLInputElement>) => {
    if (event.target === null) return;
    setSelectedValue(event.currentTarget.innerText);
    setSelfEnterIsOpen(false);
    setToggleIsOpen(false);
  };

  const changeToggleHandler = () => {
    setToggleIsOpen(!toggleIsOpen);
  };

  const commonStyle = "w-full px-[24px] py-[8px] cursor-pointer focus:outline-none hover:bg-gray05";

  return (
    <div className="relative w-full h-[50px]">
      {selfEnterIsOpen ? (
        <>
          <input
            onChange={(event) => {
              setSelectedValue(event?.target.value);
              if (checkedDuplicate !== undefined && setCheckedDuplicate !== undefined) {
                setCheckedDuplicate({ ...checkedDuplicate, email: false });
              }
            }}
            value={selectedValue ?? defaultValue}
            className="w-full auth-input"
          />
          <ArrowButton
            isOpen={toggleIsOpen}
            openHandler={changeToggleHandler}
            statusToClose={toggleIsOpen}
            statusToOpen={toggleIsOpen}
            className={"absolute w-4 h-4 right-3 top-1/2 text-gray02 -translate-y-1/2 cursor-pointer"}
          />
        </>
      ) : (
        <button className="flex items-center w-full h-12 auth-input" type="button" onClick={changeToggleHandler}>
          <p className="text-center whitespace-nowrap body-3">
            {selectedValue !== undefined ? selectedValue : placeholder}
          </p>
          <ArrowButton
            isOpen={toggleIsOpen}
            openHandler={changeToggleHandler}
            statusToClose={toggleIsOpen}
            statusToOpen={toggleIsOpen}
            className={"absolute w-4 h-4 right-3 top-1/2 text-gray02 -translate-y-1/2 cursor-pointer"}
          />
        </button>
      )}
      <div className="absolute w-full top-[50px] bg-white z-50 shadow-lg body-3">
        {toggleIsOpen &&
          option.map((el) => (
            <div key={el} onClick={onChangeHandler} className={`${commonStyle}`}>
              {el}
            </div>
          ))}
        {toggleIsOpen && selfEnterOption && (
          <div
            onClick={() => {
              setSelectedValue("");
              setToggleIsOpen(false);
              setSelfEnterIsOpen(true);
            }}
            className={`${commonStyle}`}
          >
            직접 입력
          </div>
        )}
      </div>
    </div>
  );
};
