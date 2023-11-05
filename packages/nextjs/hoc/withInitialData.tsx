import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { setHost } from "~~/store/slices/host.slice";

export const withInitialData = WrappedComponent => {
  const WithInitialData = props => {
    const { address } = useAccount();

    const { data: hostData } = useScaffoldContractRead({
      contractName: "YourContract",
      functionName: "getHost",
      args: [address],
    });

    const dispatch = useDispatch();

    useEffect(() => {
      if (hostData) {
        dispatch(setHost(hostData.nodeId));
      }
    }, [dispatch, hostData]);

    if (!address) {
      return (
        <div className="hero bg-base-200" style={{ backgroundColor: "#f5f9ffff" }}>
          <div className="hero-content text-center p-4">
            <div className="max-w-md" style={{ margin: "auto" }}>
              <img src="./skypier_logo_baseline.png" alt="logo Skypier" />
              {/* <h1 className="text-5xl font-bold">Skypier</h1> */}
              <p className="py-6">Please connect your wallet to be able to use the app.</p>
              <RainbowKitCustomConnectButton />
            </div>
          </div>
        </div>
      );F
    }

    return <WrappedComponent {...props} />;
  };

  return WithInitialData;
};
