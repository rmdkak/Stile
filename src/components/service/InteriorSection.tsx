import React, { useState, useCallback, useEffect } from "react";

import { supabase } from "api/supabase";
import { useServiceStore } from "store";
import { type Tables } from "types/supabase";

import { tileTextureList, wallPaperTextureList } from "./data";
import { ServiceItem } from "./ServiceItem";
import TextureTitle from "./TextureTitle";

export const InteriorSection = (): JSX.Element => {
  const [wallData, setWallData] = useState<Array<Tables<"WALLPAPER", "Row">>>([]);
  const [taleData, setTaleData] = useState<Array<Tables<"TILE", "Row">>>([]);
  const { checkType, setTypeCheck } = useServiceStore((state) => state);

  /**
   *  서버에서 타일 리스트 데이터, 벽지 리스트 데이터를 가져오는 함수입니다.
   */
  const fetchData = useCallback(async () => {
    try {
      const { data: wallPaper } = await supabase.from("WALLPAPER").select("*");
      const { data: tale } = await supabase.from("TILE").select("*");
      setWallData(wallPaper as Array<Tables<"WALLPAPER", "Row">>);
      setTaleData(tale as Array<Tables<"TILE", "Row">>);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // supabase에서 data정보 가져오기
  useEffect(() => {
    fetchData().catch((error) => error(error));
  }, []);

  /**
   * 
   * @param type 
"매개변수 'type'은 'tile' 또는 'wallPaper'라는 두 가지 중 하나의 값을 받습니다. 이 값은 'onClickTypeSwitch' 함수 내에서 사용되며, 'setTypeCheck' 함수에 전달되어 '|' 연산자를 사용하여 현재 선택된 타입을 갱신합니다."
   */
  const onClickTypeSwitch = (type: "tile" | "wallPaper") => {
    setTypeCheck(type);
  };

  return (
    <>
      {/* 인테리어 헤더 */}
      <div className="flex mb-6 h-[35px] text-gray-300 gap-3">
        <span
          className={
            checkType === "wallPaper"
              ? "border-b-2 border-black hover:cursor-pointer text-black"
              : "hover:cursor-pointer"
          }
          onClick={() => {
            onClickTypeSwitch("wallPaper");
          }}
        >
          벽지
        </span>
        |
        <span
          className={
            checkType === "tile" ? "border-b-2 border-black hover:cursor-pointer text-black" : "hover:cursor-pointer"
          }
          onClick={() => {
            onClickTypeSwitch("tile");
          }}
        >
          바닥재
        </span>
        {checkType === "wallPaper" ? (
          <>
            {/* 벽지 종류 목록 */}
            <TextureTitle data={wallPaperTextureList} />
          </>
        ) : checkType === "tile" ? (
          <>
            {/* 타일 종류 목록 */}
            <TextureTitle data={tileTextureList} />
          </>
        ) : (
          <></>
        )}
      </div>

      {/* 인테리어 바디 */}
      <div className="h-[392px] mb-10 overflow-auto">
        <ul className="flex flex-wrap w-full gap-x-4 gap-y-4">
          {checkType === "wallPaper" ? (
            <ServiceItem type={checkType} data={wallData} />
          ) : (
            // sift
            <ServiceItem type={checkType} data={taleData} />
          )}

          {/* <li className="bg-gray-200 w-[120px] h-[120px]"></li> */}
        </ul>
      </div>
    </>
  );
};