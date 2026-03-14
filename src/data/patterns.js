const patterns = [
  {
    id: 'founder',
    num: '\u2460',
    name: '\uCC3D\uC5C5\uC790/\uC778\uBB3C\uBA85',
    examples: 'Chanel, Charlotte Tilbury, Huda Beauty',
    recommendedFor: ['luxury'],
    questions: [
      { key: 'personName', label: '\uB2F9\uC2E0\uC758 \uC774\uB984 (\uC131\u00B7\uC774\uB984\u00B7\uB2C9\uB124\uC784 \uBAA8\uB450 \uAC00\uB2A5)', hint: '\uC608: \uAE40\uC9C0\uC218 / Jisoo / \uC9C0\uC218' },
      { key: 'namePart', label: '\uC774\uB984\uC5D0\uC11C \uB530\uACE0 \uC2F6\uC740 \uBD80\uBD84', hint: '\uC608: \uC131\uB9CC, \uC774\uB2C8\uC15C, \uBC1C\uC74C \uBCC0\uD615' },
    ],
  },
  {
    id: 'emotion',
    num: '\u2461',
    name: '\uAC10\uAC01/\uAC10\uC815 \uB2E8\uC5B4',
    examples: 'Rare Beauty, Glossier, Too Faced',
    recommendedFor: ['mass'],
    questions: [
      { key: 'desiredEmotion', label: '\uACE0\uAC1D\uC774 \uB290\uB07C\uAE38 \uC6D0\uD558\uB294 \uAC10\uC815', hint: '\uC608: \uBE5B\uB0A8, \uB4DC\uBB38 \uC544\uB984\uB2E4\uC6C0, \uC194\uC9C1\uD568' },
      { key: 'avoidEmotion', label: '\uC808\uB300 \uD53C\uD558\uACE0 \uC2F6\uC740 \uB290\uB08C', hint: '\uC608: \uBB34\uAC81\uB2E4, \uC778\uACF5\uC801\uC774\uB2E4' },
    ],
  },
  {
    id: 'nature',
    num: '\u2462',
    name: '\uC790\uC5F0/\uC131\uBD84/\uC6D0\uB8CC',
    examples: 'Innisfree, Anua, Isntree',
    recommendedFor: ['kbeauty', 'derma'],
    questions: [
      { key: 'ingredient', label: '\uD575\uC2EC \uC131\uBD84\uC774\uB098 \uC790\uC5F0 \uC18C\uC7AC', hint: '\uC608: \uB179\uCC28, \uBCD1\uD480, \uC81C\uC8FC \uD654\uC0B0\uC218' },
      { key: 'natureImage', label: '\uC5F0\uC0C1\uB418\uAE38 \uC6D0\uD558\uB294 \uC790\uC5F0 \uC774\uBBF8\uC9C0', hint: '\uC608: \uC774\uC2AC \uB9FA\uD78C \uC774\uB978 \uC544\uCE68, \uCCAD\uC815 \uBC14\uB2E4' },
    ],
  },
  {
    id: 'coined',
    num: '\u2463',
    name: '\uC870\uC5B4/\uC2E0\uC870\uC5B4',
    examples: 'COSRX, Laneige, CeraVe',
    recommendedFor: ['mass', 'kbeauty'],
    questions: [
      { key: 'concepts', label: '\uB2F4\uACE0 \uC2F6\uC740 \uD575\uC2EC \uAC1C\uB150 2\uAC00\uC9C0', hint: '\uC608: \uBE5B + \uACFC\uD559 / \uC21C\uC218 + \uCC98\uBC29' },
      { key: 'pronounce', label: '\uBC1C\uC74C \uB290\uB08C \uBC29\uD5A5', hint: '\uC608: \uBD80\uB4DC\uB7FD\uACE0 \uC5EC\uC131\uC801\uC73C\uB85C / \uC720\uB7FD \uC5B4\uAC10\uC73C\uB85C' },
    ],
  },
  {
    id: 'acronym',
    num: '\u2464',
    name: '\uB450\uBB38\uC790\uC5B4/\uC57D\uC5B4',
    examples: 'MAC, NYX, COSRX, AHC',
    recommendedFor: ['derma'],
    questions: [
      { key: 'fullname', label: '\uBE0C\uB79C\uB4DC \uD480\uB124\uC784 \uD6C4\uBCF4 or \uB2F4\uACE0 \uC2F6\uC740 \uAC1C\uB150\uB4E4', hint: '\uC608: Korea Natural Cosmetic' },
      { key: 'acronymStyle', label: '\uC57D\uC5B4 \uC2A4\uD0C0\uC77C \uC120\uD638', hint: '\uC608: 3\uAE00\uC790 / \uC22B\uC790 \uD3EC\uD568 / \uC810(.) \uD3EC\uD568' },
    ],
  },
  {
    id: 'place',
    num: '\u2465',
    name: '\uC5ED\uC0AC/\uC9C0\uBA85/\uC2DC\uB300',
    examples: 'Beauty of Joseon, Sol de Janeiro, Jo Malone',
    recommendedFor: ['luxury', 'kbeauty'],
    questions: [
      { key: 'placeOrEra', label: '\uC5F0\uACB0\uD558\uACE0 \uC2F6\uC740 \uC7A5\uC18C \uB610\uB294 \uC2DC\uB300\uC801 \uBC30\uACBD', hint: '\uC608: \uC870\uC120\uC2DC\uB300 \uADDC\uBC29, \uC81C\uC8FC \uC624\uB984, 1920\uB144\uB300 \uD30C\uB9AC' },
      { key: 'placeEmotion', label: '\uADF8 \uC7A5\uC18C\uC5D0\uC11C \uC5F0\uC0C1\uB418\uB294 \uD575\uC2EC \uAC10\uC131', hint: '\uC608: \uB2E8\uC544\uD568, \uC774\uAD6D\uC801 \uC6B0\uC544\uD568, \uCCAD\uC815\uD568' },
    ],
  },
  {
    id: 'number',
    num: '\u2466',
    name: '\uC22B\uC790/\uCF54\uB4DC\uD615',
    examples: "23yearsold, AGE20's, No7",
    recommendedFor: ['derma', 'mass'],
    questions: [
      { key: 'numberMeaning', label: '\uB2F4\uACE0 \uC2F6\uC740 \uC22B\uC790\uC640 \uADF8 \uC758\uBBF8', hint: '\uC608: \uCC3D\uC5C5\uC5F0\uB3C4, \uC131\uBD84 \uB18D\uB3C4(%), \uACE0\uAC1D \uB098\uC774' },
      { key: 'numberCombo', label: '\uC22B\uC790\uC640 \uACB0\uD569\uD560 \uB2E8\uC5B4\uB098 \uAC1C\uB150', hint: '\uC608: 23+\uCCAD\uCD98 / 99+\uD53C\uBD80\uACFC\uD559' },
    ],
  },
];

export default patterns;
