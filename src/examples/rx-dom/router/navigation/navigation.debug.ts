import { INavigationNotification, NAVIGATION } from './navigation';

export async function debugNavigation() {
  const navigation = NAVIGATION;

  navigation.onChange((notification: INavigationNotification) => {
    console.log(notification);
  });

  for (let i = 0; i < 5; i++) {
    navigation.navigate('abj' + i);
    await new Promise(_ => setTimeout(_, 500));
  }

  (window as any).navigation = navigation;
}
