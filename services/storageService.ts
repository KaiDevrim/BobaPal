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
  const s3Key = `drinks/${Date.now()}_${fileName}`;

  const response = await fetch(uri);
  const blob = await response.blob();

  const uploadOperation = uploadData({
    path: `private/${identityId}/${s3Key}`,
    data: blob,
    options: {
      contentType: 'image/jpeg',
    },
  });

  await uploadOperation.result;

  const urlResult = await getUrl({
    path: `private/${identityId}/${s3Key}`,
  });

  return { s3Key, url: urlResult.url.toString() };
};

export const getImageUrl = async (s3Key: string): Promise<string> => {
  const identityId = await getIdentityId();

  const result = await getUrl({
    path: `private/${identityId}/${s3Key}`,
    options: { expiresIn: 3600 },
  });

  return result.url.toString();
};

export const deleteImage = async (s3Key: string): Promise<void> => {
  const identityId = await getIdentityId();

  await remove({
    path: `private/${identityId}/${s3Key}`,
  });
};
