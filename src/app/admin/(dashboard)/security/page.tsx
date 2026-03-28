import type { Metadata } from 'next';
import getAdminCredentials from '@/actions/admin/getAdminCredentials';
import {
    getActiveSessions, getLoginAttempts,
} from '@/actions/authentication/adminSecurityManagement';
import { getAllPasswords } from '@/actions/genericAuth/passwordManagement';
import ErrorFallback from '@/components/ErrorFallback';
import TwoFAManagement from './2FAManagement';
import ActiveSessions from './ActiveSessions';
import AdminPassword from './AdminPassword';
import BlockedIPs from './BlockedIPs';
import LoginAttempts from './LoginAttempts';
import PasswordManagement from './PasswordManagement';
import SecurityHeader from './SecurityHeader';


export const metadata: Metadata = {
    title: 'Security Settings',
};

export default async function Page() {

    const [
        adminCredentials,
        sessionsData,
        attemptsData,
        passwordsData,
    ] = await Promise.all([
        getAdminCredentials(),
        getActiveSessions(),
        getLoginAttempts(),
        getAllPasswords(),
    ]);

    return (
        <main
            id="main-content"
            tabIndex={-1}
            role="main"
            aria-label="Security settings admin page content"
            className="min-h-screen bg-linear-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 p-3 sm:p-4"
        >
            <div className="container mx-auto max-w-7xl space-y-6">
                <SecurityHeader />
                <AdminPassword />
                {(passwordsData.passwordList && passwordsData.expiredCount !== undefined) ? (
                    <PasswordManagement
                        passwordList={passwordsData.passwordList}
                        expiredCount={passwordsData.expiredCount}
                    />
                ) : (
                    <ErrorFallback message={passwordsData.message} />
                )}
                <TwoFAManagement isEnabled={!!adminCredentials.totpSecret} enabledOn={adminCredentials.totpCreatedOn} />
                <ActiveSessions sessionList={sessionsData} />
                <LoginAttempts
                    attempts={attemptsData}
                />
                <BlockedIPs ipList={adminCredentials.blockedIPs} />
            </div>
        </main>
    );
}
