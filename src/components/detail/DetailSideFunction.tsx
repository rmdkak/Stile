import { useEffect, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import fillHeart from "assets/svgs/Heart.svg";
import lineHeart from "assets/svgs/lineheart.svg";
import share from "assets/svgs/share.svg";
import { useDialog } from "components/common";
import { useDynamicImport } from "hooks/useDynamicImport";
import { usePostsLikeQuery } from "hooks/usePostsLikeQuery";
import { usePostsQuery } from "hooks/usePostsQuery";
import { throttle } from "lodash";
import { useAuthStore } from "store";

import { type PostDataChain } from "./PostData";

interface Props {
  paramsId: string | undefined;
  postData: PostDataChain | undefined;
}

interface ModalProps {
  setOpenShareModal: (value: React.SetStateAction<boolean>) => void;
}

export const DetailSideFunction = ({ paramsId, postData }: Props) => {
  const navigate = useNavigate();
  const { currentUserId } = useAuthStore();
  const [isHaveBookmark, setIsHaveBookmark] = useState(false);
  const { Confirm } = useDialog();
  const { postLikeResponse, addLikeMutation, deleteLikeMutation } = usePostsLikeQuery();
  const { data: currentBookmarkData } = postLikeResponse;
  const { fetchPostsMutation } = usePostsQuery();
  const { preFetchPageBeforeEnter } = useDynamicImport();

  const { data: postList } = fetchPostsMutation;

  const findCurrentIdx: number | undefined = postList?.findIndex((item) => item.id === paramsId);

  let prevPage = "";
  let nextPage = "";

  if (postList !== undefined) {
    prevPage = postList[(findCurrentIdx as number) - 1]?.id;
    nextPage = postList[(findCurrentIdx as number) + 1]?.id;
  }

  useEffect(() => {
    if (currentUserId !== undefined && currentBookmarkData !== undefined) {
      const userId = currentUserId;
      const bookmarkUserId = currentBookmarkData.userId;

      if (userId !== undefined && bookmarkUserId !== undefined) {
        setIsHaveBookmark(bookmarkUserId.includes(userId));
      }
    }
  }, [currentUserId, currentBookmarkData]);

  const addLike = throttle(async () => {
    if (currentUserId === undefined) {
      const goToLogin = await Confirm(
        <>
          <p>좋아요 기능은 로그인 후 이용가능합니다.</p>
          <p>로그인 하시겠습니까?</p>
        </>,
      );
      if (goToLogin) navigate("/login");
      return;
    }
    if (
      paramsId === undefined ||
      currentBookmarkData === undefined ||
      postData?.POSTLIKES[0]?.userId?.length === undefined
    )
      return;
    const addIds = [...currentBookmarkData.userId, currentUserId];
    addLikeMutation.mutate({ postId: paramsId, userId: addIds });
  }, 500);

  const deleteLike = throttle(async () => {
    if (currentUserId === undefined) {
      const goToLogin = await Confirm(
        <>
          <p>좋아요 기능은 로그인 후 이용가능합니다.</p>
          <p>로그인 하시겠습니까?</p>
        </>,
      );
      if (goToLogin) navigate("/login");
      return;
    }
    if (
      paramsId === undefined ||
      currentBookmarkData === undefined ||
      postData?.POSTLIKES[0]?.userId?.length === undefined
    )
      return;
    const deletedIds = currentBookmarkData.userId.filter((id) => id !== currentUserId);
    deleteLikeMutation.mutate({ postId: paramsId, userId: deletedIds });
  }, 500);

  const movePostPageHandler = async () => {
    if (currentUserId === undefined) {
      const confirmCheck = await Confirm(
        <div>
          <div className="flex text-lg justify-center mb-[10px]">
            <p className="font-medium mr-[10px]">STILE</p>
            <p>회원 이신가요?</p>
          </div>
          <div className="text-sm text-gray02">
            <p>해당 서비스는 로그인 후 진행 가능합니다.</p>
            <p>로그인 혹은 회원가입 해주세요.</p>
          </div>
        </div>,
      );
      if (confirmCheck) navigate("/login");
      return;
    }
    navigate("/post");
  };

  const PrevNextPostList = () => {
    return (
      <div className="my-20 border-t flex-column border-gray06 ">
        {prevPage !== undefined && (
          <div
            className="flex gap-[10px] items-center py-6 px-3 border-b border-gray06 hover:cursor-pointer"
            onMouseEnter={async () => {
              await preFetchPageBeforeEnter("detail");
            }}
            onClick={() => {
              navigate(`/detail/${prevPage}`);
            }}
          >
            <SlArrowUp className="fill-gray02" />
            <label className="text-gray02 sm:text-[12px] min-w-[80px]">이전글 보기</label>
            <span className="h-2 border border-gray08"></span>
            <p className="line-clamp-1 sm:text-[12px] sm:w-full">
              {postList !== undefined ? postList[(findCurrentIdx as number) - 1].title : ""}
            </p>
          </div>
        )}
        {nextPage !== undefined && (
          <div
            className="flex gap-[10px] items-center py-6 px-3 border-b border-gray06 hover:cursor-pointer "
            onMouseEnter={async () => {
              await preFetchPageBeforeEnter("detail");
            }}
            onClick={() => {
              navigate(`/detail/${nextPage}`);
            }}
          >
            <SlArrowDown className="fill-gray02" />
            <p className="text-gray02 sm:text-[12px] min-w-[80px]">다음글 보기</p>
            <span className="h-2 border border-gray08"></span>
            <p className="line-clamp-1 sm:text-[12px] sm:w-full">
              {postList !== undefined ? postList[(findCurrentIdx as number) + 1].title : ""}
            </p>
          </div>
        )}
      </div>
    );
  };

  const DetailSideBar = ({ setOpenShareModal }: ModalProps) => {
    return (
      <div className="fixed gap-4 bottom-[20%] right-[10%] inline-flex flex-col">
        <button className="w-12 h-12 rounded-full bg-point sm:w-8 sm:h-8" onClick={movePostPageHandler}>
          <BsPencilSquare className="w-5 h-5 mx-auto fill-gray01 sm:w-4 sm:h-4" />
        </button>
        {isHaveBookmark ? (
          <button onClick={deleteLike} className="w-12 h-12 bg-white border rounded-full border-gray06 sm:w-8 sm:h-8">
            <img src={fillHeart} alt="좋아요 취소" className="mx-auto text-point sm:w-4 sm:h-4" />
          </button>
        ) : (
          <button onClick={addLike} className="w-12 h-12 bg-white border rounded-full border-gray06 sm:w-8 sm:h-8">
            <img src={lineHeart} alt="좋아요" className="mx-auto text-gray01 sm:w-4 sm:h-4" />
          </button>
        )}
        <button
          onClick={() => {
            setOpenShareModal(true);
          }}
          className="w-12 h-12 bg-white border rounded-full border-gray06 sm:w-8 sm:h-8"
        >
          <img src={share} alt="공유하기" className="mx-auto fill-gray01 sm:w-4 sm:h-4" />
        </button>
      </div>
    );
  };
  return { PrevNextPostList, DetailSideBar };
};
