import { useState, useEffect, useMemo, useCallback } from 'react';
import { AI_TOOLS } from '../data/tools';
import { Tool } from '../types';
import { fetchCommunityTools, normalizeDomainKey } from '../lib/communityTools';

export function useAllTools() {
  const [communityTools, setCommunityTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadTools = useCallback(async (force = false) => {
    try {
      setError(null);
      const tools = await fetchCommunityTools(force);
      setCommunityTools(tools);
    } catch (err: any) {
      console.warn('Could not load community tools, falling back to static tools:', err);
      setError(err?.message || 'Could not fetch community tools');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTools(false);

    // Listen for custom event when tools are added/updated/deleted
    const handleToolsChanged = () => {
      loadTools(true);
    };

    window.addEventListener('aifinder_community_tools_changed', handleToolsChanged);
    return () => {
      window.removeEventListener('aifinder_community_tools_changed', handleToolsChanged);
    };
  }, [loadTools]);

  // Merge static tools + community tools, de-duplicated by domainKey and slug (static wins)
  const allTools = useMemo(() => {
    const staticDomainKeys = new Set<string>();
    const staticSlugs = new Set<string>();

    for (const tool of AI_TOOLS) {
      staticSlugs.add(tool.slug.toLowerCase());
      const { domainKey } = normalizeDomainKey(tool.websiteUrl);
      if (domainKey) staticDomainKeys.add(domainKey);
    }

    const filteredCommunity = communityTools.filter((ct) => {
      if (ct.hidden === true) return false;
      if (staticSlugs.has(ct.slug.toLowerCase())) return false;
      const { domainKey } = normalizeDomainKey(ct.websiteUrl);
      if (domainKey && staticDomainKeys.has(domainKey)) return false;
      return true;
    });

    return [...AI_TOOLS, ...filteredCommunity];
  }, [communityTools]);

  return {
    allTools,
    communityTools,
    loading,
    error,
    refreshTools: () => loadTools(true)
  };
}
