import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import * as admin from 'firebase-admin';

const client = new SecretManagerServiceClient();

let singleAdmin: { admin: admin.app.App, apiKey: string, enabledDate: Date };
let singleAdminDev: { admin: admin.app.App, apiKey: string, enabledDate: Date };

let isFetchingAdmin = false;
let waitInterval: any;
let environmentType: string;

const db = async (type: string): Promise<{ admin: admin.app.App, apiKey: string, enabledDate: Date }> => {
    environmentType = type;
    switch (type) {
        case 'prod':
            if (singleAdmin) {
                // console.log('here in Prod old');
                return singleAdmin;
            }
            if (isFetchingAdmin) {
                // Create an instance of the check function interval
                waitInterval = setInterval(wait, 50);
                console.log('here in waiting prod');
                return singleAdmin;
            }
            isFetchingAdmin = true;
            console.log('here in Prod new');
            singleAdmin = await getAdmin(process.env.PROD_DB_URL, type);
            singleAdmin?.admin?.firestore()?.settings({ ignoreUndefinedProperties: true });
            isFetchingAdmin = false;
            return singleAdmin;


        case 'dev':
            if (singleAdminDev) {
                // console.log('here in Dev old');
                return singleAdminDev;
            }
            if (isFetchingAdmin) {
                // Create an instance of the check function interval
                waitInterval = setInterval(wait, 50);
                console.log('here in waiting dev');
                return singleAdminDev;
            }
            console.log('here in Dev new');
            isFetchingAdmin = true;
            singleAdminDev = await getAdmin(process.env.DEV_DB_URL, type); // prod_dev
            singleAdminDev.admin.firestore().settings({ ignoreUndefinedProperties: true });
            isFetchingAdmin = false;
            return singleAdminDev;

        default:
            return null;
    }
};

// when uploading updates to existing environment, there might be multiple requests coming at
// once and to avoid calling overlap we wait those requests until admin is initiated.
function wait() {
    switch (environmentType) {
        case 'prod':
            if (singleAdmin) {
                clearInterval(waitInterval);
            }
            break;
        case 'dev':
            if (singleAdminDev) {
                clearInterval(waitInterval);
            }
            break;
        default:
            break;
    }
}

async function getAdmin(path: string, type: string): Promise<{ admin: admin.app.App, apiKey: string, enabledDate: Date }> {
    try {
        const tempAdmin = {} as { admin: admin.app.App, apiKey: string, enabledDate: Date };
        const [version] = await client.accessSecretVersion({
            name: path,
        });

        // console.log(version.payload.data.toString());
        // console.log(JSON.parse(version.payload.data.toString()));
        // console.log(version.payload.data.toString().replace(/\\n/g, ''));
        const result: any = JSON.parse(version.payload.data.toString());
        const params = {
            type: result.type,
            projectId: result.project_id,
            privateKeyId: result.private_key_id,
            privateKey: result.private_key,
            clientEmail: result.client_email,
            clientId: result.client_id,
            authUri: result.auth_uri,
            tokenUri: result.token_uri,
            authProviderX509CertUrl: result.auth_provider_x509_cert_url,
            clientC509CertUrl: result.client_x509_cert_url,
        };
        tempAdmin.admin = admin.initializeApp({
            credential: admin.credential.cert(params),
            storageBucket: `gs://${result.project_id}.appspot.com`,
        }, type);
        tempAdmin.apiKey = result.apiKey;
        tempAdmin.enabledDate = new Date();
        // console.log(tempAdmin, ' this.singleAdmin');
        return tempAdmin;
    } catch (e) {
        console.error('credentials error. Check if the app engine default service account has secret manager accessor' +
            ' access', e);
        return null;
    }
}

export default db;
