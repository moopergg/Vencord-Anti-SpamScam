import { Plugin } from "vendetta";
import { after } from "vendetta/patcher";
import { findByProps } from "vendetta/metro";

const MessageEvents = findByProps("sendMessage", "receiveMessage");

const BLOCKED_DOMAINS = [
    "000l34e.wcomhost.com/?",
    "0007854.atwebpages.com/desk/index.html",
    "0.0.0.0ssl.cryptonight.net"
	"robiox.com.sb"
	"robloxr.cfd"
];

function isBlockedLink(message) {
    return BLOCKED_DOMAINS.some(domain => message.includes(domain));
}

let unpatch;

export default new Plugin({
    onLoad() {
        unpatch = after("receiveMessage", MessageEvents, ([message]) => {
            if (message?.content && isBlockedLink(message.content)) {
                console.warn("Blocked a potential phishing/spam link:", message.content);
                message.content = "[Blocked suspicious link]";
            }
        });
    },

    onUnload() {
        if (unpatch) unpatch();
    }
});
