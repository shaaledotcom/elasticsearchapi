import db from "../../firebase/db";
import * as firebaseAdmin from 'firebase-admin';
import {RecommendationInterface} from "../recommendation_interface";

export {
    updateRecommendation,
}

async function updateRecommendation(recommendationInterface: RecommendationInterface) {
    if (process.env.KEY === 'prod') {
        const admin: firebaseAdmin.app.App = (await db(process.env.KEY)).admin;
        await admin.firestore().collection('Recommendation').add(recommendationInterface);
    }
}