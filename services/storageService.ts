import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';

interface UploadResult {
  s3Key: string;
  url: string;
}

/**
 * Get the current user's identity ID
 */
export const getIdentityId = async (): Promise<string> => {
  const session = await fetchAuthSession();
  if (!session.identityId) {
    throw new Error('No identity ID found in session');
  }
  return session.identityId;
};

/**
 * Upload an image to S3
 */
export const uploadImage = async (
  uri: string,
  fileName: string
): Promise<UploadResult> => {
  const identityId = await getIdentityId();
  const s3Key = `drinks/${Date.now()}_${fileName}`;

  const response = await fetch(uri);
  if (!response.ok) {
    throw new Error('Failed to fetch image for upload');
  }
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

/**
 * Get a signed URL for an S3 image
 */
export const getImageUrl = async (s3Key: string): Promise<string> => {
  const identityId = await getIdentityId();

  const result = await getUrl({
    path: `private/${identityId}/${s3Key}`,
    options: { expiresIn: 3600 },
  });

  return result.url.toString();
};

/**
 * Delete an image from S3
 */
export const deleteImage = async (s3Key: string): Promise<void> => {
  const identityId = await getIdentityId();

  await remove({
    path: `private/${identityId}/${s3Key}`,
  });
};
