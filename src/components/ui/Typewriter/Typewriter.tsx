import TypewriterComponent from 'typewriter-effect';

const Typewriter = ({ text, className }: { text: string; className?: string }) => {
  return (
    <div className={className}>
      <TypewriterComponent
        onInit={(typewriter) => {
          typewriter.typeString(text).pauseFor(25).start();
        }}
        options={{ delay: 40 }}
      />
    </div>
  );
};

export default Typewriter;
