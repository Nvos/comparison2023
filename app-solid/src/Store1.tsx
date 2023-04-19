import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';

// Example from https://www.solidjs.com/docs/latest/api#getters
export const Store1 = () => {
  const [state, setState] = createStore({
    user: {
      firstName: 'John',
      lastName: 'Smith',
      get fullName() {
        return `${this.firstName} ${this.lastName}`;
      },
    },
  });

  createEffect(() => console.log(state.user.fullName));

  return null;
};
