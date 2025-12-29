import { useState, useEffect, useCallback } from 'react';
import { getCachedImageUrl } from '../services/imageCacheService';

interface UseS3ImageResult {
  imageUrl: string | null;
  loading: boolean;
  refetch: () => void;
}

export const useS3Image = (s3Key: string | null): UseS3ImageResult => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchUrl = async () => {
      if (!s3Key) {
        setImageUrl(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const url = await getCachedImageUrl(s3Key);

      if (mounted) {
        setImageUrl(url);
        setLoading(false);
      }
    };

    fetchUrl();

    return () => {
      mounted = false;
    };
  }, [s3Key, refreshKey]);

  return { imageUrl, loading, refetch };
};
