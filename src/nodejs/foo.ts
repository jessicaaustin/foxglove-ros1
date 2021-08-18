import { HttpServerNodejs } from "@foxglove/xmlrpc/nodejs";

import { getEnvVar, getHostname, getNetworkInterfaces, getPid, TcpSocketNode } from ".";
import { RosNode } from "..";

async function main() {
  const name = "/testclient";
  let rosNode: RosNode | undefined;

  try {
    rosNode = new RosNode({
      name,
      rosMasterUri: "http://localhost:11311/",
      hostname: RosNode.GetRosHostname(getEnvVar, getHostname, getNetworkInterfaces),
      pid: getPid(),
      httpServer: new HttpServerNodejs(),
      tcpSocketCreate: TcpSocketNode.Create,
      log: console,
    });

    await rosNode.start();

    const sub = rosNode.subscribe({
      topic: "/sample",
    });

    sub.on("message", (msg, data, pub) => {
      console.log(
        `[MSG] ${JSON.stringify(msg)} (${
          data.byteLength
        } bytes from ${pub.connection.getTransportInfo()})`,
      );
    });
  } catch (err) {
    console.error(err);
  } finally {
    rosNode?.shutdown();
  }
}

void main();