import { KeyOrWallet } from '@containers/Portfolio/components/PortfolioSelector/PortfolioSelector.types'

export const getArrayContainsOnlySelected = (
  keysOrWalletsArray: KeyOrWallet[],
  toggledKeyOrWalletID: string
) =>
  keysOrWalletsArray.reduce((acc : string[], key: KeyOrWallet) => {
    const currentKey =
      key._id === toggledKeyOrWalletID ? { ...key, selected: !key.selected } : key

    return currentKey.selected ? [...acc, currentKey._id] : acc
  }, [])
