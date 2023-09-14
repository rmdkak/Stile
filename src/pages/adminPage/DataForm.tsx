import { useState } from "react";
import toast from "react-simple-toasts";
import uuid from "react-uuid";

import { addTileData, addWallpaperData, uploadTileImageHandler, uploadWallpaperImageHandler } from "api/supabase/admin";
import { Select } from "components";

const DataForm = () => {
  const [newImg, setNewImg] = useState<Blob | null>();
  const [selectType, setSelectType] = useState<string | undefined>();
  const [selectTexture, setSelectTexture] = useState<string | undefined>();

  const UUID = uuid();

  const uploadImgHandler = async () => {
    if (newImg === null || newImg === undefined) {
      toast("파일을 선택해주세요.", { theme: "failure", zIndex: 9999 });
      return;
    }
    if (selectType === undefined || selectTexture === undefined) {
      toast("타입, 텍스쳐를 선택해주세요.", { theme: "failure", zIndex: 9999 });
      return;
    }

    const imgData = {
      category: [],
      id: UUID,
      image: `/${selectType}/${UUID}`,
      texture: selectTexture,
    };

    if (selectType === "tile") {
      try {
        await uploadTileImageHandler({ UUID, postImgFile: newImg });
        await addTileData(imgData);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        await uploadWallpaperImageHandler({ UUID, postImgFile: newImg });
        await addWallpaperData(imgData);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <form className="items-start w-full flex-column">
        <div className="flex w-full py-[17px] gap-10 border-y border-gray06">
          <label htmlFor="uploadImg" className="text-sm text-black w-[70px]">
            사진 업로드
          </label>
          <input
            id="uploadImg"
            accept="image/png, image/jpeg, image/gif, image/webp"
            type="file"
            required
            onChange={(e) => {
              if (e.target.files !== null) {
                setNewImg(e.target.files[0]);
              }
            }}
            className="text-sm"
          />
        </div>
        <div className="flex w-full gap-10 py-[17px] items-center">
          <label className="text-sm text-black w-[70px]">타입 선택</label>
          <div className="flex w-[150px]">
            <Select
              option={["tile", "wallpaper"]}
              selectedValue={selectType}
              setSelectedValue={setSelectType}
              selfEnterOption={false}
              placeholder="타입 선택"
            ></Select>
          </div>
          <label className="text-sm text-black w-[70px]">텍스쳐 선택</label>
          <div className="flex w-[150px]">
            <Select
              option={selectType !== "tile" ? ["장판", "마루", "포세린", "데코타일"] : ["벽지", "타일", "포세린"]}
              selectedValue={selectTexture}
              setSelectedValue={setSelectTexture}
              selfEnterOption={false}
              placeholder="텍스처 선택"
            ></Select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-point w-[160px] h-[48px] rounded-[8px] ml-auto mt-5"
          onClick={uploadImgHandler}
        >
          업로드
        </button>
      </form>
    </>
  );
};
export default DataForm;
