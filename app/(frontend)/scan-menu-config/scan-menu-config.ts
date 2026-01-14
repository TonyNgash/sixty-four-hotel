interface BaseSectionConfig {
    id:string;
    title:string;
    componentPath:string;
    lazy:boolean;
}

interface ScanMenuConfig extends BaseSectionConfig {
    id: 'restaurant';
    props: Record<string, never>;  
}

export type ScanMenuPageConfig = ScanMenuConfig;

export const scanMenuSection: ScanMenuPageConfig[] = [
    {
        id:'restaurant',
        title: 'Fine Dining at your fingertips',
        componentPath: '@/components/frontend/home-sections/restaurant/restaurant-section',
        lazy: true,
        props: {},
    }
];