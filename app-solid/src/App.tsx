import { Component } from 'solid-js';
import { Reproduction } from './Batching';
import { State1 } from './State1';
import { State2 } from './State2';
import { State4 } from './State4';
import { NestedReactivity1 } from './NestedReactivity1';
import { NestedReactivity2 } from './NestedReactivity2';
import { Store } from './Store';
import { I18nSwitch } from './I18nSwitch';

export const App = () => {
  return (
    <div>
      <I18nSwitch />
    </div>
  );
};
