import Header from "./Header";
import MenuBar from "./MenuBar";
import Footer from "./Footer";

import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

const WithHeaderLayout = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 639 });

  return (
    <div className="App">
      {isSmallScreen ? (
        // 画面が小さい場合はモバイル向けの表示
        <div>
          <Header />

          <div className="fixed z-50 bottom-0 left-0 w-full p-2 bg-gray-200 box-border">
            <MenuBar className="sticky" />
          </div>
        </div>
      ) : (
        // 画面が大きい場合はデスクトップ向けの表示

        <div className="flex  ">
          {/* サイドバー */}
          <div className="w-44     ">
            {/* サイドバーのコンテンツ */}
            <MenuBar className=" sticky  " />
          </div>

          {/* メインコンテンツ */}
          <div className="flex-1  ">
            <Outlet />
            <Footer />

            {/* メインコンテンツのコンテンツ */}
          </div>
        </div>
      )}
      {/* これにより、ネストされたルートがレンダリングされます */}
    </div>
  );
};

export default WithHeaderLayout;
