import { afterEach, describe, expect, test } from "vitest";

import { Client } from "../../src";

describe("smoke tests", { tags: ["integration"], timeout: 5000 }, () => {
    const url = "ws://localhost:38281";
    const slotName = "APQuestPlayer";

    const client = new Client();
    client.socket.on("sentPackets", (...args) => console.log("sent", ...args));
    client.socket.on("receivedPacket", (...args) => console.log("received", ...args));
    afterEach(() => client.socket.disconnect());

    test("smoke test", async () => {
        expect(await client.login(url, slotName, "APQuest")).not.toBeFalsy();

        const unlikelyMessage = "it is unlikely that someone would send this message especially with this speling error";

        const messageReceived = new Promise<void>((resolve) => {
            client.messages.on("message", (text) => {
                if (text.includes(unlikelyMessage)) {
                    resolve();
                }
            });
        });

        await client.messages.say(unlikelyMessage);
        await messageReceived;
    });

    test.each([
        "just say anything, yo!",
        "!admin",
        "!admin ",
        "!admin login hunter2",
        "!admin login *******",
        "!admin /option ",
        "!admin /option server_password",
        "!admin /option server_password hunter2",
        "!admin /option server_password *******",
    ] as const)("echo admin command test (ThePhar#232), command: %s", { tags: ["integration"] }, async (command) => {
        expect(await client.login(url, slotName, "APQuest")).not.toBeFalsy();

        // test for ThePhar#232: admin commands go through a different processor, which can cause the message we get
        // back to differ from the message that we sent, so older versions would hang forever when you tried to send
        // certain messages starting with "!admin" because they would never see the echo back.
        await client.messages.say(command);
    });
});
