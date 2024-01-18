
/**
 * FullPageLoader component that displays a loading spinner at the center of the page.
 * @returns {JSX.Element} Loading spinner centered on the page.
 */
const FullPageLoader = () => {
  return (
    <>
      <div className="h-full flex items-center justify-center min-h-[100vh]">
        <span className="loader"></span>
      </div>
    </>
  );
};
export default FullPageLoader;
