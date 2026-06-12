import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopBar from '@/components/admin/AdminTopBar';
import AdminProviders from '@/components/admin/AdminProviders';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { userId } = await auth();

    if (!userId) {
        redirect('/sign-in?redirect_url=/admin');
    }

    // Get full user object to verify email reliably
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress || '';
    const isAdminEmail = userEmail === 'healmitraayurvedicproducts@gmail.com';

    // Check role from metadata
    const role = (user?.publicMetadata as any)?.role;
    const isAdmin = role === 'admin' || isAdminEmail;

    console.log('🔐 Admin Layout Check:', { role, email: userEmail, isAdmin });

    if (!isAdmin) {
        redirect('/');
    }

    return (
        <AdminProviders>
            <div className="min-h-screen bg-paper flex overflow-hidden">
                <AdminSidebar />
                <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                    <AdminTopBar />
                    <main className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
                        <div className="max-w-7xl mx-auto space-y-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminProviders>
    );
}
