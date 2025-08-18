import Typewriter from "../Typewriter";

const MessageBox = ({ text }: { text: string }) => {
  return (
    <div className="min-h-[92px] rounded-xl relative border-x-8 border-y-6 border-[#DE4340] bg-[#6BA2A5] [background-clip:padding-box] px-6 py-3 [&_*]:text-white">
      <Typewriter key={text} text={text} />
      <img
        src="/svg/triangle-white-down.svg"
        alt="Next"
        className="absolute bottom-2 right-4 w-3 h-3 animate-bounce"
      />
    </div>
  );
};

export default MessageBox;
