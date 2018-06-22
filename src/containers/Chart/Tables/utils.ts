export const demoAnime = (sizeInd: number, data: any[]) => {
  const setFalseForSecond = (ind: number) =>
    data.map(
      (el, i) =>
        i === ind
          ? Object.assign({}, el, {
              updated: true,
            })
          : el
    )

  return data.map(
    (el, i) =>
      el.size === sizeInd
        ? Object.assign({}, el, {
            updated: el.updated === true ? setFalseForSecond(i) : true,
            percentageOfChange: Math.floor(Math.random() * (100 - 0 + 1)) + 0,
          })
        : el
  )
}
