import {NodeProperties} from "@node-red/editor-client";
import {NodeDef} from "node-red";

export interface StompIn {
    client: string;

    subscribe: string;
}

export interface StompInNodeDef extends NodeDef, StompIn {
}

export interface StompInNodeProperties extends NodeProperties, StompIn {
}