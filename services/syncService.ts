import { uploadData, downloadData } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import database from '../database/index.native';
import Drink from '../database/model/Drink';

const getBackupKey = async (): Promise<string> => {
  const session = await fetchAuthSession();
  return `backup/drinks.json`;
};

export const syncToCloud = async (): Promise<void> => {
  const session = await fetchAuthSession();
  const userId = session.identityId || '';

  const drinks = await database.collections.get<Drink>('drinks').query().fetch();

  const userDrinks = drinks.filter((d) => d.userId === userId);

  const data = userDrinks.map((drink) => ({
    id: drink.id,
    flavor: drink.flavor,
    price: drink.price,
    store: drink.store,
    occasion: drink.occasion,
    rating: drink.rating,
    date: drink.date,
    s3Key: drink.s3Key,
    userId: drink.userId,
    lastModified: drink.lastModified?.getTime(),
  }));

  const backupKey = await getBackupKey();

  const uploadOperation = uploadData({
    path: `private/${userId}/${backupKey}`,
    data: JSON.stringify(data),
    options: {
      contentType: 'application/json',
    },
  });

  await uploadOperation.result;

  await database.write(async () => {
    for (const drink of userDrinks) {
      await drink.update((d) => {
        d.synced = true;
      });
    }
  });
};

export const syncFromCloud = async (): Promise<void> => {
  const session = await fetchAuthSession();
  const userId = session.identityId || '';

  try {
    const backupKey = await getBackupKey();

    const downloadOperation = downloadData({
      path: `private/${userId}/${backupKey}`,
    });

    const { body } = await downloadOperation.result;
    const text = await body.text();
    const cloudDrinks = JSON.parse(text);

    const localDrinks = await database.collections.get<Drink>('drinks').query().fetch();

    const localDrinkIds = new Set(localDrinks.map((d) => d.id));

    await database.write(async () => {
      for (const cloudDrink of cloudDrinks) {
        if (!localDrinkIds.has(cloudDrink.id)) {
          await database.collections.get<Drink>('drinks').create((drink) => {
            drink._raw.id = cloudDrink.id;
            drink.flavor = cloudDrink.flavor;
            drink.price = cloudDrink.price;
            drink.store = cloudDrink.store;
            drink.occasion = cloudDrink.occasion;
            drink.rating = cloudDrink.rating;
            drink.date = cloudDrink.date;
            drink.s3Key = cloudDrink.s3Key;
            drink.userId = userId;
            drink.synced = true;
            drink.lastModified = new Date(cloudDrink.lastModified);
          });
        }
      }
    });
  } catch (error) {
    console.log('No backup found or error syncing:', error);
  }
};
