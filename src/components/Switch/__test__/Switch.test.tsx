import * as React from 'react'
import { shallow, mount } from 'enzyme'
import Switch from '../Switch'

describe('Switch', () => {
  describe('render', () => {
    it('basic', () => {
      const wrapper = shallow(<Switch />)

      expect(wrapper).toMatchSnapshot()
    })

    it('with values', () => {
      const wrapper = shallow(<Switch values={['ON', 'OFF']} />)

      expect(wrapper).toMatchSnapshot()
    })

    it('if isActive', () => {
      const wrapper = shallow(<Switch values={['ON', 'OFF']} isActive />)

      expect(wrapper).toMatchSnapshot()
    })
  })

  it('onClick Switch', () => {
    const onClick = jest.fn()
    const wrapper = mount(
      <Switch values={['ON', 'OFF']} onClick={onClick} isActive />
    )
    wrapper
      .find('input')
      .props()
      .onClick()

    expect(onClick).toBeCalled()
  })
})
