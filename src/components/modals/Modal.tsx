import React, { useEffect } from "react";

import closeBtn from "assets/close.svg";
import { useModalStore } from "store";

interface Props {
  children: React.ReactNode;
  title?: string;
}

//
// size, css 등은 추후 디자인이 나오면 바꾸겠습니다.
//

export const Modal = ({ children, title }: Props): JSX.Element => {
  const { modalState, onCloseModal } = useModalStore((state) => state);

  //   페이지 입장, 이동시 모달창 닫게끄름
  useEffect(() => {
    onCloseModal();
    return onCloseModal;
  }, []);

  //   modalState값이 false라면 빈태그를 반환
  if (!modalState) return <></>;

  // 타입가드 type이 string 이거나 빈문자열이 아니라면?
  let titleBorder: string = "";
  const checkTypeGuard = typeof title === "string" && title !== "";
  if (checkTypeGuard) titleBorder = " border-b border-[#000]";

  // 이벤트버블링 문제 해결 함수
  const stopEventBubbleing = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    e.stopPropagation();
  };

  return (
    <>
      {/* 뒷배경 */}
      <div onClick={onCloseModal} className="fixed top-0 bottom-0 left-0 right-0 block w-full h-full bg-[#00000040]">
        {/* 모달 */}
        <div
          onClick={stopEventBubbleing}
          className="fixed top-[50%] left-[50%] p-6 bg-white  translate-x-[-50%] translate-y-[-50%]"
        >
          {/* 모달 헤더 */}
          <div className={`flex items-center justify-between pb-3 mb-8 ${titleBorder}`}>
            <h2>{title}</h2>

            <button className="" onClick={onCloseModal}>
              <img src={closeBtn} alt="닫기 버튼" />
            </button>
          </div>

          {children}
        </div>
      </div>
    </>
  );
};
