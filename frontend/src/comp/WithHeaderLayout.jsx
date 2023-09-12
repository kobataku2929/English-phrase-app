import Header from "./Header";
import SecondHeader from "./SecondHeader";
import { Outlet } from "react-router-dom";

const WithHeaderLayout = () => (
  <div className="App">
    <Header />
    <SecondHeader />
    <Outlet /> {/* これにより、ネストされたルートがレンダリングされます */}
  </div>
);

export default WithHeaderLayout;
