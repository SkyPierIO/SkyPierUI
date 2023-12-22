import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  YourContract,
  HostRegistered,
} from "../generated/YourContract/YourContract";
import { Registration } from "../generated/schema";

export function handleRegistration(event: HostRegistered): void {
  let registration = new Registration(
    event.transaction.hash.toHexString() + "-" + event.logIndex.toString()
  );
  registration.tokenId = event.params.tokenId;
  registration.nodeId = event.params.nodeId;
  registration.createdAt = event.block.timestamp;
  registration.save();
}
