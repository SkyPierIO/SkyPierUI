import { RefObject, useCallback, useRef } from "react";
import Link from "next/link";
import type { NextPage } from "next";
import { useSelector } from "react-redux";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { ModalSteps } from "~~/components/host/ModalSteps";
import { Button } from "~~/components/ui/Button";

const Home: NextPage = () => {
  const dialogRef = useRef<RefObject<HTMLDivElement> | undefined>();
  const hostInfo = useSelector((state: any) => state.host);

  const beAHost = useCallback(() => {
    dialogRef.current.showModal();
  }, []);

  return (
    <div className="grid lg:grid-cols-2 flex-grow">
      <ModalSteps ref={dialogRef} />
      {!hostInfo && (
        <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
          <span className="text-4xl sm:text-6xl text-black">Be a host</span>
          <p>
            Take part of the network by running a node and start earning crypto.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
            <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
              <div className="flex rounded-full border-2 border-primary p-1">
                <Button onClick={() => beAHost()}>
                  Go <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col mt-6 px-7 py-8 bg-base-200 opacity-80 rounded-2xl shadow-lg border-2 border-primary">
        <span className="text-4xl sm:text-6xl text-black">Join a host</span>
        <p>
          Find nodes over the IPFS network and use them to proxify your connection.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-5">
          <div className="flex rounded-full border border-primary p-1 flex-shrink-0">
            <div className="flex rounded-full border-2 border-primary p-1">
              <Link href="/example-ui">
                <Button>
                  Join <ArrowSmallRightIcon className="w-3 h-3 mt-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const getStaticProps = async context => {
//   let nodeId = "";
//   try {
//     const response = await axios.get("http://localhost:8081/api/v0/id");
//     if (response.status === 200) {
//       nodeId = response.data;
//     }
//   } catch (error) {
//     console.error(error);
//   }
//   return { props: { nodeId } };
// };

export default Home;
