import TypewriterComponent from 'typewriter-effect';

const Typewriter = ({ text }: { text: string }) => {
  return (
    <div className='[&_*]:font-retro-gaming'>
      <TypewriterComponent
        onInit={typewriter => {
          typewriter.typeString(text).pauseFor(25).start();
        }}
        options={{ delay: 40 }}
      />
    </div>
  );
};

export default Typewriter;
