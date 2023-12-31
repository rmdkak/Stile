import type { DataType } from "components/mypage/mypage.type";

interface Props {
  type: DataType;
}

export const SubTitle = ({ type }: Props) => {
  const titleText = (type: DataType) => {
    switch (type) {
      case "myPost":
        return "내가 쓴 글";
      case "myComment":
        return "내가 쓴 댓글";
      case "myBookmark":
        return "북마크";
      case "myLike":
        return "좋아요 누른 글";
      case "myInquiry":
        return "내가 작성한 문의 & 신고 답변";
      case "post":
        return "글 작성하기";
    }
  };
  return (
    <div
      className={`text-[18px] w-full max-w-[1280px] min-w-[312px] pb-3 border-b border-b-black body-1 font-medium mt-6 sm:flex ${
        type === "post" ? "hidden" : ""
      }`}
    >
      <p>{titleText(type)}</p>
    </div>
  );
};
