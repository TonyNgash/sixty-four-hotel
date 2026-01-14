//uses the same exact sections used in the home page. to display the same exact menu.
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { scanMenuSection } from '../scan-menu-config/scan-menu-config';

export default function ScanMenu() {

    return(
        
        <>
        <main className="flex flex-col min-h-screen bg-white">
           {scanMenuSection.map((section) => {
            if (section.id === 'restaurant') {
                const LazyRestaurantSection = dynamic(
                    () => import('@/components/frontend/home-sections/restaurant/restaurant-section'),
                    {
                        ssr: true,
                        loading: () => (
                            <div className="py-24 text-center">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#EB1B69]" />
                            </div>
                        ),
                    }
                );
                return (
                    <Suspense key={section.id} fallback={null}>
                        <LazyRestaurantSection />
                    </Suspense>
                );
            }
            return null;
           })}
        </main>
        </>
    );
}