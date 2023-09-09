import { Link } from "react-router-dom";

import blog from "assets/footerIcon/blogIcon.svg";
import github from "assets/footerIcon/githubIcon.svg";
import notion from "assets/footerIcon/notionIcon.svg";

export const Footer = () => {
  return (
    <>
      <footer className="flex-column bg-gray08 ">
        {/* footHead */}
        <div className="w-[1280px] mx-auto my-10">
          <div className="contents-between mb-[50px] border-b border-[#d9d9d9] pb-6 ">
            <h2 className=" item text-[2rem] leading-none">
              <Link to="/" className="font-title">
                STILE
              </Link>
            </h2>
            <div>
              <ul className="flex self-center justify-end">
                <li>
                  <a className="mr-[8px] block w-6 h-6 self-start" href="#외부경로" target="_blink">
                    <img className="block w-6 h-6" src={github} alt="blog ci" />
                  </a>
                </li>
                <li>
                  <a className="mr-[8px] block w-6 h-6" href="#외부경로" target="_blink">
                    <img className="block w-6 h-6" src={blog} alt="github ci" />
                  </a>
                </li>
                <li>
                  <a className="block w-6 h-6" href="외부경로" target="_blink">
                    <img className="block w-6 h-6" src={notion} alt="notion ci" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* footCopy */}
          <div>
            <div className="flex justify-between mb-3">
              <ul className="flex items-center first-line:">
                <li className="mr-[18px] text-[#888] text-xs">이용약관</li>
                <li className="text-[13px]">개인정보 처리방침</li>
              </ul>
              <button className="px-6 py-2 text-xs text-[#888] border rounded-lg border-gray05">1:1문의하기</button>
            </div>
          </div>
          <p className="text-[#888] mb-10 text-[12px]">COPYRIGHT(C) STILE ALL RIGHT RESERVED</p>
        </div>
      </footer>
    </>
  );
};
