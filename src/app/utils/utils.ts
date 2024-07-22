import { Subscription } from 'rxjs';

//Function to unsubscribe petition

export const unsubscribePetition = (data: Subscription[]) => {
  data.forEach((item) => {
    item.unsubscribe();
  });

  data = [];
};
