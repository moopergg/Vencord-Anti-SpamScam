import { Plugin } from "vendetta";
import { after } from "vendetta/patcher";
import { findByProps } from "vendetta/metro";

const MessageEvents = findByProps("sendMessage", "receiveMessage");

const BLOCKED_DOMAINS = [
    "example-scam.com",
    "phishing-site.net",
    "fake-giveaway.org"
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
                // Optionally delete or replace the message
                message.content = "[Blocked suspicious link]";
            }
        });
    },

    onUnload() {
        if (unpatch) unpatch();
    }
});
