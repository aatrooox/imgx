export const sizes = {
  // 2.35:1 公众号封面
  '001': {
    width: 500,
    height: 212,
    fontSize: 30,
    aspect: '2.35/1',
    desc: '2.35:1'
  },
  // 1:1
  '002': {
    width: 500,
    height: 500,
    fontSize: 30,
    aspect: '1/1',
    desc: '1:1'
  },
  // 4:3
  '003': {
    width: 500,
    height: 375,
    fontSize: 30,
    aspect: '4/3',
    desc: '4:3'
  },
  // 3:4
  '004': {
    width: 375,
    height: 500,
    fontSize: 30,
    aspect: '3/4',
    desc: '3:4'
  },
  // 16:9
  '005': {
    width: 500,
    height: 281,
    fontSize: 30,
    aspect: '16/9',
    desc: '16:9'
  }
}

export type SizeCode = keyof typeof sizes;
