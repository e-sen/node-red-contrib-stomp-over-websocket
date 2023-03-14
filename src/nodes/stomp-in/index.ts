import {EditorRED} from "node-red";
import {StompInNodeProperties} from "../index.types";
import "jquery";

declare const RED: EditorRED;

// function ws_validateserver(this: NodeInstance<StompInNodeProperties>) {
//     if ($("#node-input-mode").val() === 'client' || (this.client && !this.server)) {
//         return true;
//     } else {
//         if (RED.nodes.node(this.server) != null) {
//             return true;
//         }
//         return false;
//     }
// }
//
// function ws_validateclient(this: NodeInstance<StompInNodeProperties>) {
//     console.log("===============");
//     console.log(this);
//     console.log("===============")
//     if ($("#node-input-mode").val() === 'client' || (this.client && !this.server)) {
//         if (RED.nodes.node(this.client) != null) {
//             return true;
//         }
//         return false;
//     } else {
//         return true;
//     }
// }

RED.nodes.registerType<StompInNodeProperties>("stomp in", {
    category: "network",
    defaults: {
        name: {
            value: ""
        },
        client: {
            type: 'websocket-client',
            value: '',
            // validate: ws_validateclient
        },
        subscribe: {
            type: 'string',
            value: ''
        }
        // server: {
        //     type: 'websocket-listener',
        //     value: '',
        //     validate: ws_validateserver
        // }
    },
    color: '#00b96b',
    icon: 'font-awesome/fa-check-square-o',
    inputs: 1,
    outputs: 1,
    label: function () {
        return this.name ? "node_label_italic" : "";
    },
    // oneditprepare() {
    //     $("#websocket-client-row").hide();
    //     $("#node-input-mode").on("change", function () {
    //         if ($("#node-input-mode").val() === 'client') {
    //             $("#websocket-server-row").hide();
    //             $("#websocket-client-row").show();
    //         } else {
    //             $("#websocket-server-row").show();
    //             $("#websocket-client-row").hide();
    //         }
    //     });
    //
    //     if (this.client) {
    //         $("#node-input-mode").val('client').change();
    //     } else {
    //         $("#node-input-mode").val('server').change();
    //     }
    // },
    //
    // oneditsave() {
    //     if ($("#node-input-mode").val() === 'client') {
    //         $("#node-input-server").append('<option value="">Dummy</option>');
    //         $("#node-input-server").val('');
    //     } else {
    //         $("#node-input-client").append('<option value="">Dummy</option>');
    //         $("#node-input-client").val('');
    //     }
    // }
});
