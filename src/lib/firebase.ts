import admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { getEnv } from "@/utils/getEnv";

export const firebaseConfig = {
    type: getEnv("FIREBASE_TYPE"),
    project_id: getEnv("FIREBASE_PROJECT_ID"),
    private_key_id: getEnv("FIREBASE_PRIVATE_KEY_ID"),
    private_key: getEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    client_email: getEnv("FIREBASE_CLIENT_EMAIL"),
    client_id: getEnv("FIREBASE_CLIENT_ID"),
    auth_uri: getEnv("FIREBASE_AUTH_URI"),
    token_uri: getEnv("FIREBASE_TOKEN_URI"),
    auth_provider_x509_cert_url: getEnv(
        "FIREBASE_AUTH_PROVIDER_X509_CERT_URL"
    ),
    client_x509_cert_url: getEnv("FIREBASE_CLIENT_X509_CERT_URL"),
    universe_domain: getEnv("FIREBASE_UNIVERSE_DOMAIN"),
};

const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
        storageBucket: getEnv("FIREBASE_STORAGE_BUCKET")
    });

const db = admin.firestore(app);
const bucket = admin.storage(app).bucket(getEnv("FIREBASE_STORAGE_BUCKET"));

export { admin, db, bucket, FieldValue };
