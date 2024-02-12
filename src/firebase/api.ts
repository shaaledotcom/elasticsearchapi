import * as firebaseAdmin from 'firebase-admin';
import db from './db';
import DocumentReference = firebaseAdmin.firestore.DocumentReference;

class Api {

    public async getUserDocumentFromUid(uid: string, fullDoc?: boolean) {
        const doc: DocumentReference = await this.getUserDocumentRefFromUid(uid);
        if (doc === undefined || doc === null) {
            return null;
        }
        return fullDoc ? (await doc.get()) : (await doc.get()).data();
    }

    private getUserDocumentRefFromUid = async (uid: string) => {
        const {admin} = await db(process.env.KEY);
        return (await admin.firestore()
            .collection('Users')
            .where('firebaseId', '==', uid)
            .get()).docs[0]?.ref;
    };

    public async getCategoryIndexPath() {
        const doc: FirebaseFirestore.QuerySnapshot = await (await db(process.env.KEY)).admin
            .firestore().collection('CategoryIndex')
            .orderBy('createdOn', 'desc')
            .limit(1)
            .get();

        return doc.docs.length > 0 ? doc.docs[0] : null;
    }

    public async getSessionTokenDocument(uid: string, token: string) {
        const doc: FirebaseFirestore.DocumentReference = await this.getUserDocumentRefFromUid(uid);
        if (doc === undefined || doc === null) {
            return null;
        }
        return (await doc.collection('sessiontokens')
            .where('token', '==', token)
            .get()).docs[0];
    }

    public async getCacheStoragePath() {
        const doc: FirebaseFirestore.QuerySnapshot = await (await db(process.env.KEY)).admin
            .firestore().collection('CacheStorage')
            .orderBy('createdOn', 'desc')
            .limit(1)
            .get();

        return doc.docs.length > 0 ? doc.docs[0] : null;
    }

}

export default Api;