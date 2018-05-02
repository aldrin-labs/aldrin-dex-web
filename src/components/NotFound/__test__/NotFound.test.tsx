import { HTMLAttributes, shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { NotFound } from '../';
const testNotFoundProps = {
  items: ['1', '2', '3'],
};
let child: ShallowWrapper<undefined, undefined>;
beforeEach(() =>
  child=shallow(<NotFound {...testNotFoundProps}/>));

it('should render without error', () =>
  expect(child.length).toBe(1));
it('just test test through props', () => {
  const pNodes: ShallowWrapper<HTMLAttributes, undefined> = child.find('p');
  expect(pNodes.length).toBe(testNotFoundProps.items.length);
})
