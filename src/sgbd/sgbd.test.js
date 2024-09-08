import { omitInternalNodes } from "./sgbd.js";

test('Should remove internal complex objects', () => {
  const testObj = {
    num: 1234,
    dec: 12.34,
    str: 'Test Lorem Ipslum',
    bool: true,
    arr: [],
    obj: {}
  }

  const exptObj = {
    num: 1234,
    dec: 12.34,
    str: 'Test Lorem Ipslum',
    bool: true,
    arr: 'NODE',
    obj: 'NODE'
  }

  const result = omitInternalNodes(testObj);

  expect(result).toEqual(exptObj);
});

test('Should return first level of array', () => {
  const testObj = [
    'a',
    {
      a: 'a',
      b: {}
    },
    [
      1, true
    ]
  ]

  const exptObj = [
    'a',
    {
      a: 'a',
      b: 'NODE'
    },
    'NODE'
  ]

  const result = omitInternalNodes(testObj);

  expect(result).toEqual(exptObj);
})
