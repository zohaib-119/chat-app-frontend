const Loading = ({text}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-blue-50">
      <p className="text-blue-500 text-lg font-semibold">{text}</p>
    </div>
  );
};

export default Loading;
