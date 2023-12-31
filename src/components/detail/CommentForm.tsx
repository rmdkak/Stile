import { useState } from "react";
import { AiOutlineCamera, AiFillCloseCircle } from "react-icons/ai";
import { useParams } from "react-router-dom";
import toast from "react-simple-toasts";
import uuid from "react-uuid";

import { saveCommentImageHandler } from "api/supabase/commentData";
import { useCommentsQuery } from "hooks/useCommentsQuery";
import { useImageResize } from "hooks/useImageResize";
import { useAuthStore } from "store";

const textAreaMaxLength = 500;
interface CommentFormProps {
  kind: "reply" | "comment";
  commentId: string;
  setOpenReply: React.Dispatch<React.SetStateAction<string | null>>;
}

export const CommentForm = ({ kind, commentId, setOpenReply }: CommentFormProps) => {
  const { resizePixelHandler, imageSizeSaveHandler, resizeFile, imageFile, setImageFile } = useImageResize();
  const { currentSession, currentUserId } = useAuthStore();
  const { createCommentMutation, createReplyMutation } = useCommentsQuery();
  const [content, setContent] = useState<string>("");

  const { id: postId } = useParams();
  const commentStatus = kind === "comment";
  const replyStatus = kind === "reply";
  const placeHolder = commentStatus ? "댓글을 남겨보세요." : "답글을 남겨보세요.";

  const handleTextAreaChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    if (value.length <= textAreaMaxLength) {
      setContent(value);
    } else {
      toast(`글자 수 제한(${textAreaMaxLength}자)을 초과했습니다.`, { theme: "failure", zIndex: 9999 });
    }
  };

  const autoResizeTextArea = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  const createCommentHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (content === "") {
      toast("댓글은 1글자 이상 입력해주세요.", { theme: "failure", zIndex: 9999 });
      return;
    }

    const userId = currentUserId;
    const id = uuid();
    const commentImg = imageFile === null ? null : `/commentImg/${id}`;

    if (postId === undefined) return;
    if (userId === undefined) return;

    try {
      if (imageFile !== null) {
        const resizePixel = await resizePixelHandler(600);
        const resizeImageFile = await resizeFile(imageFile, resizePixel);
        if (resizeImageFile === undefined) return;
        await saveCommentImageHandler({ id, resizeImageFile });
      }
      if (commentStatus) createCommentMutation.mutate({ id, userId, content, postId, commentImg });
      if (replyStatus) createReplyMutation.mutate({ userId, content, commentId });
    } catch (error) {
      console.error("error", error);
    }
    setContent("");
    setImageFile(null);
    setOpenReply(null);
  };

  return (
    <div className="w-full px-6 py-[20px] my-[30px] border-2 rounded-lg border-gray06">
      <div className="contents-between">
        <p className="font-semibold text-[20px] sm:text-[14px]">
          {currentSession !== null
            ? currentSession?.user.user_metadata.name
            : "댓글 기능을 이용하시려면 로그인 해주세요."}
        </p>
        <p className="flex items-end text-gray03 sm:text-[14px]">
          {content.length}/{textAreaMaxLength}자
        </p>
      </div>
      <form onSubmit={createCommentHandler}>
        <textarea
          value={content}
          onChange={async (e) => {
            await handleTextAreaChange(e);
            autoResizeTextArea(e.target);
          }}
          placeholder={currentSession !== null ? placeHolder : ""}
          className="w-full sm:text-[14px] text-[20px] py-[12px] resize-none focus:outline-none"
          disabled={currentSession === null}
        />
        {/* 대댓글 취소 버튼 */}
        <div className="flex items-end justify-end gap-5">
          {replyStatus && (
            <button
              onClick={() => {
                setOpenReply(null);
              }}
              type="button"
              className="h-[48px] w-[120px] sm:h-[40px] sm:w-[80px] border border-gray03 rounded-[8px] sm:text-[14px]"
            >
              취소하기
            </button>
          )}

          {imageFile === null && commentStatus && (
            <label htmlFor="imageInput">
              <AiOutlineCamera className="text-gray-400 cursor-pointer text-[40px] sm:text-[24px]" />
              <input
                type="file"
                accept="image/png, image/jpeg, image/gif"
                id="imageInput"
                className="hidden"
                onChange={(e) => {
                  imageSizeSaveHandler(e);
                }}
              />
            </label>
          )}
          {imageFile !== null && commentStatus && (
            <div className="relative">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="미리보기"
                className="object-cover cursor-pointer w-[80px] h-[80px]"
                onClick={() => {
                  setImageFile(null);
                }}
              />
              <div className="absolute bottom-[60px] left-[85px]">
                <AiFillCloseCircle
                  className="text-[25px] text-gray03 cursor-pointer"
                  onClick={() => {
                    setImageFile(null);
                  }}
                />
              </div>
            </div>
          )}
          <button
            type="submit"
            className="h-[48px] w-[120px] sm:h-[40px] sm:w-[80px] bg-point rounded-[8px] sm:text-[14px]"
          >
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
};
