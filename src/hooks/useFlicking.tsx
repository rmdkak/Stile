import { useNavigate } from "react-router-dom";

import { STORAGE_URL } from "api/supabase";
import noImage from "assets/no_image.png";
import { type Tables } from "types/supabase";

type postData = Tables<"POSTS", "Row">;

export const useFlicking = () => {
  const navigate = useNavigate();

  const isExistCombination = (post: Tables<"POSTS", "Row">, type: "all" | "interior" | "paint") => {
    switch (type) {
      case "all":
        return (
          (post.tileId !== null && post.leftWallpaperId !== null && post.rightWallpaperId !== null) ||
          (post.tileId !== null && post.leftColorCode !== null && post.rightColorCode !== null)
        );
      case "interior":
        return post.tileId !== null && post.leftWallpaperId !== null && post.rightWallpaperId !== null;
      case "paint":
        return post.leftColorCode !== null && post.rightColorCode !== null;
    }
  };

  const bestPostList = (post: postData) => {
    return (
      <div
        key={post.id}
        className="w-[400px] flex-column mr-10 cursor-pointer"
        onClick={() => {
          navigate(`/detail/${post.id}`);
        }}
      >
        <div>
          <img
            src={post.postImage !== null ? `${STORAGE_URL}${post.postImage}` : noImage}
            alt="postImg"
            className="rounded-[8px] w-full h-[400px] object-cover"
          />
        </div>

        <div className="w-full gap-2 mt-3 flex-column">
          <div className="flex h-12">
            <p className="text-[20px] my-auto font-semibold truncate w-1/2">{post.title}</p>

            {isExistCombination(post, "interior") && (
              <div className="inline-flex w-1/2">
                <img
                  src={`${STORAGE_URL}/wallpaper/${post.leftWallpaperId as string}`}
                  alt="벽지"
                  className="relative w-[48px] h-[48px] left-[76px] rounded-full border border-gray05"
                />
                <img
                  src={`${STORAGE_URL}/wallpaper/${post.rightWallpaperId as string}`}
                  alt="벽지"
                  className="relative w-[48px] h-[48px] left-[66px] rounded-full border border-gray05"
                />
                <img
                  src={`${STORAGE_URL}/tile/${post.tileId as string}`}
                  alt="바닥"
                  className="relative w-[48px] h-[48px] left-[56px] rounded-full border border-gray05"
                />
              </div>
            )}
            {isExistCombination(post, "paint") && post.leftColorCode !== null && post.rightColorCode !== null && (
              <div className="inline-flex w-1/2">
                <div
                  className="relative w-[48px] h-[48px] left-[76px] rounded-full border-gray05"
                  style={{
                    backgroundColor: post.leftColorCode,
                  }}
                />
                <div
                  className="relative w-[48px] h-[48px] left-[66px] rounded-full border-gray05"
                  style={{
                    backgroundColor: post.rightColorCode,
                  }}
                />
                <img
                  src={`${STORAGE_URL}/tile/${post.tileId as string}`}
                  alt="바닥"
                  className="relative w-[48px] h-[48px] left-[56px] rounded-full border-gray05"
                />
              </div>
            )}
          </div>
          <p className="text-[16px] text-gray02 line-clamp-2 h-[46px]">{post.content}</p>
        </div>
      </div>
    );
  };
  return { bestPostList, isExistCombination };
};
