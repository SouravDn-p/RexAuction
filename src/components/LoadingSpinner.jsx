const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-transparent">
      <div className="relative w-[70px] h-[70px] md:w-[100px] md:h-[100px]">
        {/* Ring 1 */}
        <div
          className="absolute w-full h-full border-b-[5px] border-pink-500 rounded-full"
          style={{
            animation: "rotate1 2s linear infinite",
          }}
        ></div>

        {/* Ring 2 */}
        <div
          className="absolute w-full h-full border-r-[5px] border-cyan-400 rounded-full"
          style={{
            animation: "rotate2 2s linear infinite",
          }}
        ></div>

        {/* Ring 3 */}
        <div
          className="absolute w-full h-full border-t-[5px] border-green-500 rounded-full"
          style={{
            animation: "rotate3 2s linear infinite",
          }}
        ></div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
            @keyframes rotate1 {
              0% {
                transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
              }
              100% {
                transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
              }
            }
  
            @keyframes rotate2 {
              0% {
                transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
              }
              100% {
                transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
              }
            }
  
            @keyframes rotate3 {
              0% {
                transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
              }
              100% {
                transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
              }
            }
          `}
      </style>
    </div>
  );
};

export default LoadingSpinner;
