import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [navigation, setNavigation] = useState({ header: [], footer: [], footerColumns: {} });
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSiteData = useCallback(async () => {
    try {
      const [settingsRes, navRes, contentRes] = await Promise.all([
        api.get('/settings').catch(() => ({ data: { settings: {} } })),
        api.get('/navigation').catch(() => ({ data: { header: [], footer: [], footerColumns: {} } })),
        api.get('/content').catch(() => ({ data: { data: {} } })),
      ]);

      if (settingsRes.data?.success) {
        setSettings(settingsRes.data.settings);
      }
      if (navRes.data?.success) {
        setNavigation({
          header: navRes.data.header || [],
          footer: navRes.data.footer || [],
          footerColumns: navRes.data.footerColumns || {},
        });
      }
      if (contentRes.data?.success) {
        setContent(contentRes.data.data || {});
      }
    } catch (err) {
      console.error('Failed to load dynamic site data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSiteData();
  }, [fetchSiteData]);

  const refreshSiteData = () => {
    return fetchSiteData();
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        navigation,
        content,
        loading,
        refreshSiteData,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
