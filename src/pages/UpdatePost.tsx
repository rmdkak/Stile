import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import uuid from "react-uuid";

import { STORAGE_URL, deletePostImage, savePostImageHandler } from "api/supabase";
import { Button, InteriorSection, InvalidText, Modal, useDialog } from "components";
import { usePostsQuery } from "hooks";
import { useModalStore, useServiceStore } from "store";

interface Inputs {
  title: string;
  content: string;
  file: FileList;
}

export const UpdatePost = () => {
  const { Alert } = useDialog();
  const navigate = useNavigate();
  const { fetchDetailMutation, updatePostMutation } = usePostsQuery();
  const { data: postData } = fetchDetailMutation;

  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Inputs>({ mode: "all" });
  const titleValue = watch("title") ?? 0;
  const contentValue = watch("content") ?? 0;
  const { onOpenModal, onCloseModal } = useModalStore();
  const { wallPaper, tile, wallpaperPaint, resetWallPaper, resetWallpaperPaint, resetTile } = useServiceStore();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (postData === undefined) return;
    const postImgFile = data.file[0];
    const fileUuid = uuid();
    const postImage = postImgFile === undefined ? postData.postImage : `/postImg/${fileUuid}`;

    if (wallPaper.left.id !== null && wallpaperPaint.right !== null) {
      await Alert("벽지와 페인트는 동시 선택할 수 없습니다.");
      return;
    }

    if (wallPaper.right.id !== null && wallpaperPaint.left !== null) {
      await Alert("벽지와 페인트는 동시 선택할 수 없습니다.");
      return;
    }

    if (wallPaper.left.id === null && wallPaper.right.id !== null) {
      await Alert("왼쪽 벽지를 선택해 주세요.");
      return;
    }

    if (wallPaper.left.id !== null && wallPaper.right.id === null) {
      await Alert("오른쪽 벽지를 선택해 주세요.");
      return;
    }

    if (wallpaperPaint.left === null && wallpaperPaint.right !== null) {
      await Alert("왼쪽 페인트를 선택해 주세요.");
      return;
    }

    if (wallpaperPaint.left !== null && wallpaperPaint.right === null) {
      await Alert("오른쪽 페인트를 선택해 주세요.");
      return;
    }

    const updateData = {
      id: postData.id,
      title: data.title,
      content: data.content,
      postImage,
      tileId: tile.id === null ? postData?.tileId : tile.id,
      leftWallpaperId:
        wallpaperPaint.left !== null
          ? null
          : wallPaper.left.id === null
          ? postData?.leftWallpaperId
          : wallPaper.left.id,
      rightWallpaperId:
        wallpaperPaint.right !== null
          ? null
          : wallPaper.right.id === null
          ? postData?.rightWallpaperId
          : wallPaper.right.id,
      leftColorCode:
        wallPaper.left.id !== null
          ? null
          : wallpaperPaint.left === null
          ? postData?.leftColorCode
          : wallpaperPaint.left,
      rightColorCode:
        wallPaper.right.id !== null
          ? null
          : wallpaperPaint.right === null
          ? postData?.rightColorCode
          : wallpaperPaint.right,
    };

    try {
      if (postData.postImage !== null) {
        await deletePostImage(postData.postImage);
      }
      if (postImgFile !== null) {
        await savePostImageHandler({ UUID: fileUuid, postImgFile });
      }
      updatePostMutation.mutate(updateData);
      navigate("/community");
    } catch (error) {
      console.error("error :", error);
    }

    resetWallPaper();
    resetWallpaperPaint();
    resetTile();
  };

  useEffect(() => {
    if (postData === undefined) return;
    setValue("title", postData.title);
    setValue("content", postData.content);
  }, []);
  if (postData === undefined) return <p>데이터를 불러올 수 없습니다.</p>;
  return (
    <div className="w-[1280px] mx-auto mt-10">
      <div className="items-center flex-column">
        <p className="font-medium text-[32px]">커뮤니티</p>
        <div className="w-full mt-10 border-b-2 border-gray01"></div>
      </div>
      <form className="flex-column" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full border-b border-gray06 h-[72px] items-center">
          <label htmlFor="title" className="w-10 text-[18px] font-normal">
            제목
          </label>
          <div className="flex items-center w-full border border-gray05">
            <input
              className="w-full text-[18px] px-3 py-2 focus:outline-none"
              {...register("title", {
                required: "제목을 입력해주세요",
                maxLength: { value: 100, message: "제목은 최대 100자 까지만 입력할 수 있습니다!" },
              })}
            />
            <p
              className={`${
                errors.title?.type === "maxLength" ? "text-error" : "text-gray03"
              } flex-none text-base w-[160px]`}
            >
              제목 글자 수: {titleValue.length ?? 0} / 100
            </p>
          </div>
        </div>
        <div className="relative flex items-center justify-end my-3">
          <InvalidText className={"text-base "} errorsMessage={errors.title?.message} />
          {/* 왼쪽 벽지 */}
          {wallpaperPaint.left !== null ? (
            <div
              className="w-10 h-10 rounded-full absolute right-[200px] border border-gray05"
              style={{ backgroundColor: wallpaperPaint.left }}
            />
          ) : wallPaper.left.image !== null ? (
            <img
              src={`${STORAGE_URL}${wallPaper.left.image}`}
              alt="왼쪽벽지"
              className="w-10 h-10 rounded-full absolute right-[200px] border border-gray05"
            />
          ) : postData.leftWallpaperId === null ? (
            <div className="bg-gray06 w-10 h-10 rounded-full absolute right-[200px] border border-gray01" />
          ) : (
            <img
              src={`${STORAGE_URL}/wallpaper/${postData.leftWallpaperId}`}
              alt="왼쪽벽지"
              className="w-10 h-10 rounded-full absolute right-[200px] border border-gray05"
            />
          )}
          {/* 오른쪽 벽지 */}
          {wallpaperPaint.right !== null ? (
            <div
              className="w-10 h-10 rounded-full absolute right-[170px] border border-gray05"
              style={{ backgroundColor: wallpaperPaint.right }}
            />
          ) : wallPaper.right.image !== null ? (
            <img
              src={`${STORAGE_URL}${wallPaper.right.image}`}
              alt="오른쪽벽지"
              className="w-10 h-10 rounded-full absolute right-[170px] border border-gray05"
            />
          ) : postData.rightWallpaperId === null ? (
            <div className="bg-gray06 w-10 h-10 rounded-full absolute right-[170px] border border-gray01" />
          ) : (
            <img
              src={`${STORAGE_URL}/wallpaper/${postData.rightWallpaperId}`}
              alt="오른쪽벽지"
              className="w-10 h-10 rounded-full absolute right-[170px] border border-gray05"
            />
          )}
          {/* 타일 */}
          {tile.image !== null ? (
            <img
              src={`${STORAGE_URL}${tile.image}`}
              alt="바닥재"
              className="w-10 h-10 rounded-full absolute right-[140px] border border-gray05"
            />
          ) : postData.tileId === null ? (
            <div className="bg-gray06 w-10 h-10 rounded-full absolute right-[140px] border border-gray01" />
          ) : (
            <img
              src={`${STORAGE_URL}/tile/${postData.tileId}`}
              alt="바닥재"
              className="w-10 h-10 rounded-full absolute right-[140px] border border-gray05"
            />
          )}
          <button
            type="button"
            onClick={onOpenModal}
            className="text-[13px] w-[130px] h-10 gray-outline-button rounded-lg"
          >
            조합 변경하기
          </button>
        </div>
        <Modal title="인테리어 조합">
          <div className="gap-10 flex-column w-[528px]">
            <InteriorSection />
            <div className="flex justify-end">
              <Button onClick={onCloseModal}>확인</Button>
            </div>
          </div>
        </Modal>
        <textarea
          placeholder="게시물 내용을 입력하세요"
          className="h-[350px] border border-gray06 focus:outline-none p-5 text-[18px] resize-none"
          {...register("content", {
            required: "내용을 입력해주세요.",
            maxLength: { value: 1000, message: "내용은 1000자 이내로 작성해 주세요!" },
          })}
        />
        <div className="mt-2 contents-between">
          <InvalidText className="text-base " errorsMessage={errors.content?.message} />
          <p className={`${errors.content?.type === "maxLength" ? "text-error" : "text-gray-400"} flex-none text-base`}>
            내용 글자 수: {contentValue.length ?? 0} / 1000
          </p>
        </div>
        {previewImg === null ? (
          postData?.postImage === null ? null : (
            <img src={`${STORAGE_URL}${postData?.postImage}`} alt="포스트 이미지" className="object-contain w-80" />
          )
        ) : (
          <img src={previewImg} alt="미리보기 이미지" className="object-contain w-80" />
        )}
        <div className="flex w-full border-y border-gray06 h-[72px] justify-center items-center mt-5">
          <label htmlFor="img" className="w-32 font-normal body-3">
            첨부파일
          </label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className="w-full body-3 focus:outline-none"
            {...register("file", {
              onChange: (event) => {
                setPreviewImg(URL.createObjectURL(event.target.files[0]));
              },
            })}
          />
        </div>
        <div className="my-10 contents-between">
          <button
            type="button"
            className="w-40 h-12 mr-5 border border-gray-300 rounded-lg"
            onClick={() => {
              navigate("/community");
            }}
          >
            커뮤니티 이동
          </button>
          <div>
            <button
              type="button"
              className="w-40 h-12 mr-5 border border-gray-300 rounded-lg"
              onClick={() => {
                navigate(-1);
              }}
            >
              이전으로
            </button>
            <button type="submit" className="bg-point w-[160px] h-12 rounded-lg">
              수정하기
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
