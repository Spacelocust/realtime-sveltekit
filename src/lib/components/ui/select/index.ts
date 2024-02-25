import { Select as SelectPrimitive } from 'bits-ui';

import Content from './select-content.svelte';
import Item from './select-item.svelte';
import Label from './select-label.svelte';
import Separator from './select-separator.svelte';
import Trigger from './select-trigger.svelte';

const { Root } = SelectPrimitive;
const { Group } = SelectPrimitive;
const { Input } = SelectPrimitive;
const { Value } = SelectPrimitive;

export {
  Root,
  Group,
  Input,
  Label,
  Item,
  Value,
  Content,
  Trigger,
  Separator,
  //
  Root as Select,
  Group as SelectGroup,
  Input as SelectInput,
  Label as SelectLabel,
  Item as SelectItem,
  Value as SelectValue,
  Content as SelectContent,
  Trigger as SelectTrigger,
  Separator as SelectSeparator,
};
