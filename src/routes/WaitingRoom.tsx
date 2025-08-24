import { Scanner } from '@yudiel/react-qr-scanner';
import { useLiveConnection } from '@/components/providers/LiveConnectionProvider';
import Button from '@/components/ui/Button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import LayoutGBA from '@/components/ui/Layout';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { copyToClipboard } from '@/utils/clipboard';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import MessageBox from '@/components/ui/MessageBox';
import { cn } from '@/styles/shadcn';
import StepActionYesNo from '@/components/ui/StepAction';
import { PokemonService } from '@/services/pokemonService';
import { useNavigate } from 'react-router';

const WaitingRoom = () => {
  const navigate = useNavigate();
  const {
    role,
    setRole,
    guests,
    setGuests,
    isApplyingAnswer,
    isPreparingGuestOffer,
    guestDcState,
    initHost,
    hostApplyAnswer,
    initGuest,
    hostSendMessage,
  } = useLiveConnection();
  const connectedUserCount = guests.filter((guest) => guest.state === 'open').length;
  const sdp = guests[guests.length - 1]?.localSDP;

  const [scannerDialogOpen, setScannerDialogOpen] = useState(false);
  const [responseCode, setResponseCode] = useState('');
  const [guestLocalSDP, setGuestLocalSDP] = useState('');

  function onResponseCodeChange(code: string): void {
    setResponseCode(code);
    setGuests((arr) => {
      return arr.map((x, index) => (index === arr.length - 1 ? { ...x, remoteSDP: code } : x));
    });
  }

  return (
    <LayoutGBA
      className={cn(
        role
          ? "[&_[data-id='gba-inner']]:content-start [&_[data-id='gba-inner']]:justify-center"
          : ''
      )}
    >
      <h1 className="mx-auto mb-10 flex h-fit w-fit items-center gap-4 border-b-6 border-b-white pb-6 text-lg text-white">
        <img src="/svg/home.svg" alt="" className="h-7 w-7" />
        Waiting Room
      </h1>

      {!role && (
        <>
          <StepActionYesNo
            action={{
              yes: () => setRole('host'),
              no: () => setRole('guest'),
            }}
            className="ml-auto"
          />
          <MessageBox text="Do you want to be the host?" className="mt-auto w-full" />
        </>
      )}

      {/* Host UI */}
      {role === 'host' && (
        <>
          <p className="mb-6 text-center text-sm text-white">
            Connected users: {connectedUserCount}
          </p>

          {(guests.length === 0 || guests[guests.length - 1]?.state !== 'connecting') && (
            <div className="mt-8 grid grid-cols-2 gap-5">
              <Button onClick={initHost} variant="submit-blue" disabled={isPreparingGuestOffer}>
                Invite friend
              </Button>
              <Button
                onClick={() => {
                  PokemonService.getTwoRandom()
                    .then((pokemons) => {
                      hostSendMessage({
                        type: 'start_vote',
                        payload: { roundId: 'round-1', pair: pokemons },
                      });
                      navigate('/vote');
                    })
                    .catch((err) => {
                      console.error(err);
                      toast.error('Oops! Failed to start the vote. Please try later again.');
                    });
                }}
                variant="submit-green"
              >
                start
              </Button>
            </div>
          )}

          {isPreparingGuestOffer && (
            <p className="mt-6 animate-pulse text-center text-xs text-white">
              Preparing Invitation Code...
            </p>
          )}

          {guests[guests.length - 1] && guests[guests.length - 1].state === 'connecting' && (
            <div className="mx-auto grid w-4/6 gap-4">
              <p className="text-center text-xs text-white">
                Your friend can join by entering the Invitation Code
                <Button
                  variant="submit-blue"
                  onClick={() =>
                    copyToClipboard({
                      text: sdp,
                      onCopied: () => toast('Copied to clipboard'),
                    })
                  }
                  className="mx-auto mt-4"
                >
                  Copy Invitation Code
                </Button>
              </p>
              <hr />
              <p className="text-center text-xs text-white">
                After your friend accepts the connection, you can scan your friend's QR code or
                paste the Response Code below.
              </p>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <Dialog open={scannerDialogOpen} onOpenChange={setScannerDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="submit-blue">Scan QR Code</Button>
                  </DialogTrigger>
                  <DialogContent className="w-fit">
                    <DialogTitle className="sr-only">Scan Response Code</DialogTitle>
                    <div className="h-[350px] w-[350px] p-5">
                      <Scanner
                        onScan={(responses) => {
                          toast('Scanned successfully!');
                          onResponseCodeChange(responses[0]?.rawValue ?? '');
                          setScannerDialogOpen(false);
                        }}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <Input
                  placeholder="Response Code"
                  value={responseCode}
                  onChange={(e) => void onResponseCodeChange(e.target.value)}
                  className="text-xs text-white"
                />
              </div>

              <Button
                variant="submit-green"
                onClick={() =>
                  void hostApplyAnswer(guests[guests.length - 1].id, responseCode).catch((err) => {
                    console.error(err);
                    toast.error('Failed to apply the Answer Code. Please check and try again.');
                  })
                }
                className="text-xs"
                disabled={isApplyingAnswer}
              >
                Submit
              </Button>
            </div>
          )}
        </>
      )}

      {/* Guest UI */}
      {role === 'guest' && (
        <div className="flex flex-col justify-center gap-4">
          {guestDcState === 'open' ? (
            <>
              <p className="text-center text-xs text-white">
                You are connected!
                <br />
                Please wait for the host to start the vote.
              </p>
              <img
                src="/webp/pokeball.webp"
                alt=""
                className="mx-auto mt-12 h-10 w-10 animate-bounce"
              />
            </>
          ) : (
            <>
              <p className="text-center text-xs text-white">Paste the invitation code here:</p>
              <Input
                placeholder="Invitation Code"
                onChange={(e) => {
                  initGuest(e.target.value)
                    .then((answer) => {
                      console.log('answerm', answer);
                      setGuestLocalSDP(answer);
                    })
                    .catch((err) => {
                      console.error(err);
                      toast.error(
                        'Failed to process the Invitation Code. Please check and try again.'
                      );
                    });
                }}
                className="text-xs text-white"
              />
              {guestLocalSDP && (
                <>
                  <p className="text-center text-xs text-white">
                    Let the host scan the QR Code in the app, or enter Answer Code manually
                  </p>
                  <Dialog>
                    <DialogTrigger className="group relative mx-auto w-fit cursor-pointer border-2 border-white p-2 hover:bg-stone-500">
                      <QRCodeSVG
                        height={100}
                        width={100}
                        value={guestLocalSDP}
                        className="mx-auto"
                      />
                      <img
                        src="/svg/zoom-out.svg"
                        alt="Zoom out QR Code"
                        className="absolute bottom-0 left-[calc(100%+12px)] h-8 w-8 border-2 p-2 group-hover:bg-stone-500"
                      />
                    </DialogTrigger>
                    <DialogContent className="w-fit">
                      <DialogTitle className="sr-only">QR Code</DialogTitle>
                      <QRCodeSVG
                        height={350}
                        width={350}
                        value={guestLocalSDP}
                        className="mx-auto"
                      />
                    </DialogContent>
                  </Dialog>
                  <small className="mx-auto text-white">-- or --</small>
                  <Button
                    variant="submit-blue"
                    onClick={() => {
                      copyToClipboard({
                        text: guestLocalSDP,
                        onCopied: () => toast('Copied to clipboard'),
                      });
                    }}
                    className="mx-auto w-fit"
                  >
                    Copy Answer Code
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </LayoutGBA>
  );
};

export default WaitingRoom;
