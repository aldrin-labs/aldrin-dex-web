import React from 'react'
import styled from 'styled-components'

export const Table = styled.div`
  font-family: Roboto, sans-serif;
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  max-height: calc(100vh - 59px - 80px);
  overflow-y: hidden;

  @media (max-width: 1080px) {
    width: 100%;
  }
`

export const Title = styled.div`
  width: 100%;
  text-transform: uppercase;
  color: white;
  font-size: 14px;
  font-weight: 700;
  padding: 10px;
  background: #353d46;
  text-align: center;
  vertical-align: middle;

  @media (max-width: 1080px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const Body = styled.div`
  width: 100%;
  height: ${(props: { height: string }) => props.height};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0px;
  }
`

export const Row = styled.div`
  width: 100%;

  display: flex;
  border-top: ${(props: { isHead?: boolean }) =>
    props.isHead ? '1px solid #818d9ae6' : 'none'};
  border-bottom: 1px solid #2d3136;
  transition: background 0.25s ease;
  background-color: ${(props: { isHead?: boolean; background: string }) =>
    props.background};
  height: ${(props: { isHead?: boolean }) => (props.isHead ? '100%' : '22px')};

  &:hover {
    background: ${(props: { isHead?: boolean }) =>
      props.isHead ? '#292d31' : '#454f59'};
  }
`

export const Cell = styled.div`
  overflow: hidden;
  list-style: none;
  padding: 0.25rem 0.4rem;
  font-weight: 600;
  font-size: 0.75rem;
  flex-basis: ${(props: { width: string }) => props.width};
  color: ${(props: { color: string; width: string }) => props.color};
  text-align: center;
  vertical-align: middle;
`

export const HeadCell = Cell.extend`
  font-weight: 400;
  font-size: 0.75rem;
  white-space: nowrap;
  width: 7%;
  color: white;
`

export const Head = styled.div`
  height: 40px;
  width: 100%;
  color: white;
  background-color: ${(props: { background: string }) => props.background};
  border-bottom: 1px solid #818d9ae6;
  position: sticky;
  top: 0;

  font-family: Roboto, sans-serif;
`
