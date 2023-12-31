import { Link } from "react-router-dom";

import { DateConvertor } from "components/common";
import { useDynamicImport } from "hooks/useDynamicImport";
import { type Tables } from "types/supabase";

import { dateStyle, innerBoxStyle, linkStyle, OUTER_BOX_STYLE } from "./preview.style";
import { PreviewEmpty } from "./PreviewEmpty";

interface Props {
  postData: Array<Tables<"POSTS", "Row">> | undefined;
}

export const PreviewPost = ({ postData }: Props) => {
  if (postData === undefined) return <PreviewEmpty />;

  const { preFetchPageBeforeEnter } = useDynamicImport();

  return (
    <ul className={OUTER_BOX_STYLE}>
      {postData.length === 0 ? <PreviewEmpty /> : null}
      {postData.map((post) => {
        return (
          <li key={post.id} className={innerBoxStyle}>
            <Link
              to={`/detail/${post.id}`}
              className={linkStyle}
              onMouseEnter={async () => {
                await preFetchPageBeforeEnter("detail");
              }}
            >
              {post.title}
            </Link>
            <DateConvertor datetime={post.created_at} type={"dotDate"} className={dateStyle} />
          </li>
        );
      })}
    </ul>
  );
};
