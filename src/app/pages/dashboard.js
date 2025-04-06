import Carousel from "../components/carousel";
import Purchase from "../components/purchase";
import ShapeButton from "../components/ShapeButton";

export default function Dashboard() {
  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden">
      <div className="mx-4 mb-4">
        <Carousel />
      </div>

      <div className="flex-1 mx-4 overflow-y-auto bg-white rounded-t-lg shadow-inner p-4">
        <Purchase />
      </div>

      <ShapeButton />
    </div>
  );
}