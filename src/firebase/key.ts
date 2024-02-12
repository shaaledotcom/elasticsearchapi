import { SecretManagerServiceClient } from "@google-cloud/secret-manager/build/src";
import * as admin from "firebase-admin";

const client = new SecretManagerServiceClient();

let privateKey: string;
let privateKeyIk: any;

export const key = async (type: string): Promise<string> => {
    switch (type) {
        case 'STREAM_KEY':
            if (privateKey) {
                return privateKey;
            } else {
                console.log('STREAM_KEY', process.env.STREAM_KEY);
                privateKey = await getKey(process.env.STREAM_KEY);
                return privateKey;
            }
        case 'IK_STREAM_KEY':
            if (privateKeyIk) {
                return privateKeyIk;
            } else {
                console.log('STREAM_KEY', process.env.IK_STREAM_KEY);
                privateKeyIk = await getKeyIk(process.env.IK_STREAM_KEY);
                return privateKeyIk;
            }
        case "ELASTIC_CONF":
            const [version] = await client.accessSecretVersion({
                name: process.env.ELASTIC_CONF,
            });
            const data = version.payload.data.toString()
            let elastic_conf = JSON.parse(data)
            const jsonString = elastic_conf.replace(/'([^']+)'/g, "\"$1\"");
            elastic_conf = JSON.parse(jsonString);
            return elastic_conf
    }
}

async function getKey(path: string): Promise<string> {
    try {
        const [version] = await client.accessSecretVersion({
            name: path,
        });

        // console.log(version.payload.data.toString());
        // console.log(JSON.parse(version.payload.data.toString()));
        // console.log(version.payload.data.toString().replace(/\\n/g, ''));
        const tempAdmin: string = version.payload.data.toString();
        // console.log(tempAdmin);
        return tempAdmin;
    } catch (e) {
        console.error('credentials error. Check if the app engine default service account has' +
            ' secret manager accessor access', e);
        return null;
    }
}

async function getKeyIk(path: string): Promise<string> {
    try {
        const [version] = await client.accessSecretVersion({
            name: path,
        });

        // console.log(version.payload.data.toString());
        // console.log(JSON.parse(version.payload.data.toString()));
        // console.log(version.payload.data.toString().replace(/\\n/g, ''));
        // console.log(tempAdmin);
        return JSON.parse(version.payload.data.toString());
    } catch (e) {
        console.error('credentials error. Check if the app engine default service account has' +
            ' secret manager accessor access', e);
        return null;
    }
}
