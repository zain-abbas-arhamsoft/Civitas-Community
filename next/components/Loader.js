/**
 * Loader component to display a simple loading animation.
 * Renders a set of border lines to create a loading effect.
 * Usage:
 * <Loader />
 */
const Loader = () => {
  return (
    <div class="mini-loader inline-block relative w-[20px] h-[20px] ms-3">
      <div className="w-full h-full absolute border-t-2 border-white hover:border-themecolor"></div>
      <div className="w-full h-full absolute border-t-2 border-white hover:border-themecolor"></div>
      <div className="w-full h-full absolute border-t-2 border-white hover:border-themecolor"></div>
      <div className="w-full h-full absolute border-t-2 border-white hover:border-themecolor"></div>
    </div>
  );
};
export default Loader;
