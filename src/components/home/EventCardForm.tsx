import { useNavigate } from "react-router-dom";

import { STORAGE_URL } from "api/supabase/supabaseClient";
import { useAdminQuery } from "hooks/useAdminQuery";
import { useDynamicImport } from "hooks/useDynamicImport";
import { preloadImgs } from "utils/imgPreload";

export const EventCardForm = () => {
  const navigate = useNavigate();

  const { fetchEventMutation } = useAdminQuery();
  const { data: eventData } = fetchEventMutation;
  const { preFetchPageBeforeEnter } = useDynamicImport();
  const filterEventData = eventData?.slice(0, 2);
  const imgArray = filterEventData?.map((el) => `${STORAGE_URL}${el.eventImg}`);

  if (imgArray !== undefined) preloadImgs(imgArray);

  if (filterEventData?.length === 0) {
    return <div className="w-full h-[488px] text-center sm:h-[295px]">현재 진행중인 이벤트가 없습니다.</div>;
  } else if (filterEventData?.length === 1) {
    return (
      <>
        {filterEventData?.map((data) => (
          <div
            key={data.id}
            className="w-full gap-6 flex-column sm:mx-6 sm:gap-4"
            onMouseEnter={async () => {
              await preFetchPageBeforeEnter("event");
            }}
            onClick={() => {
              navigate(`/event/${data.id}`);
            }}
          >
            <img
              src={`${STORAGE_URL}${data.eventImg}`}
              alt="eventImg"
              className="max-h-[400px] rounded-xl object-contain hover:cursor-pointer sm:min-w-[321px] sm:min-h-[200px] mr-auto"
            />
            <div className="gap-2 flex-column hover:cursor-pointer">
              <h2 className="text-2xl font-medium line-clamp-2 sm:text-lg">{data.title}</h2>
              <pre className="h-6 overflow-hidden break-words whitespace-pre-wrap text-gray02">{data.content}</pre>
            </div>
          </div>
        ))}
      </>
    );
  } else
    return (
      <>
        {filterEventData?.map((data) => (
          <div
            key={data.id}
            className="w-full gap-6 flex-column sm:mx-6 sm:gap-4 sm:w-[312px]"
            onMouseEnter={async () => {
              await preFetchPageBeforeEnter("event");
            }}
            onClick={() => {
              navigate(`/event/${data.id}`);
            }}
          >
            <img
              src={`${STORAGE_URL}${data.eventImg}`}
              alt="eventImg"
              className="max-h-[400px] rounded-xl object-contain hover:cursor-pointer sm:h-[200px]"
            />
            <div className="gap-2 flex-column hover:cursor-pointer">
              <h2 className="text-2xl font-medium line-clamp-2 sm:text-lg">{data.title}</h2>
              <pre className="h-6 overflow-hidden break-words whitespace-pre-wrap text-gray02">{data.content}</pre>
            </div>
          </div>
        ))}
      </>
    );
};
