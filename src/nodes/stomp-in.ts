import {Node, NodeInitializer, NodeStatus} from "node-red";
import {StompInNodeDef} from "./index.types";
import {Client, over} from 'stompjs';

const init: NodeInitializer = (RED): void => {

    const stomps: { [key: string]: Client } = {};

    function _StompIn(this: Node, n: StompInNodeDef) {
        const node = this;
        RED.nodes.createNode(node, n);
        const client = n.client;
        let stomp: Client | undefined = stomps[client];
        const config = RED.nodes.getNode(client) as any;
        if (config) {
            // config.registerInputNode(this);
            const websocket = config.server as WebSocket;

            function subscribe(this: Client) {
                this?.subscribe(n.subscribe, function (msg) {
                    node.send({payload: msg.body});
                });
            }

            if (!stomp || stomp.ws != websocket) {
                stomp = over(websocket);
                // stomp.debug = console.log;
                stomp.connect({}, () => {
                    subscribe.bind(stomp!)();
                });
                stomps[client] = stomp;
            } else {
                subscribe.bind(stomp)();
            }

            config.on('opened', function (event: any) {
                node.status({
                    fill: "green", shape: "dot", text: RED._("websocket.status.connected", {count: event.count}),
                    // _session: {type: "websocket", id: event.id}
                });
            });
            config.on('erro', function (event: any) {
                node.status({
                    fill: "red", shape: "ring", text: "common.status.error"
                });
            });
            config.on('close', function (event: any) {
                let status: NodeStatus;
                if (event.count > 0) {
                    status = {
                        fill: "green",
                        shape: "dot",
                        text: RED._("websocket.status.connected", {count: event.count})
                    };
                } else {
                    status = {fill: "red", shape: "ring", text: "common.status.disconnected"};
                }
                node.status(status);
            });
        }
        this.on('close', () => {
            Object.keys(stomp?.subscriptions || {}).map(x => {
                stomp?.unsubscribe(x);
            });
            this.status({});
        });
    }

    RED.nodes.registerType('stomp in', _StompIn);

}
export = init;