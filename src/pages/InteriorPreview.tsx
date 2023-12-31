import { useEffect, useState, useCallback } from "react";
import { BsCalculator } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import { STORAGE_URL } from "api/supabase/supabaseClient";
import calcArrow from "assets/svgs/calcArrow.svg";
import share from "assets/svgs/icon_share.svg";
import { GetColor, InteriorSection, Modal, Preview, Share } from "components";
import { CoachMark } from "components/service/coachMark/CoachMark";
import ResourcesCalculator from "components/service/ResourcesCalculator";
import { useBookmark } from "hooks/useBookmark";
import { useBookmarkQuery } from "hooks/useBookmarkQuery";
import { useDynamicImport } from "hooks/useDynamicImport";
import { useInteriorPreview } from "hooks/useInteriorPreview";
import { useMovePage } from "hooks/useMovePage";
import { useModalStore, useServiceStore } from "store";
import { useCoachMarkStore } from "store/useCoachMarkStore";
import { useFurniture } from "store/useFurniture";
import { type FetchItemBookmark } from "types/service";

const InteriorPreview = () => {
  const { setCurrentPathname } = useMovePage();
  setCurrentPathname();
  const navigate = useNavigate();
  const [leftWallPaperBg, setLeftWallPaperBg] = useState<string>("");
  const [RightWallPaperBg, setRightWallPaperBg] = useState<string>("");
  const [openShareModal, setOpenShareModal] = useState<boolean>(false);
  const [isItemBookmarkedData, setIsItemBookmarkedData] = useState<FetchItemBookmark>();
  const [tileBg, setTileBg] = useState<string>("");

  const { onOpenModal } = useModalStore((state) => state);
  const { wallPaper, tile, wallpaperPaint, resetWallPaper, resetWallpaperPaint, resetTile, resetClickItemBorder } =
    useServiceStore((state) => state);
  const { windowWidth } = useInteriorPreview();
  const { bookmarkResponse } = useBookmarkQuery();
  const { addBookmark, deleteBookmark, recommendDesign } = useBookmark();
  const { resetFurnitureState } = useFurniture();
  const { data: currentBookmarkData } = bookmarkResponse;

  const { preFetchPageBeforeEnter } = useDynamicImport();
  const { isTutorialPass, activeNumber } = useCoachMarkStore();
  const isStepFour = !isTutorialPass && activeNumber === 4;

  const resetState = useCallback(() => {
    resetWallPaper();
    resetWallpaperPaint();
    resetTile();
    resetClickItemBorder();
    resetFurnitureState();
  }, []);

  const isWallPaperPaintSelected = wallpaperPaint.left !== null || wallpaperPaint.right !== null;

  const handleViewportWidth = useCallback(() => {
    if ((windowWidth as number) >= 520) {
      onOpenModal();
    } else {
      navigate("/interior-preview/calculator");
    }
  }, [windowWidth]);

  const bookmarkDeleteHandler = async () => {
    await deleteBookmark();
    setIsItemBookmarkedData(undefined);
  };

  useEffect(() => {
    tile.image !== null ? setTileBg(`${STORAGE_URL}${tile.image}`) : setTileBg("");
    if (isWallPaperPaintSelected) {
      setIsItemBookmarkedData(undefined);
      setRightWallPaperBg(wallpaperPaint.right as string);
      setLeftWallPaperBg(wallpaperPaint.left as string);
    } else {
      setIsItemBookmarkedData(undefined);
      wallPaper.right.image !== null
        ? setRightWallPaperBg(`${STORAGE_URL}${wallPaper.right.image}`)
        : setRightWallPaperBg("");
      wallPaper.left.image !== null
        ? setLeftWallPaperBg(`${STORAGE_URL}${wallPaper.left.image}`)
        : setLeftWallPaperBg("");
    }
  }, [wallPaper, tile, wallpaperPaint]);

  useEffect(() => {
    if (currentBookmarkData === undefined && currentBookmarkData === undefined) return;
    setIsItemBookmarkedData(currentBookmarkData[0]);
  }, [currentBookmarkData, wallPaper.left.id, wallPaper.right.id, tile.id, wallpaperPaint.left, wallpaperPaint.right]);

  useEffect(() => {
    resetState();
    return () => {
      resetState();
    };
  }, []);

  return (
    <div className="mx-auto flex-column max-w-[1280px] min-w-[360px] gap-10 sm:gap-6 sm:w-full">
      {!isTutorialPass && <CoachMark />}
      <h1 className="mt-20 text-3xl font-medium sm:pl-6 sm:mt-6 sm:text-[20px]">인테리어 조합</h1>
      <div className="flex-wrap gap-40 flex-column">
        {/* 벽지/ 타일 비교 박스 */}
        <div className="flex w-full gap-20 mb-20 sm:flex-wrap md:flex-wrap lg:flex-wrap">
          {/* 왼쪽 인터렉션 박스 */}
          <Preview leftWallPaperBg={leftWallPaperBg} RightWallPaperBg={RightWallPaperBg} tileBg={tileBg} />
          <div
            className={`flex-column w-[600px] gap-10 sm:w-full md:w-full lg:w-full ${
              !isTutorialPass ? "relative" : ""
            }`}
          >
            {!isTutorialPass && !isStepFour && (
              <div className="absolute -inset-6 outline-dashed outline-point outline-2 rounded-xl z-[9300]">
                <div className="w-full h-full bg-white opacity-20" />
              </div>
            )}
            {/* 인테리어 섹션 */}
            <InteriorSection onCheckCustom={true} />
            {/* 컬러 추출 */}
            <GetColor leftWall={leftWallPaperBg} rightWall={RightWallPaperBg} />
            {/* 자재 소모량 계산기 */}
            <div className="box-border flex mb-6 sm:px-6 md:px-6 lg:px-6">
              <label className="flex hover:cursor-pointer text-gray02" htmlFor="calc">
                <BsCalculator className="mr-1 translate-y-1 fill-gray02" />
                <span>자재 소모량 계산기</span>
              </label>
              <button
                className="h-6 ml-2"
                onMouseEnter={async () => {
                  await preFetchPageBeforeEnter("resourcesCalculator");
                }}
                id="calc"
                onClick={handleViewportWidth}
              >
                <img src={calcArrow} alt="오른쪽 화살표 이미지" />
              </button>
              <Modal title="자재 소모량 계산기">
                <ResourcesCalculator />
              </Modal>
            </div>
            <div className="box-border flex gap-4 mt-6 sm:px-6">
              {isItemBookmarkedData !== undefined ? (
                <button
                  onClick={bookmarkDeleteHandler}
                  className="flex flex-auto px-6 py-[18px] contents-center rounded-xl gray-outline-button active:bg-yellow-200"
                >
                  삭제하기
                </button>
              ) : (
                <button
                  onClick={addBookmark}
                  className="flex-auto px-6 py-[18px] rounded-xl point-button active:bg-yellow-200"
                >
                  저장하기
                </button>
              )}
              <button
                onClick={recommendDesign}
                className="flex-auto px-6 py-[18px] border rounded-xl border-gray05 outline-button-hover active:bg-yellow-50"
              >
                추천하기
              </button>
              <button
                onClick={() => {
                  setOpenShareModal(true);
                }}
                className="w-[64px]  rounded-xl border border-gray05 outline-button-hover active:bg-yellow-50"
              >
                <img src={share} alt="공유하기 이미지" className="mx-auto drag-none" />
              </button>
              {openShareModal && <Share setOpenShareModal={setOpenShareModal} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteriorPreview;
