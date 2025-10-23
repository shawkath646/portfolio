import type { Metadata } from 'next';
import SecurityHeader from './SecurityHeader';
import AdminPassword from './AdminPassword';
import PasswordManagement from './PasswordManagement';
import getPasswordList from '@/actions/secure/getPasswordList';
import getLoginSession from '@/actions/secure/getLoginSession';

export const metadata: Metadata = {
    title: 'Security Settings',
    description: 'Manage security settings, passwords, and access controls for the admin panel',
};

export default async function Page() {

    const { isAdministrator } = await getLoginSession("admin-panel");    
    const passwordList = await getPasswordList();
    
    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-800 p-6">
            <div className="container mx-auto">
                <SecurityHeader />
                {isAdministrator && <AdminPassword />}
                <PasswordManagement passwordList={passwordList} />
            </div>
        </main>
    );
}
