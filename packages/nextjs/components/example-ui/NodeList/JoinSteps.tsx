import { forwardRef } from "react";
import { Button } from "~~/components/ui/Button";
import { CheckCircleIcon } from "@heroicons/react/24/outline";


interface JoinStepsI {
  vpnData: {
    ListeningAddress: string;
    ListeningPort: string;
  };
}

export const JoinSteps = forwardRef((props: JoinStepsI, ref) => {
  return (
    <dialog ref={ref} className="modal">
      <div className="modal-box">
        <h2 className="font-bold text-center text-xl text-success flex justify-center mt-5">
          <CheckCircleIcon className="h-7 w-7 mr-3" />
          Success. Libp2p forwarder enabled.
        </h2>
        <hr />
        <p>
          You can now forward your connection to the remote IPFS node.
        </p>
        <p>
          A few configuration steps are necessary before browsing the web while hiding your IP!
        </p>
        <h3 className="font-bold text-lg">Configure your web browser</h3>
        <p>In your browser Network configuration, define a new proxy with the next pieces of information:</p>
        <p>
          <strong>Proxy type:</strong> SOCKS v5
        </p>
        <p>
          <strong>Host:</strong> <code>{props.vpnData?.ListeningAddress}</code>
        </p>
        <p>
          <strong>Port:</strong> <code>{props.vpnData?.ListeningPort}</code>
        </p>
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <Button onClick={() => {}}>Close</Button>
        </form>
      </div>
    </dialog>
  );
});

JoinSteps.displayName = "JoinSteps";
