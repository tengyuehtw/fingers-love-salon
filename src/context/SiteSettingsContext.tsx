import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
    facebook_link?: string;
    instagram_link?: string;
    line_link?: string;
    booking_link?: string;
    footer_text?: string;
    [key: string]: string | undefined;
}

interface SiteSettingsContextType {
    settings: SiteSettings;
    loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({ settings: {}, loading: true });

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SiteSettings>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase.from('site_settings').select('id, value');

                if (error) {
                    console.error('Error fetching site settings:', error);
                    return;
                }

                if (data) {
                    const settingsMap: SiteSettings = {};
                    data.forEach(item => {
                        settingsMap[item.id] = item.value;
                    });
                    setSettings(settingsMap);
                }
            } catch (err) {
                console.error('Unexpected error fetching settings:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={{ settings, loading }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};
