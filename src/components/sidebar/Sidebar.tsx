import React, { useCallback } from "react";
import { Link } from "react-router-dom";

import close from "assets/svgs/close.svg";
import { useAuth } from "hooks/useAuth";
import { useDynamicImport } from "hooks/useDynamicImport";
import { usePostsQuery } from "hooks/usePostsQuery";
import { useAuthStore } from "store";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarMemoization = ({ isOpen, setIsOpen }: Props): JSX.Element => {
  const { currentUserId } = useAuthStore();
  const { logoutWithMessage } = useAuth();
  const { preFetchPageBeforeEnter } = useDynamicImport();
  const { prefetchPostsMutation } = usePostsQuery();

  const logoutHandler = useCallback(async () => {
    closeSideBarHandler();
    void logoutWithMessage();
  }, []);

  const closeSideBarHandler = useCallback((): void => {
    setIsOpen(false);
  }, []);

  const prefetchCommunity = () => {
    void preFetchPageBeforeEnter("community");
    void prefetchPostsMutation();
  };

  return (
    <>
      <dialog className=" fixed z-[9110] top-0 box-border py-8 px-10 right-0 mr-0  h-full w-80" open={isOpen}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-title text-[1.25em]">STILE</h2>
          <button onClick={closeSideBarHandler} className="flex contents-center">
            <img src={close} alt="닫기버튼" className="w-full h-full" />
          </button>
        </div>

        <div className="pb-3 mb-8 border-b border-black">
          <ul className="flex gap-4 text-black body-3">
            {currentUserId === undefined ? (
              <>
                <li
                  onMouseEnter={async () => {
                    await preFetchPageBeforeEnter("login");
                  }}
                >
                  <Link onClick={closeSideBarHandler} to="/login">
                    로그인
                  </Link>
                </li>
                <li
                  onMouseEnter={async () => {
                    await preFetchPageBeforeEnter("signup");
                  }}
                >
                  <Link onClick={closeSideBarHandler} to="/signup">
                    회원가입
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li
                  onMouseEnter={async () => {
                    await preFetchPageBeforeEnter("mypage");
                  }}
                >
                  <Link onClick={closeSideBarHandler} to={"/mypage"}>
                    마이페이지
                  </Link>
                </li>
                <li>
                  <Link onClick={logoutHandler} to={"/"}>
                    로그아웃
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div>
          <ul className="gap-4 text-black flex-column body-1">
            <li
              className="duration-500 text-gray03 hover:text-black"
              onMouseEnter={async () => {
                await preFetchPageBeforeEnter("interior-preview");
              }}
            >
              <Link onClick={closeSideBarHandler} to="/interior-preview">
                인테리어 조합
              </Link>
            </li>
            <li
              className="duration-500 text-gray03 hover:text-black"
              onMouseEnter={async () => {
                await preFetchPageBeforeEnter("eventlist");
              }}
            >
              <Link onClick={closeSideBarHandler} to="/eventlist">
                이벤트
              </Link>
            </li>
            <li className="duration-500 text-gray03 hover:text-black" onMouseEnter={prefetchCommunity}>
              <Link onClick={closeSideBarHandler} to="/community">
                커뮤니티
              </Link>
            </li>

            <li
              className="duration-500 text-gray03 hover:text-black"
              onMouseEnter={async () => {
                await preFetchPageBeforeEnter("inquire");
              }}
            >
              <Link onClick={closeSideBarHandler} to="/inquire">
                1:1문의하기
              </Link>
            </li>
          </ul>
        </div>
      </dialog>
      {isOpen && (
        <div
          onClick={closeSideBarHandler}
          className="fixed z-[9105] top-0 bottom-0 left-0 right-0 w-full h-full bg-[#00000080] backdrop-blur-sm"
        ></div>
      )}
    </>
  );
};

export const Sidebar = React.memo(SidebarMemoization);
