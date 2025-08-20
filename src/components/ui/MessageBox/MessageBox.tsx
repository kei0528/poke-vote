import Typewriter from '../Typewriter';

const MessageBox = ({ text, className = '' }: { text: string; className?: string }) => {
  return (
    <div
      className={`relative min-h-[92px] rounded-xl border-x-8 border-y-6 border-[#DE4340] bg-[#6BA2A5] [background-clip:padding-box] px-6 py-3 [&_*]:text-white ${className}`}
    >
      <Typewriter key={text} text={text} />
      <img
        src="/svg/triangle-white-down.svg"
        alt="Next"
        className="absolute right-4 bottom-2 h-3 w-3 animate-bounce"
      />
    </div>
  );
};

export default MessageBox;
