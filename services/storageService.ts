import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

export const getIdentityId = async (): Promise<string> => {
  const session = await fetchAuthSession();
  return session.identityId || '';
};

export const uploadImage = async (
  uri: string,
  fileName: string
): Promise<{ s3Key: string; url: string }> => {
  const identityId = await getIdentityId();
  const s3Key = `private/${identityId}/drinks/${Date.now()}_${fileName}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  await uploadData({
    key: s3Key,
    data: blob,
    options: {
      contentType: 'image/jpeg',
      accessLevel: 'private',
    },
  });

  const urlResult = await getUrl({ key: s3Key, options: { accessLevel: 'private' } });

  return { s3Key, url: urlResult.url.toString() };
};

export const getImageUrl = async (s3Key: string): Promise<string> => {
  const result = await getUrl({
    key: s3Key,
    options: { accessLevel: 'private', expiresIn: 3600 },
  });
  return result.url.toString();
};

export const deleteImage = async (s3Key: string): Promise<void> => {
  await remove({ key: s3Key, options: { accessLevel: 'private' } });
};
