import { useState, type ChangeEvent, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { changeMetaData, uploadImage } from "api/supabase";
import { useAuth } from "hooks";
import { useAuthStore } from "store";

import { BUTTON_STYLE, type ICommonProps, INPUT_STYLE } from "../MyInfo";

const STORAGE_URL = process.env.REACT_APP_SUPABASE_STORAGE_URL as string;

interface MetaDataInput {
  name: string;
  phone: string;
}

export const MetaDataForm = ({ initialState, patchIsOpen, setPatchIsOpen, currentUser }: ICommonProps) => {
  const [imgFile, setImgFile] = useState<File>();
  const { setPreviewProfileUrl } = useAuthStore();
  const { patchUserMutation } = useAuth();
  const { register, handleSubmit } = useForm<MetaDataInput>();

  // 유저 업로드 파일 미리보기
  useEffect(() => {
    if (imgFile !== undefined) {
      setPreviewProfileUrl(URL.createObjectURL(imgFile));
    }
  }, [imgFile]);

  // 프로필 이미지 onChange
  const onChangeAddFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    setImgFile(event.target.files[0]);
  };

  const onsubmit: SubmitHandler<MetaDataInput> = async (data) => {
    if (currentUser === undefined) return;
    const { id: userId } = currentUser;
    const profileImg = `${STORAGE_URL}/profileImg/${userId}`;
    if (imgFile !== undefined) {
      try {
        await uploadImage(imgFile, userId);
      } catch (error) {
        console.error(error);
      }
    }

    const { phone, name } = data;
    await changeMetaData({ phone, avatar_url: profileImg, name });
    patchUserMutation.mutate({ inputValue: { name, phone, avatar_url: profileImg }, userId });
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)} className="flex gap-4">
      <div className="flex flex-col w-full gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={onChangeAddFile}
          disabled={!patchIsOpen.metaData}
          className={INPUT_STYLE}
        />
        <input
          id={"name"}
          placeholder={"닉네임"}
          disabled={!patchIsOpen.metaData}
          defaultValue={currentUser?.name}
          className={INPUT_STYLE}
          {...register("name", {
            required: "닉네임은 필수 입력 사항입니다.",
            minLength: { value: 2, message: "닉네임이 너무 짧습니다." },
            maxLength: { value: 10, message: "닉네임이 너무 깁니다." },
          })}
        />
        <input
          id={"phone"}
          placeholder={"휴대전화"}
          disabled={!patchIsOpen.metaData}
          defaultValue={currentUser?.phone}
          className={INPUT_STYLE}
          {...register("phone", {
            required: "휴대전화는 필수 입력 사항입니다.",
            minLength: { value: 10, message: "휴대전화 형식이 올바르지 않습니다." },
            maxLength: { value: 11, message: "휴대전화 형식이 올바르지 않습니다." },
          })}
        />
      </div>
      {patchIsOpen.metaData ? (
        <div className="relative flex w-[70px]">
          <button
            type="button"
            className={BUTTON_STYLE}
            onClick={async () => {
              setPatchIsOpen({ ...initialState, metaData: false });
              setPreviewProfileUrl("");
            }}
          >
            수정
          </button>
          <button
            type="button"
            onClick={() => {
              setPatchIsOpen({ ...initialState, metaData: false });
              setPreviewProfileUrl("");
            }}
            className="absolute w-[70px] text-white bg-red-500 disabled:bg-[#bbb]"
          >
            x
          </button>
        </div>
      ) : (
        <div className="flex w-[70px]">
          <button
            type="button"
            onClick={() => {
              setPatchIsOpen({ ...initialState, metaData: true });
            }}
            className={BUTTON_STYLE}
          >
            변경
          </button>
        </div>
      )}
    </form>
  );
};
