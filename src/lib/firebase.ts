import { getApps, getApp, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
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

const app = getApps().length
    ? getApp()
    : initializeApp({
        credential: cert(firebaseConfig as ServiceAccount),
        storageBucket: getEnv("FIREBASE_STORAGE_BUCKET")
    });

const db = getFirestore(app);
const bucket = getStorage(app).bucket(getEnv("FIREBASE_STORAGE_BUCKET"));

export { app as admin, db, bucket, FieldValue };
