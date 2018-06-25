function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export const getFakeDepthChartData = () => {
  /* tslint:disable */
  const orderBookFakeData = []
  for (let index = 1; index < 101; index++) {
    orderBookFakeData.push({
      price: getRandomArbitrary(index * 100 - 2, index * 100),
      size: getRandomArbitrary(100 - index - 1, 100 - index),
      percentageOfChange: 23,
    })
  }

  const usdSpreadFakeData = []
  for (let index = 100; index < 201; index++) {
    usdSpreadFakeData.push({
      price: getRandomArbitrary((300 - index) * 100 - 1, (300 - index) * 100),
      size: getRandomArbitrary(200 - index - 1, 200 - index),
      percentageOfChange: 23,
    })
  }
  /* tslint:enable */

  return { usdSpreadFakeData, orderBookFakeData }
}

export const orders = [
  [0.061585, 28.53809065, 1.75751821, 1.75751821],
  [0.06159, 6.82004859, 0.42004606, 2.17756427],
  [0.06161, 0.0058764, 0.00036204, 2.17792631],
  [0.061621, 0.00343954, 0.00021195, 2.17813826],
  [0.061635, 0.18739408, 0.01155, 2.18968826],
  [0.061639, 0.00208, 0.00012821, 2.18981647],
  [0.061642, 0.0038119, 0.00023497, 2.19005144],
  [0.061651, 0.00875333, 0.00053965, 2.19059109],
  [0.061653, 0.00875172, 0.00053957, 2.19113066],
  [0.061655, 0.00881665, 0.00054359, 2.19167425],
  [0.061659, 0.99258, 0.06120089, 2.25287514],
  [0.061666, 0.54871105, 0.03383651, 2.28671165],
  [0.061667, 0.90081, 0.0555498, 2.34226145],
  [0.061668, 0.03344842, 0.0020627, 2.34432415],
  [0.061675, 0.97238, 0.05997144, 2.40429559],
  [0.061676, 0.94492, 0.05827889, 2.46257448],
  [0.061683, 0.92884, 0.05729354, 2.51986802],
  [0.061685, 10.0, 0.616849, 3.13671702],
  [0.061689, 0.92699, 0.05718434, 3.19390136],
  [0.061697, 0.00818322, 0.00050488, 3.19440624],
  [0.061701, 0.00744383, 0.00045929, 3.19486553],
  [0.061727, 0.01055687, 0.00065163, 3.19551716],
  [0.061728, 23.69469028, 1.46260499, 4.65812215],
  [0.061731, 0.97954, 0.0604673, 4.71858945],
  [0.061735, 0.98427, 0.06076322, 4.77935267],
  [0.061747, 0.13199169, 0.00815, 4.78750267],
  [0.061755, 0.19050691, 0.01176467, 4.79926734],
  [0.061759, 0.00797356, 0.00049243, 4.79975977],
  [0.061763, 0.00971466, 0.0006, 4.80035977],
  [0.06178, 0.03512084, 0.00216973, 4.8025295],
  [0.061796, 201.55545395, 12.45516298, 17.25769248],
  [0.061798, 0.60358215, 0.03729975, 17.29499223],
  [0.0618, 1.0314505, 0.06374363, 17.35873586],
  [0.061801, 1.0, 0.061801, 17.42053686],
  [0.061804, 4.0, 0.2472132, 17.66775006],
  [0.061814, 0.03336916, 0.00206266, 17.66981272],
  [0.061816, 45.0777, 2.7864902, 20.45630292],
  [0.06183, 21.95245788, 1.35732025, 21.81362317],
  [0.061831, 8.0, 0.49464664, 22.30826981],
  [0.061833, 0.00223816, 0.00013839, 22.3084082],
  [0.061854, 0.01833817, 0.00113429, 22.30954249],
  [0.061877, 7.28280986, 0.45063165, 22.76017414],
  [0.06188, 0.04190932, 0.00259332, 22.76276746],
  [0.061884, 0.07542585, 0.0046676, 22.76743506],
  [0.061891, 7.8, 0.48274645, 23.25018151],
  [0.061897, 0.03687688, 0.00228255, 23.25246406],
  [0.061898, 0.64622955, 0.04, 23.29246406],
  [0.061934, 8.12134515, 0.50298569, 23.79544975],
  [0.061935, 0.00781602, 0.00048408, 23.79593383],
  [0.061939, 0.66394037, 0.04112332, 23.83705715],
  [0.061944, 6.77, 0.41935777, 24.25641492],
]

export const orderBook = [
  {
    size: 3.22218428337452,
    price: 6858.3240929997,
    tradeSize: 6055.913374814,
    status: 'grow',
    percentageOfChange: 31,
    time: '10:06:11',
    updated: false,
  },
  {
    size: 7.19215466325509,
    price: 6707.4513017577,
    tradeSize: 3235.0263936314,
    status: 'fall',
    percentageOfChange: 12,
    time: '08:08:28',
  },
  {
    size: 7.38335366758585,
    price: 6774.6258298638,
    tradeSize: 4892.7452865987,
    status: 'grow',
    percentageOfChange: 2,
    time: '05:03:05',
  },
  {
    size: 1.45788979182461,
    price: 6302.2641014022,
    tradeSize: 3308.9584943063,
    status: 'grow',
    percentageOfChange: 14,
    time: '10:23:40',
  },
  {
    size: 6.56493808097379,
    price: 6356.5704036374,
    tradeSize: 4373.1799814133,
    status: 'grow',
    percentageOfChange: 75,
    time: '04:04:22',
  },
  {
    size: 3.32997251235963,
    price: 6732.7357640798,
    tradeSize: 6785.8283431457,
    status: 'grow',
    percentageOfChange: 92,
    time: '01:30:15',
  },
  {
    size: 6.23480753864123,
    price: 6735.3844186033,
    tradeSize: 4661.1319511269,
    status: 'grow',
    percentageOfChange: 98,
    time: '10:55:57',
  },
  {
    size: 6.41314271710689,
    price: 6664.3647812796,
    tradeSize: 6952.1217166285,
    status: 'fall',
    percentageOfChange: 9,
    time: '01:05:51',
  },
  {
    size: 0.43186196769941,
    price: 6004.0808763428,
    tradeSize: 3666.0574923409,
    status: 'grow',
    percentageOfChange: 12,
    time: '11:36:22',
  },
  {
    size: 2.08041730475357,
    price: 6568.9544905165,
    tradeSize: 4570.7020928455,
    status: 'grow',
    percentageOfChange: 71,
    time: '05:59:32',
  },
  {
    size: 3.89475589661608,
    price: 6944.4440867625,
    tradeSize: 3369.8213532162,
    status: 'grow',
    percentageOfChange: 74,
    time: '08:21:34',
  },
  {
    size: 5.13324488455661,
    price: 6719.2168633405,
    tradeSize: 3798.0027256833,
    status: 'fall',
    percentageOfChange: 41,
    time: '07:56:43',
  },
  {
    size: 6.93888496372394,
    price: 6618.7863832627,
    tradeSize: 6204.8634880996,
    status: 'fall',
    percentageOfChange: 17,
    time: '02:56:00',
  },
  {
    size: 6.28777838776773,
    price: 6280.5981367879,
    tradeSize: 6228.1910302984,
    status: 'grow',
    percentageOfChange: 68,
    time: '12:35:50',
  },
  {
    size: 6.01906973419597,
    price: 6134.9410499593,
    tradeSize: 4800.2649989609,
    status: 'fall',
    percentageOfChange: 48,
    time: '04:21:25',
  },
  {
    size: 5.4260953403681,
    price: 6831.6085149255,
    tradeSize: 5635.0748040745,
    status: 'fall',
    percentageOfChange: 44,
    time: '07:43:11',
  },
  {
    size: 9.74827326134079,
    price: 6380.822800737,
    tradeSize: 5927.2340090978,
    status: 'grow',
    percentageOfChange: 31,
    time: '03:35:07',
  },
  {
    size: 0.66290070542345,
    price: 6721.0954468402,
    tradeSize: 6605.0745743894,
    status: 'grow',
    percentageOfChange: 77,
    time: '12:07:54',
  },
  {
    size: 2.35867765388206,
    price: 6882.3399926305,
    tradeSize: 3417.9675889896,
    status: 'grow',
    percentageOfChange: 6,
    time: '07:48:18',
  },
  {
    size: 9.32129525641283,
    price: 6624.7048213522,
    tradeSize: 3123.8719956522,
    status: 'fall',
    percentageOfChange: 37,
    time: '08:33:58',
  },
  {
    size: 6.16865673856577,
    price: 6298.8970522618,
    tradeSize: 6560.9253397011,
    status: 'grow',
    percentageOfChange: 93,
    time: '04:04:11',
  },
  {
    size: 5.78919911516067,
    price: 6532.331896988,
    tradeSize: 3449.2821254884,
    status: 'fall',
    percentageOfChange: 98,
    time: '09:09:15',
  },
  {
    size: 7.03426223010776,
    price: 6117.8886451344,
    tradeSize: 3795.5301695845,
    status: 'grow',
    percentageOfChange: 32,
    time: '03:17:09',
  },
  {
    size: 2.56206767227115,
    price: 6584.5629118892,
    tradeSize: 3091.3344343448,
    status: 'grow',
    percentageOfChange: 14,
    time: '01:50:31',
  },
  {
    size: 9.2205741519421,
    price: 6639.4584259889,
    tradeSize: 6205.9622484022,
    status: 'grow',
    percentageOfChange: 44,
    time: '07:37:49',
  },
  {
    size: 1.70752315638104,
    price: 6275.3282472247,
    tradeSize: 5115.5126720324,
    status: 'fall',
    percentageOfChange: 12,
    time: '09:45:55',
  },
  {
    size: 3.97378269563235,
    price: 6921.5891058221,
    tradeSize: 4609.7914432988,
    status: 'grow',
    percentageOfChange: 94,
    time: '04:08:53',
  },
  {
    size: 2.84045808695003,
    price: 6900.2628070746,
    tradeSize: 4347.7600594212,
    status: 'grow',
    percentageOfChange: 4,
    time: '11:14:06',
  },
  {
    size: 1.1299513789993,
    price: 6511.8258464377,
    tradeSize: 6595.841646338,
    status: 'grow',
    percentageOfChange: 10,
    time: '02:05:08',
  },
  {
    size: 4.47651103438562,
    price: 6288.3376094143,
    tradeSize: 6278.8710433483,
    status: 'grow',
    percentageOfChange: 98,
    time: '06:43:36',
  },
  {
    size: 9.6148466176619,
    price: 6431.4510784973,
    tradeSize: 3679.8509094943,
    status: 'fall',
    percentageOfChange: 16,
    time: '02:44:19',
  },
  {
    size: 9.5904110032797,
    price: 6385.2741133685,
    tradeSize: 5563.5632157796,
    status: 'fall',
    percentageOfChange: 74,
    time: '01:28:27',
  },
  {
    size: 9.21953581822787,
    price: 6400.2638969709,
    tradeSize: 5848.327765312,
    status: 'grow',
    percentageOfChange: 51,
    time: '11:08:44',
  },
  {
    size: 4.03649397832803,
    price: 6164.099285883,
    tradeSize: 4443.3471980977,
    status: 'grow',
    percentageOfChange: 15,
    time: '09:59:55',
  },
  {
    size: 5.68581741415513,
    price: 6404.5393846058,
    tradeSize: 3890.7359471147,
    status: 'grow',
    percentageOfChange: 10,
    time: '10:04:09',
  },
  {
    size: 0.05112171441289,
    price: 6285.4605574807,
    tradeSize: 4261.7063618371,
    status: 'grow',
    percentageOfChange: 83,
    time: '05:31:57',
  },
  {
    size: 9.73072872291283,
    price: 6705.3295086565,
    tradeSize: 6989.1406234457,
    status: 'grow',
    percentageOfChange: 3,
    time: '08:50:58',
  },
  {
    size: 9.41784779260095,
    price: 6844.9273839676,
    tradeSize: 6715.2485980017,
    status: 'grow',
    percentageOfChange: 40,
    time: '04:16:17',
  },
  {
    size: 0.5533867112133,
    price: 6248.3195645793,
    tradeSize: 5809.6263447372,
    status: 'grow',
    percentageOfChange: 83,
    time: '05:45:15',
  },
  {
    size: 7.67266342872624,
    price: 6526.5551888286,
    tradeSize: 4702.0265704776,
    status: 'fall',
    percentageOfChange: 94,
    time: '11:45:33',
  },
  {
    size: 2.78480009357343,
    price: 6433.6372075912,
    tradeSize: 5202.2647319776,
    status: 'grow',
    percentageOfChange: 100,
    time: '09:01:29',
  },
  {
    size: 9.00002734861167,
    price: 6207.7298855138,
    tradeSize: 3557.4828798206,
    status: 'fall',
    percentageOfChange: 48,
    time: '06:41:54',
  },
  {
    size: 4.99538890691994,
    price: 6584.6390090243,
    tradeSize: 5036.7619467949,
    status: 'fall',
    percentageOfChange: 96,
    time: '07:45:54',
  },
  {
    size: 4.66778392830911,
    price: 6757.415195951,
    tradeSize: 6988.844068779,
    status: 'grow',
    percentageOfChange: 17,
    time: '08:09:27',
  },
  {
    size: 4.90138065136625,
    price: 6600.8054418612,
    tradeSize: 6482.1301767547,
    status: 'grow',
    percentageOfChange: 61,
    time: '10:54:03',
  },
  {
    size: 5.2814337568435,
    price: 6102.4291649047,
    tradeSize: 6030.1210045271,
    status: 'fall',
    percentageOfChange: 76,
    time: '06:35:40',
  },
  {
    size: 2.00628459181453,
    price: 6706.8504262626,
    tradeSize: 4315.0051497081,
    status: 'grow',
    percentageOfChange: 17,
    time: '04:28:48',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.22291134768566,
    price: 6679.3373950316,
    tradeSize: 6292.7172492684,
    status: 'grow',
    percentageOfChange: 84,
    time: '03:15:28',
  },
  {
    size: 8.0215924778865,
    price: 6767.3850753966,
    tradeSize: 4803.3988546121,
    status: 'grow',
    percentageOfChange: 72,
    time: '02:02:26',
  },
  {
    size: 0.98991948727282,
    price: 6430.8934865315,
    tradeSize: 4870.3259860218,
    status: 'grow',
    percentageOfChange: 18,
    time: '10:36:42',
  },
  {
    size: 2.86501824707206,
    price: 6212.0423779329,
    tradeSize: 4839.7123681251,
    status: 'grow',
    percentageOfChange: 78,
    time: '09:41:20',
  },
  {
    size: 0.19734392216108,
    price: 6805.059283934,
    tradeSize: 6592.9646039247,
    status: 'fall',
    percentageOfChange: 98,
    time: '08:16:53',
  },
  {
    size: 5.30486680328928,
    price: 6980.295578196,
    tradeSize: 6483.3963325962,
    status: 'fall',
    percentageOfChange: 84,
    time: '04:20:50',
  },
  {
    size: 2.57858909943065,
    price: 6721.9678931011,
    tradeSize: 5139.7003918894,
    status: 'fall',
    percentageOfChange: 43,
    time: '12:09:30',
  },
  {
    size: 6.70013020235853,
    price: 6589.2757004946,
    tradeSize: 5315.0223041758,
    status: 'fall',
    percentageOfChange: 31,
    time: '02:40:57',
  },
  {
    size: 9.67689967529698,
    price: 6972.8815717086,
    tradeSize: 6579.6337662016,
    status: 'fall',
    percentageOfChange: 37,
    time: '03:43:04',
  },
  {
    size: 7.61182339317009,
    price: 6292.168018161,
    tradeSize: 3536.3733679086,
    status: 'grow',
    percentageOfChange: 55,
    time: '07:17:53',
  },
  {
    size: 9.12127386871223,
    price: 6011.0759932776,
    tradeSize: 6970.672182847,
    status: 'fall',
    percentageOfChange: 36,
    time: '01:00:42',
  },
  {
    size: 2.37032340322714,
    price: 6898.7641861993,
    tradeSize: 6986.1430397834,
    status: 'grow',
    percentageOfChange: 3,
    time: '05:46:52',
  },
  {
    size: 5.31064045887138,
    price: 6723.6344492437,
    tradeSize: 4207.7228635454,
    status: 'fall',
    percentageOfChange: 54,
    time: '02:45:42',
  },
  {
    size: 6.55441457502838,
    price: 6058.1024499834,
    tradeSize: 3358.1770352706,
    status: 'fall',
    percentageOfChange: 40,
    time: '09:57:20',
  },
]

export const usdSpread = [
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.56516896769892,
    price: 6711.127688053,
    tradeSize: 4873.7226253995,
    status: 'fall',
    percentageOfChange: 16,
    time: '05:45:01',
  },
  {
    size: 4.22291134768566,
    price: 6679.3373950316,
    tradeSize: 6292.7172492684,
    status: 'grow',
    percentageOfChange: 84,
    time: '03:15:28',
  },
  {
    size: 8.0215924778865,
    price: 6767.3850753966,
    tradeSize: 4803.3988546121,
    status: 'grow',
    percentageOfChange: 72,
    time: '02:02:26',
  },
  {
    size: 0.98991948727282,
    price: 6430.8934865315,
    tradeSize: 4870.3259860218,
    status: 'grow',
    percentageOfChange: 18,
    time: '10:36:42',
  },
  {
    size: 2.86501824707206,
    price: 6212.0423779329,
    tradeSize: 4839.7123681251,
    status: 'grow',
    percentageOfChange: 78,
    time: '09:41:20',
  },
  {
    size: 0.19734392216108,
    price: 6805.059283934,
    tradeSize: 6592.9646039247,
    status: 'fall',
    percentageOfChange: 98,
    time: '08:16:53',
  },
  {
    size: 5.30486680328928,
    price: 6980.295578196,
    tradeSize: 6483.3963325962,
    status: 'fall',
    percentageOfChange: 84,
    time: '04:20:50',
  },
  {
    size: 2.57858909943065,
    price: 6721.9678931011,
    tradeSize: 5139.7003918894,
    status: 'fall',
    percentageOfChange: 43,
    time: '12:09:30',
  },
  {
    size: 6.70013020235853,
    price: 6589.2757004946,
    tradeSize: 5315.0223041758,
    status: 'fall',
    percentageOfChange: 31,
    time: '02:40:57',
  },
  {
    size: 9.67689967529698,
    price: 6972.8815717086,
    tradeSize: 6579.6337662016,
    status: 'fall',
    percentageOfChange: 37,
    time: '03:43:04',
  },
  {
    size: 7.61182339317009,
    price: 6292.168018161,
    tradeSize: 3536.3733679086,
    status: 'grow',
    percentageOfChange: 55,
    time: '07:17:53',
  },
  {
    size: 9.12127386871223,
    price: 6011.0759932776,
    tradeSize: 6970.672182847,
    status: 'fall',
    percentageOfChange: 36,
    time: '01:00:42',
  },
  {
    size: 2.37032340322714,
    price: 6898.7641861993,
    tradeSize: 6986.1430397834,
    status: 'grow',
    percentageOfChange: 3,
    time: '05:46:52',
  },
  {
    size: 5.31064045887138,
    price: 6723.6344492437,
    tradeSize: 4207.7228635454,
    status: 'fall',
    percentageOfChange: 54,
    time: '02:45:42',
  },
  {
    size: 6.55441457502838,
    price: 6058.1024499834,
    tradeSize: 3358.1770352706,
    status: 'fall',
    percentageOfChange: 40,
    time: '09:57:20',
  },
]

export const exchanges = [
  {
    status: 'green',
    name: 'Bitfinex',
    cross: 'USD',
    price: 6535.9,
    exchange: 6535.2,
    vol: 9.7,
  },
  {
    status: 'green',
    name: 'Kekeke',
    cross: 'USD',
    price: 3232.9,
    exchange: 6544.2,
    vol: 12.7,
  },
  {
    status: 'green',
    name: 'Kekekek',
    cross: 'USD',
    price: 3205.3,
    exchange: 6524.2,
    vol: 12.8,
  },
  {
    status: '#828e3d',
    name: 'Kekekeeke',
    cross: 'USD',
    price: 3032.9,
    exchange: 6644.2,
    vol: 12.2,
  },
  {
    status: 'green',
    name: 'Kekekekeke',
    cross: 'USD',
    price: 3232.2,
    exchange: 6524.1,
    vol: 13.7,
  },
  {
    status: '#b53535',
    name: 'Ekekeke',
    cross: 'USD',
    price: 1423.9,
    exchange: 6524.3,
    vol: 14.7,
  },
]
