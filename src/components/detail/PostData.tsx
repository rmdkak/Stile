import { useState } from "react";
import { FaRegHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import { STORAGE_URL } from "api/supabase/supabaseClient";
import defaultImg from "assets/defaultImg.jpg";
import defaultImgWebp from "assets/defaultImgWebp.webp";
import { DateConvertor, Modal, ReportForm } from "components";
import { ShowRoom } from "components/service/ShowRoom";
import { useDynamicImport } from "hooks/useDynamicImport";
import { useAuthStore, useModalStore } from "store";
import { preloadImg } from "utils/preloadImg";

export interface PostDataChain {
  content: string;
  created_at: string;
  id: string;
  leftColorCode: string | null;
  leftWallpaperId: string | null;
  postImage: string | null;
  rightColorCode: string | null;
  rightWallpaperId: string | null;
  tileId: string | null;
  title: string;
  userId: string | null;
  POSTLIKES: Array<{
    created_at: string;
    id: string;
    postId: string;
    userId: string[];
  }>;
  USERS: {
    avatar_url: string;
    created_at: string | null;
    email: string;
    id: string;
    idAnswer: string | null;
    idQuestion: string | null;
    name: string;
  } | null;
}

interface Props {
  postData: PostDataChain;
}

export const PostData = ({ postData }: Props) => {
  const navigate = useNavigate();
  const { onOpenModal } = useModalStore((state) => state);
  const [previewModal, setPreviewModal] = useState<boolean>(false);
  const { currentUserId } = useAuthStore();
  const { preFetchPageBeforeEnter } = useDynamicImport();

  const imgSrc: string = `${STORAGE_URL}${postData?.postImage as string}`;
  preloadImg(imgSrc);
  return (
    <>
      <div className="items-center border-b border-black flex-column sm:hidden">
        <p
          className="font-medium text-[32px] hover:cursor-pointer mb-5"
          onMouseEnter={async () => {
            await preFetchPageBeforeEnter("community");
          }}
          onClick={() => {
            navigate("/community");
          }}
        >
          커뮤니티
        </p>
      </div>
      <div className="items-center px-3 py-10 border-b sm:flex-column sm:items-start sm:gap-8 contents-between border-gray06">
        <div className="w-[70%] sm:w-full">
          <label htmlFor="title" className="text-[18px] font-semibold sm:text-[14px]">
            {postData?.title}
          </label>
          <div className="flex items-center mt-[14px] gap-2 text-gray02 text-[14px] sm:text-[12px]">
            <picture>
              <source
                srcSet={postData?.USERS?.avatar_url === "" ? defaultImgWebp : postData?.USERS?.avatar_url}
                type="image/webp"
              />
              <img
                src={postData?.USERS?.avatar_url === "" ? defaultImg : postData?.USERS?.avatar_url}
                alt="userImg"
                className="w-8 h-8 border rounded-full sm:h-6 sm:w-6 border-gray05 object"
              />
            </picture>
            <p>{postData?.USERS !== null ? postData?.USERS.name : null}</p>
            <DateConvertor datetime={postData?.created_at} type="dotDate" />
            <div className="flex items-center gap-1">
              <FaRegHeart />
              <p>좋아요 {postData?.POSTLIKES[0]?.userId?.length}</p>
            </div>
            {currentUserId !== undefined && (
              <button onClick={onOpenModal} className="leading-[14px] hover:border-b border-gray02">
                신고하기
              </button>
            )}

            <Modal title="신고하기">
              <ReportForm currentUserId={currentUserId} postData={postData} />
            </Modal>
          </div>
        </div>
        <div className="relative">
          {postData?.leftWallpaperId !== null && postData?.leftWallpaperId !== undefined && (
            <div
              className="flex gap-3"
              onTouchStart={() => {
                setPreviewModal(true);
              }}
              onMouseEnter={() => {
                setPreviewModal(true);
              }}
              onTouchEnd={() => {
                setPreviewModal(false);
              }}
              onMouseLeave={() => {
                setPreviewModal(false);
              }}
            >
              <div className="items-center gap-2 flex-column">
                <img
                  className="w-16 h-16 border rounded-full sm:w-12 sm:h-12 border-gray05"
                  src={`${STORAGE_URL}/wallpaper/${postData?.leftWallpaperId}`}
                  alt="왼쪽 벽지"
                />
                <p className="sm:text-[12px] text-[14px] text-center">좌측벽지</p>
              </div>
              <div className="items-center gap-2 flex-column">
                <img
                  className="w-16 h-16 border rounded-full sm:w-12 sm:h-12 border-gray05"
                  src={`${STORAGE_URL}/wallpaper/${postData.rightWallpaperId as string}`}
                  alt="오른쪽 벽지"
                />
                <p className="sm:text-[12px] text-[14px] text-center">우측벽지</p>
              </div>
              <div className="items-center gap-2 flex-column">
                <img
                  className="w-16 h-16 border rounded-full sm:w-12 sm:h-12 border-gray05"
                  src={`${STORAGE_URL}/tile/${postData.tileId as string}`}
                  alt="바닥재"
                />
                <p className="sm:text-[12px] text-[14px] text-center">바닥재</p>
              </div>
            </div>
          )}
          {postData?.leftColorCode !== null &&
            postData?.leftColorCode !== undefined &&
            postData?.rightColorCode !== null &&
            postData?.rightColorCode !== undefined && (
              <div
                className="flex gap-3"
                onTouchStart={() => {
                  setPreviewModal(true);
                }}
                onMouseEnter={() => {
                  setPreviewModal(true);
                }}
                onTouchEnd={() => {
                  setPreviewModal(false);
                }}
                onMouseLeave={() => {
                  setPreviewModal(false);
                }}
              >
                <div className="items-center gap-2 flex-column">
                  <div
                    className="w-16 h-16 border rounded-full border-gray05 sm:w-12 sm:h-12"
                    style={{
                      backgroundColor: postData.leftColorCode,
                    }}
                  />
                  <p className="sm:text-[12px] text-[14px] text-center">좌측벽지</p>
                </div>
                <div className="items-center gap-2 flex-column">
                  <div
                    className="w-16 h-16 border rounded-full border-gray05 sm:w-12 sm:h-12"
                    style={{
                      backgroundColor: postData.rightColorCode,
                    }}
                  />
                  <p className="sm:text-[12px] text-[14px] text-center">우측벽지</p>
                </div>
                <div className="items-center gap-2 flex-column">
                  <img
                    className="w-16 h-16 border rounded-full border-gray05 sm:w-12 sm:h-12"
                    src={`${STORAGE_URL}/tile/${postData.tileId as string}`}
                    alt="바닥재"
                  />
                  <p className="sm:text-[12px] text-[14px] text-center">바닥재</p>
                </div>
              </div>
            )}
          {previewModal && (
            <div className="absolute top-[110px] right-[-15px] sm:top-[80px] sm:left-[-10px]">
              <ShowRoom
                leftWallpaperBg={postData.leftWallpaperId}
                rightWallpaperBg={postData.rightWallpaperId}
                leftWallpaperPaintBg={postData.leftColorCode}
                rightWallpaperPaintBg={postData.rightColorCode}
                tileBg={postData.tileId}
                page={"detail"}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex-column gap-5 mt-[15px] mb-[50px] px-3">
        {postData?.postImage !== null && postData?.postImage !== undefined && (
          <img src={`${STORAGE_URL}${postData?.postImage}`} alt="postImg" className="w-[500px]" />
        )}
        <pre className="w-full break-words whitespace-pre-wrap ">{postData?.content}</pre>
      </div>
    </>
  );
};
