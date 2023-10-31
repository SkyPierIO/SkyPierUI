import { forwardRef, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "../ui/Button";
import axios from "axios";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const ModalSteps = forwardRef((props, ref) => {
  const [nodeId, setNodeId] = useState();
  const router = useRouter();

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "registerAsHost",
    args: [nodeId],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
      router.push("/host");
    },
  });

  useEffect(() => {
    if (nodeId) {
      writeAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  const validateNodeId = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8081/api/v0/id");
      if (response.status === 200 && response.data) {
        const nodeId = response.data;
        return nodeId;
      }
      notification.error(`It looks you haven't follow the steps to be a host`);
    } catch (error) {
      notification.error(`It looks you haven't follow the steps to be a host`);
    }
  }, []);

  const beAHost = useCallback(async () => {
    const nodeId = await validateNodeId();
    if (nodeId) {
      setNodeId(nodeId);
      ref.current.close();
    }
  }, [ref, validateNodeId]);

  return (
    <dialog ref={ref} id="my_modal_1" className="modal">
      <div className="modal-box">
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h3 className="font-bold text-lg">Follow these instructions to be a host</h3>

        <ol
          className="p-3 prose"
          style={{
            listStyleType: "auto",
          }}
        >
          <li>Please confirm your IPFS node and the plug-in are running.</li>
        </ol>
        <div className="modal-action">
          <Button onClick={beAHost}>Be a Host</Button>
        </div>
      </div>
    </dialog>
  );
});

ModalSteps.displayName = "ModalSteps";
